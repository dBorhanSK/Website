import { Client, TablesDB, Storage, Tokens, Query, ID } from 'node-appwrite';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

const safeName = value => String(value || '').replace(/[\r\n\t]/g, ' ').trim().slice(0, 120);
const parseAttachments = value => {
  try { const parsed = JSON.parse(value || '[]'); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
};

export default async ({ req, log, error }) => {
  try {
    const ownerId = process.env.BORHAN_OWNER_USER_ID || '';
    const databaseId = process.env.BORHAN_DATABASE_ID || 'borhan_sk';
    const bucketId = process.env.BORHAN_BUCKET_ID || 'client_files';
    const callerId = req.headers?.['x-appwrite-user-id'] || '';
    if (!callerId) return json({ ok: false, message: 'A customer session is required. Refresh the page and try again.' }, 401);

    const body = req.bodyJson || (req.bodyText ? JSON.parse(req.bodyText) : {});
    const action = String(body.action || '');
    const orderId = String(body.orderId || '');
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(orderId)) {
      return json({ ok: false, message: 'Invalid order reference.' }, 400);
    }

    const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
    const apiKey = req.headers?.['x-appwrite-key'];
    if (!endpoint || !projectId || !apiKey || !ownerId) {
      error('Missing order-chat Function runtime configuration.');
      return json({ ok: false, message: 'The chat service is not configured correctly.' }, 500);
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const tables = new TablesDB(client);
    const storage = new Storage(client);
    const tokens = new Tokens(client);

    let order;
    try {
      order = await tables.getRow({ databaseId, tableId: 'orders', rowId: orderId });
    } catch (e) {
      if (Number(e?.code) === 404) return json({ ok: false, message: 'This order could not be found.' }, 404);
      throw e;
    }

    const owner = callerId === ownerId;
    const customer = Boolean(order.customer_user_id && callerId === order.customer_user_id);
    if (!owner && !customer) return json({ ok: false, message: 'You do not have access to this conversation.' }, 403);

    const listMessages = async () => {
      const result = await tables.listRows({
        databaseId,
        tableId: 'order_messages',
        queries: [Query.equal('order_id', orderId), Query.limit(100)]
      });
      return (result.rows || []).map(row => ({
        id: row.$id,
        sender_id: row.sender_id,
        sender_role: row.sender_role,
        sender_name: row.sender_name,
        body: row.body || '',
        attachments: parseAttachments(row.attachments_json),
        created_at: row.$createdAt
      })).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    };

    if (action === 'list') {
      return json({ ok: true, rows: await listMessages() });
    }

    if (action === 'send') {
      const message = String(body.message || '').trim().slice(0, 8000);
      const files = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];
      if (!message && !files.length) return json({ ok: false, message: 'Write a message or attach at least one file.' }, 400);
      if (Array.isArray(body.attachments) && body.attachments.length > 5) {
        return json({ ok: false, message: 'You can attach up to five files to one message.' }, 400);
      }

      const verifiedFiles = [];
      for (const item of files) {
        const fileId = String(item?.id || '');
        if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(fileId)) return json({ ok: false, message: 'One of the attached files is invalid.' }, 400);
        const file = await storage.getFile({ bucketId, fileId });
        if (!owner) {
          const grants = Array.isArray(file.$permissions) ? file.$permissions : [];
          const ownGrant = grants.some(permission => permission.includes(`user:${callerId}`));
          if (!ownGrant) return json({ ok: false, message: 'The attached file does not belong to this session.' }, 403);
        }
        verifiedFiles.push({
          id: file.$id,
          name: safeName(file.name || item.name || 'attachment'),
          type: String(file.mimeType || item.type || 'application/octet-stream').slice(0, 120),
          size: Number(file.sizeOriginal || item.size || 0)
        });
      }

      // Basic per-order rate limit to reduce spam from public guest sessions.
      const recent = await tables.listRows({
        databaseId,
        tableId: 'order_messages',
        queries: [Query.equal('order_id', orderId), Query.limit(100)]
      });
      const lastMinute = (recent.rows || []).filter(row => row.sender_id === callerId && Date.now() - new Date(row.$createdAt).getTime() < 60_000).length;
      if (lastMinute >= 12) return json({ ok: false, message: 'Please wait a moment before sending another message.' }, 429);

      const row = await tables.createRow({
        databaseId,
        tableId: 'order_messages',
        rowId: ID.unique(),
        data: {
          order_id: orderId,
          sender_id: callerId,
          sender_role: owner ? 'owner' : 'customer',
          sender_name: owner ? 'Borhan_SK' : safeName(order.client_name || 'Customer'),
          body: message,
          attachments_json: JSON.stringify(verifiedFiles)
        }
      });
      return json({ ok: true, id: row.$id, created_at: row.$createdAt });
    }

    if (action === 'file_link') {
      const messageId = String(body.messageId || '');
      const fileId = String(body.fileId || '');
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(messageId) || !/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(fileId)) {
        return json({ ok: false, message: 'Invalid file reference.' }, 400);
      }
      const row = await tables.getRow({ databaseId, tableId: 'order_messages', rowId: messageId });
      if (row.order_id !== orderId || !parseAttachments(row.attachments_json).some(file => file.id === fileId)) {
        return json({ ok: false, message: 'This file is not part of the selected conversation.' }, 403);
      }
      const file = await storage.getFile({ bucketId, fileId });
      const expire = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const token = await tokens.createFileToken({ bucketId, fileId, expire });
      const safeInlineImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/bmp'];
      const mode = safeInlineImages.includes(String(file.mimeType || '').toLowerCase()) ? 'view' : 'download';
      const url = `${endpoint.replace(/\/$/, '')}/storage/buckets/${encodeURIComponent(bucketId)}/files/${encodeURIComponent(fileId)}/${mode}?project=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token.secret)}`;
      return json({ ok: true, url, mode, expiresAt: expire });
    }

    const deleteStoredFiles = async fileIds => {
      for (const fileId of [...new Set(fileIds.map(value => String(value || '').trim()).filter(Boolean))]) {
        try {
          await storage.deleteFile({ bucketId, fileId });
        } catch (e) {
          // A previous cleanup attempt may already have removed this file.
          if (Number(e?.code) !== 404) throw e;
        }
      }
    };

    const getOrderAdmin = async () => {
      try {
        return await tables.getRow({ databaseId, tableId: 'order_admin', rowId: orderId });
      } catch (e) {
        if (Number(e?.code) === 404) return null;
        throw e;
      }
    };

    const removeConversationRows = async () => {
      const fileIds = new Set();
      let deletedMessages = 0;
      // Read the first page repeatedly; deleting it advances the next batch without offset gaps.
      while (true) {
        const batch = await tables.listRows({
          databaseId,
          tableId: 'order_messages',
          queries: [Query.equal('order_id', orderId), Query.limit(100)]
        });
        const rows = batch.rows || [];
        if (!rows.length) break;
        for (const row of rows) {
          for (const file of parseAttachments(row.attachments_json)) {
            if (file?.id) fileIds.add(String(file.id));
          }
        }
        // Delete the stored files before deleting their database references.
        await deleteStoredFiles([...fileIds]);
        for (const row of rows) {
          await tables.deleteRow({ databaseId, tableId: 'order_messages', rowId: row.$id });
          deletedMessages++;
        }
      }
      return { fileIds: [...fileIds], deletedMessages };
    };

    if (action === 'delete_message') {
      if (!owner) return json({ ok: false, message: 'Only the owner can remove messages.' }, 403);
      const messageId = String(body.messageId || '');
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(messageId)) {
        return json({ ok: false, message: 'Invalid message reference.' }, 400);
      }
      const row = await tables.getRow({ databaseId, tableId: 'order_messages', rowId: messageId });
      if (row.order_id !== orderId) return json({ ok: false, message: 'Message not found in this order.' }, 404);
      const fileIds = parseAttachments(row.attachments_json).map(file => file.id).filter(Boolean);
      await deleteStoredFiles(fileIds);
      await tables.deleteRow({ databaseId, tableId: 'order_messages', rowId: messageId });
      return json({ ok: true, deletedFiles: fileIds.length });
    }

    if (action === 'clear_conversation') {
      if (!owner) return json({ ok: false, message: 'Only the owner can clear an order conversation.' }, 403);
      const admin = await getOrderAdmin();
      const cleared = await removeConversationRows();
      const deliveryPath = admin?.delivery_path ? String(admin.delivery_path) : '';
      if (deliveryPath) await deleteStoredFiles([deliveryPath]);
      if (admin) {
        await tables.updateRow({
          databaseId,
          tableId: 'order_admin',
          rowId: orderId,
          data: { delivery_path: '', delivery_url: '', delivery_message: '' }
        });
      }
      return json({ ok: true, deletedMessages: cleared.deletedMessages, deletedFiles: new Set([...cleared.fileIds, deliveryPath].filter(Boolean)).size });
    }

    if (action === 'delete_order') {
      if (!owner) return json({ ok: false, message: 'Only the owner can remove an order conversation.' }, 403);
      const admin = await getOrderAdmin();
      const cleared = await removeConversationRows();
      const extraFiles = [order.attachment_path, admin?.delivery_path].filter(Boolean).map(String);
      await deleteStoredFiles(extraFiles);
      return json({ ok: true, deletedMessages: cleared.deletedMessages, deletedFiles: new Set([...cleared.fileIds, ...extraFiles]).size });
    }

    return json({ ok: false, message: 'Unknown chat action.' }, 400);
  } catch (err) {
    error(`Order chat failed: ${err?.message || String(err)}`);
    const code = Number(err?.code) || 500;
    return json({ ok: false, message: code === 401 || code === 403 ? 'Access denied. Please refresh the page and try again.' : 'The message could not be processed. Check your connection and try again.' }, code >= 400 && code < 600 ? code : 500);
  }
};
