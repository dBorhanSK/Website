import { Client, Tokens } from 'node-appwrite';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

export default async ({ req, res, log, error }) => {
  try {
    const ownerId = process.env.BORHAN_OWNER_USER_ID || '';
    const callerId = req.headers?.['x-appwrite-user-id'] || '';

    // Function execution is also restricted to the owner in Console settings.
    // This server-side check is a second security barrier.
    if (!ownerId || !callerId || callerId !== ownerId) {
      return json({ ok: false, message: 'Owner access required.' }, 403);
    }

    const body = req.bodyJson || (req.bodyText ? JSON.parse(req.bodyText) : {});
    const fileId = String(body.fileId || '');
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{7,35}$/.test(fileId)) {
      return json({ ok: false, message: 'Invalid file ID.' }, 400);
    }

    const bucketId = process.env.BORHAN_BUCKET_ID || 'client_files';
    const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
    const apiKey = req.headers?.['x-appwrite-key'];

    if (!endpoint || !projectId || !apiKey) {
      error('Missing Appwrite Function runtime credentials.');
      return json({ ok: false, message: 'Function configuration is incomplete.' }, 500);
    }

    // Short-lived links are used for customer attachments (10 minutes).
    // Owner delivery links are created with a 30-day expiry by the dashboard.
    const requestedSeconds = Number(body.expiresInSeconds || 600);
    const expiresInSeconds = Math.max(60, Math.min(30 * 24 * 60 * 60, requestedSeconds));
    const expire = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);
    const tokens = new Tokens(client);
    const token = await tokens.createFileToken({ bucketId, fileId, expire });

    const base = endpoint.replace(/\/$/, '');
    const url = `${base}/storage/buckets/${encodeURIComponent(bucketId)}/files/${encodeURIComponent(fileId)}/download?project=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token.secret)}`;

    return json({ ok: true, url, expiresAt: expire }, 200);
  } catch (err) {
    error(`Failed to create a delivery token: ${err?.message || String(err)}`);
    return json({ ok: false, message: 'Could not create a download link.' }, 500);
  }
};
