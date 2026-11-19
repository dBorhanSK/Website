import { SITE_CONFIG, isAppwriteConfigured } from './config.js';

const SDK = window.Appwrite;
if (!SDK) throw new Error('Appwrite Web SDK did not load. Check the Appwrite CDN script in the HTML.');

const client = new SDK.Client()
  .setEndpoint(SITE_CONFIG.appwriteEndpoint)
  .setProject(SITE_CONFIG.appwriteProjectId);
const account = new SDK.Account(client);
const tables = new SDK.TablesDB(client);
const storage = new SDK.Storage(client);
const functions = new SDK.Functions(client);
const DB = SITE_CONFIG.appwriteDatabaseId;
const BUCKET = SITE_CONFIG.appwriteBucketId;
const OWNER = SITE_CONFIG.appwriteOwnerUserId;

const TABLE = {
  site_profile: 'site_profile',
  services: 'services',
  projects: 'projects',
  orders: 'orders',
  order_admin: 'order_admin',
  feedback_inbox: 'feedback_inbox',
  feedback_admin: 'feedback_admin',
  public_feedback: 'public_feedback',
  contact_messages: 'contact_messages',
  message_admin: 'message_admin'
};

function normalize(table, row) {
  if (!row) return row;
  const out = { ...row, id: row.$id, created_at: row.$createdAt, updated_at: row.$updatedAt };
  if (table === 'projects' && typeof out.stack === 'string') {
    out.stack = out.stack.split(',').map(x => x.trim()).filter(Boolean);
  }
  return out;
}

function toData(table, data = {}) {
  const out = { ...data };
  delete out.id;
  delete out.created_at;
  delete out.updated_at;
  if (['feedback', 'feedback_inbox', 'contact_messages', 'orders'].includes(table)) delete out.status;
  if (table === 'projects' && Array.isArray(out.stack)) out.stack = out.stack.join(', ');
  return out;
}

async function listRaw(table) {
  const response = await tables.listRows({
    databaseId: DB,
    tableId: TABLE[table] || table,
    queries: [SDK.Query.limit(100)]
  });
  return (response.rows || []).map(row => normalize(table, row));
}

async function getRaw(table, id) {
  try {
    return normalize(table, await tables.getRow({ databaseId: DB, tableId: TABLE[table] || table, rowId: String(id) }));
  } catch (error) {
    if (Number(error?.code) === 404) return null;
    throw error;
  }
}

async function createRaw(table, data, id) {
  const rowId = id || SDK.ID.unique();
  const row = await tables.createRow({ databaseId: DB, tableId: TABLE[table] || table, rowId, data: toData(table, data) });
  return normalize(table, row);
}

async function updateRaw(table, id, data) {
  const row = await tables.updateRow({ databaseId: DB, tableId: TABLE[table] || table, rowId: String(id), data: toData(table, data) });
  return normalize(table, row);
}

async function upsertRaw(table, id, data) {
  const row = await tables.upsertRow({ databaseId: DB, tableId: TABLE[table] || table, rowId: String(id), data: toData(table, data) });
  return normalize(table, row);
}

async function deleteRaw(table, id) {
  return tables.deleteRow({ databaseId: DB, tableId: TABLE[table] || table, rowId: String(id) });
}

async function currentUser() {
  try { const user = await account.get(); return { ...user, id: user.$id }; } catch { return null; }
}
const isOwner = async () => {
  const user = await currentUser();
  return Boolean(user && user.$id === OWNER);
};

async function ensureAdminRow(table, id, defaults) {
  const existing = await getRaw(table, id);
  if (existing) return existing;
  return upsertRaw(table, id, defaults);
}

async function selectRows(table, filters, ordering, take) {
  const user = await currentUser();
  const owner = Boolean(user && user.$id === OWNER);
  let rows = [];

  if (table === 'site_admins') {
    return owner && filters.some(([key, value]) => key === 'user_id' && value === OWNER)
      ? [{ user_id: OWNER, role: 'owner' }] : [];
  }

  if (table === 'orders' && owner) {
    const publicRows = await listRaw('orders');
    const metadata = await listRaw('order_admin');
    const byId = new Map(metadata.map(r => [r.id, r]));
    rows = await Promise.all(publicRows.map(async r => {
      let meta = byId.get(r.id);
      if (!meta) meta = await ensureAdminRow('order_admin', r.id, { status: 'new', quote: '', admin_note: '', delivery_message: '', delivery_url: '', delivery_path: '' });
      return { ...r, ...meta, id: r.id, public_code: r.public_code, created_at: r.created_at, attachment_path: r.attachment_path };
    }));
  } else if (table === 'contact_messages' && owner) {
    const publicRows = await listRaw('contact_messages');
    const metadata = await listRaw('message_admin');
    const byId = new Map(metadata.map(r => [r.id, r]));
    rows = await Promise.all(publicRows.map(async r => {
      let meta = byId.get(r.id);
      if (!meta) meta = await ensureAdminRow('message_admin', r.id, { status: 'new', owner_reply: '' });
      return { ...r, ...meta, id: r.id, created_at: r.created_at };
    }));
  } else if (table === 'feedback') {
    if (owner) {
      const publicRows = await listRaw('feedback_inbox');
      const metadata = await listRaw('feedback_admin');
      const byId = new Map(metadata.map(r => [r.id, r]));
      rows = await Promise.all(publicRows.map(async r => {
        let meta = byId.get(r.id);
        if (!meta) meta = await ensureAdminRow('feedback_admin', r.id, { status: 'pending' });
        return { ...r, ...meta, id: r.id, created_at: r.created_at };
      }));
    } else {
      rows = (await listRaw('public_feedback')).map(r => ({ ...r, status: 'approved' }));
    }
  } else {
    rows = await listRaw(table);
  }

  for (const [key, value] of filters) {
    const expected = table === 'site_profile' && key === 'id' && value === true ? 'main' : value;
    rows = rows.filter(row => row[key] === expected);
  }
  if (ordering) {
    const { column, ascending } = ordering;
    rows.sort((a, b) => {
      const av = a[column] ?? '';
      const bv = b[column] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return ascending ? cmp : -cmp;
    });
  } else {
    rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  }
  return rows.slice(0, take || 100);
}

class QueryBuilder {
  constructor(table) { this.table = table; this.action = 'select'; this.payload = null; this.filters = []; this.ordering = null; this.take = 100; }
  select() { this.action = this.action === 'select' ? 'select' : this.action; return this; }
  eq(column, value) { this.filters.push([column, value]); return this; }
  order(column, options = {}) { this.ordering = { column, ascending: options.ascending !== false }; return this; }
  limit(value) { this.take = Math.min(100, Math.max(1, Number(value) || 100)); return this; }
  maybeSingle() { this.single = true; return this.execute(); }
  insert(payload) { this.action = 'insert'; this.payload = payload; return this; }
  update(payload) { this.action = 'update'; this.payload = payload; return this; }
  upsert(payload) { this.action = 'upsert'; this.payload = payload; return this; }
  delete() { this.action = 'delete'; return this; }
  then(resolve, reject) { return this.execute().then(resolve, reject); }

  async execute() {
    try {
      const owner = await isOwner();
      let data = null;
      if (this.action === 'select') {
        data = await selectRows(this.table, this.filters, this.ordering, this.take);
        if (this.single) data = data[0] || null;
      } else if (this.action === 'insert') {
        const payloads = Array.isArray(this.payload) ? this.payload : [this.payload];
        const created = [];
        for (const payload of payloads) {
          if (this.table === 'orders') created.push(await createRaw('orders', payload));
          else if (this.table === 'contact_messages') created.push(await createRaw('contact_messages', payload));
          else if (this.table === 'feedback') created.push(await createRaw('feedback_inbox', payload));
          else created.push(await createRaw(this.table, payload));
        }
        data = Array.isArray(this.payload) ? created : created[0];
      } else if (this.action === 'update') {
        if (!owner) throw new Error('Owner permission required.');
        const idFilter = this.filters.find(([key]) => key === 'id');
        if (!idFilter) throw new Error('An id filter is required for updates.');
        const id = idFilter[1];
        if (this.table === 'orders') data = await upsertRaw('order_admin', id, this.payload);
        else if (this.table === 'contact_messages') data = await upsertRaw('message_admin', id, this.payload);
        else if (this.table === 'feedback') {
          const status = this.payload?.status;
          const original = await getRaw('feedback_inbox', id);
          if (!original) throw new Error('Feedback entry not found.');
          if (status === 'approved') await upsertRaw('public_feedback', id, { name: original.name, kind: original.kind, message: original.message, locale: original.locale });
          if (status === 'rejected') { const published = await getRaw('public_feedback', id); if (published) await deleteRaw('public_feedback', id); }
          data = await upsertRaw('feedback_admin', id, this.payload);
        } else data = await upsertRaw(this.table, id, this.payload);
      } else if (this.action === 'upsert') {
        if (!owner) throw new Error('Owner permission required.');
        const id = this.payload?.id === true ? 'main' : this.payload?.id;
        if (!id) throw new Error('Upsert needs a row id.');
        data = await upsertRaw(this.table, id, this.payload);
      } else if (this.action === 'delete') {
        if (!owner) throw new Error('Owner permission required.');
        const idFilter = this.filters.find(([key]) => key === 'id');
        if (!idFilter) throw new Error('An id filter is required for deletes.');
        const id = idFilter[1];
        if (this.table === 'feedback') {
          for (const table of ['public_feedback', 'feedback_admin', 'feedback_inbox']) {
            const existing = await getRaw(table, id); if (existing) await deleteRaw(table, id);
          }
        } else await deleteRaw(this.table, id);
        data = { id };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Appwrite compatibility operation failed:', error);
      return { data: null, error };
    }
  }
}

function createStorageCompat() {
  return {
    from(bucketAlias) {
      return {
        async upload(path, file) {
          try {
            // The bucket grants CREATE to Any and READ only to the owner.
            // Do not attach client-supplied per-file permissions: anonymous visitors
            // must never be able to grant themselves access to private uploads.
            const result = await storage.createFile({ bucketId: BUCKET, fileId: SDK.ID.unique(), file });
            return { data: { path: result.$id }, error: null };
          } catch (error) { return { data: null, error }; }
        },
        async createSignedUrl(path, expiresInSeconds = 600) {
          try {
            if (!await isOwner()) throw new Error('Owner permission required to create a download link.');
            const functionId = SITE_CONFIG.appwriteDeliveryFunctionId;
            if (!functionId || functionId.includes('YOUR_')) throw new Error('Configure appwriteDeliveryFunctionId in config.js.');
            const execution = await functions.createExecution({
              functionId,
              body: JSON.stringify({ fileId: String(path), expiresInSeconds: Number(expiresInSeconds) || 600 }),
              async: false,
              method: 'POST'
            });
            if (Number(execution.responseStatusCode) < 200 || Number(execution.responseStatusCode) >= 300) {
              throw new Error(execution.responseBody || `Delivery-link function returned ${execution.responseStatusCode}`);
            }
            const result = JSON.parse(execution.responseBody || '{}');
            if (!result.url) throw new Error(result.message || 'The delivery-link function did not return a URL.');
            return { data: { signedUrl: result.url }, error: null };
          } catch (error) { return { data: null, error }; }
        },
        async remove(paths) {
          try {
            for (const path of paths || []) await storage.deleteFile({ bucketId: BUCKET, fileId: String(path) });
            return { data: [], error: null };
          } catch (error) { return { data: null, error }; }
        }
      };
    }
  };
}

export function createClient() {
  const auth = {
    async signInWithPassword({ email, password }) {
      try {
        await account.createEmailPasswordSession({ email, password });
        const rawUser = await account.get();
        const user = { ...rawUser, id: rawUser.$id };
        return { data: { user }, error: null };
      } catch (error) { return { data: { user: null }, error }; }
    },
    async signOut() {
      try { await account.deleteSession({ sessionId: 'current' }); return { error: null }; }
      catch (error) { return { error }; }
    },
    async getSession() {
      try { const rawUser = await account.get(); const user = { ...rawUser, id: rawUser.$id }; return { data: { session: { user } }, error: null }; }
      catch { return { data: { session: null }, error: null }; }
    }
  };

  return {
    auth,
    storage: createStorageCompat(),
    from(table) { return new QueryBuilder(table); }
  };
}

export { client, tables, storage, functions };
export const isConfigured = isAppwriteConfigured;
