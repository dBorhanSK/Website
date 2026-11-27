/**
 * Creates the Borhan_SK TablesDB schema and one secure Storage bucket.
 * Run locally with Node.js 20+ after creating the Appwrite project and owner account.
 * The API key is read from .env and is NEVER referenced by browser code.
 */
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(file = '.env') {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[key] ??= value;
  }
}
loadEnvFile();

const endpoint = (process.env.APPWRITE_ENDPOINT || '').replace(/\/$/, '');
const projectId = process.env.APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const ownerId = process.env.APPWRITE_OWNER_USER_ID || '';
const databaseId = process.env.APPWRITE_DATABASE_ID || 'borhan_sk';
const bucketId = process.env.APPWRITE_BUCKET_ID || 'client_files';

for (const [key, value] of Object.entries({ APPWRITE_ENDPOINT: endpoint, APPWRITE_PROJECT_ID: projectId, APPWRITE_API_KEY: apiKey, APPWRITE_OWNER_USER_ID: ownerId })) {
  if (!value || value.includes('YOUR_')) throw new Error(`Missing or placeholder value for ${key}. Fill your local .env file first.`);
}
if (!/^https:\/\/[a-z0-9-]+\.cloud\.appwrite\.io\/v1$/i.test(endpoint)) {
  throw new Error('APPWRITE_ENDPOINT must be your Appwrite Cloud API endpoint, for example https://fra.cloud.appwrite.io/v1');
}

const headers = {
  'X-Appwrite-Project': projectId,
  'X-Appwrite-Key': apiKey,
  'Content-Type': 'application/json'
};

async function request(method, route, body) {
  const response = await fetch(`${endpoint}${route}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) {
    const error = new Error(data.message || `${method} ${route} failed (${response.status})`);
    error.status = response.status;
    error.type = data.type;
    throw error;
  }
  return data;
}

const owner = [
  `read("user:${ownerId}")`,
  `create("user:${ownerId}")`,
  `update("user:${ownerId}")`,
  `delete("user:${ownerId}")`
];
const publicReadOwnerWrite = [`read("any")`, ...owner];
const publicCreateOwnerRead = [`create("any")`, `read("user:${ownerId}")`, `delete("user:${ownerId}")`];

const varchar = (key, size = 255, extra = {}) => ({ type: 'varchar', key, size, required: false, ...extra });
const text = (key, extra = {}) => ({ type: 'text', key, required: false, ...extra });
const integer = (key, extra = {}) => ({ type: 'integer', key, required: false, ...extra });
const boolean = (key, extra = {}) => ({ type: 'boolean', key, required: false, ...extra });

const tables = [
  {
    id: 'site_profile', name: 'Site profile', permissions: publicReadOwnerWrite,
    columns: [
      varchar('headline_fa', 200), varchar('headline_en', 200), text('bio_fa'), text('bio_en'),
      varchar('location_fa', 200), varchar('location_en', 200), varchar('focus_fa', 200), varchar('focus_en', 200),
      text('skills_fa'), text('skills_en'), varchar('telegram_url', 500), varchar('linkedin_url', 500),
      varchar('github_url', 500), varchar('email', 254), varchar('resume_url', 500)
    ]
  },
  {
    id: 'services', name: 'Services', permissions: publicReadOwnerWrite,
    columns: [varchar('title_fa', 150), varchar('title_en', 150), text('description_fa'), text('description_en'), varchar('icon', 24), integer('sort_order'), boolean('is_published')]
  },
  {
    id: 'projects', name: 'Projects', permissions: publicReadOwnerWrite,
    columns: [varchar('title_fa', 150), varchar('title_en', 150), text('summary_fa'), text('summary_en'), text('description_fa'), text('description_en'), varchar('category', 80), varchar('stack', 1000), varchar('project_url', 500), varchar('repo_url', 500), varchar('cover_url', 500), varchar('cover_file_id', 64), varchar('icon', 24), boolean('is_published'), integer('sort_order')]
  },
  {
    id: 'orders', name: 'Public project requests', permissions: publicCreateOwnerRead,
    columns: [varchar('public_code', 32), varchar('client_name', 120), varchar('email', 254), varchar('telegram', 120), varchar('service_key', 80), varchar('budget_key', 80), varchar('deadline_key', 80), varchar('title', 180), text('description'), varchar('locale', 8), varchar('attachment_path', 64), varchar('customer_user_id', 36)]
  },
  {
    id: 'order_messages', name: 'Private order conversations', permissions: [],
    columns: [varchar('order_id', 36), varchar('sender_id', 36), varchar('sender_role', 16), varchar('sender_name', 120), text('body'), text('attachments_json')]
  },
  {
    id: 'order_admin', name: 'Private order management', permissions: owner,
    columns: [varchar('status', 32), varchar('quote', 200), text('admin_note'), text('delivery_message'), varchar('delivery_url', 1000), varchar('delivery_path', 64)]
  },
  {
    id: 'feedback_inbox', name: 'Private feedback inbox', permissions: publicCreateOwnerRead,
    columns: [varchar('name', 120), varchar('kind', 32), text('message'), varchar('locale', 8)]
  },
  {
    id: 'feedback_admin', name: 'Private feedback moderation', permissions: owner,
    columns: [varchar('status', 24)]
  },
  {
    id: 'public_feedback', name: 'Approved public feedback', permissions: publicReadOwnerWrite,
    columns: [varchar('name', 120), varchar('kind', 32), text('message'), varchar('locale', 8)]
  },
  {
    id: 'contact_messages', name: 'Private support inbox', permissions: publicCreateOwnerRead,
    columns: [varchar('name', 120), varchar('email', 254), varchar('subject', 180), text('message'), varchar('locale', 8)]
  },
  {
    id: 'message_admin', name: 'Private support message status', permissions: owner,
    columns: [varchar('status', 24), text('owner_reply')]
  }
];

async function ensureDatabase() {
  try {
    await request('GET', `/tablesdb/${encodeURIComponent(databaseId)}`);
    console.log(`Database exists: ${databaseId}`);
  } catch (error) {
    if (error.status !== 404) throw error;
    await request('POST', '/tablesdb', { databaseId, name: 'Borhan SK', enabled: true, specification: 'serverless', description: 'Bilingual portfolio, project requests and owner dashboard.' });
    console.log(`Created database: ${databaseId}`);
  }
}

async function ensureTable(table) {
  const route = `/tablesdb/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(table.id)}`;
  let exists = true;
  try { await request('GET', route); }
  catch (error) {
    if (error.status !== 404) throw error;
    exists = false;
  }
  const payload = { tableId: table.id, name: table.name, permissions: table.permissions, rowSecurity: false, enabled: true };
  if (!exists) await request('POST', `/tablesdb/${encodeURIComponent(databaseId)}/tables`, payload);
  else await request('PUT', route, { name: table.name, permissions: table.permissions, rowSecurity: false, enabled: true });

  for (const column of table.columns) await ensureColumn(table.id, column);
  if (table.id === 'order_messages') await ensureIndex(table.id, 'order_id_index', ['order_id']);
  console.log(`Ready table: ${table.id} (${table.columns.length} columns)`);
}

async function ensureColumn(tableId, column) {
  const base = `/tablesdb/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(tableId)}/columns`;
  const getRoute = `${base}/${encodeURIComponent(column.key)}`;
  try {
    await request('GET', getRoute);
    return;
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  const { type, ...payload } = column;
  await request('POST', `${base}/${type}`, payload);
  // Appwrite creates columns asynchronously; wait until the column is ready.
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const current = await request('GET', getRoute);
      if (current.status === 'available') return;
      if (current.status === 'failed') throw new Error(`Appwrite could not create column ${tableId}.${column.key}`);
    } catch (error) {
      if (error.status && error.status !== 404) throw error;
    }
  }
  throw new Error(`Timed out waiting for column ${tableId}.${column.key}`);
}


async function ensureIndex(tableId, key, columns) {
  const base = `/tablesdb/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(tableId)}/indexes`;
  try { await request('GET', `${base}/${encodeURIComponent(key)}`); return; }
  catch (error) { if (error.status !== 404) throw error; }
  await request('POST', base, { key, type: 'key', columns, orders: columns.map(() => 'ASC') });
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = await request('GET', `${base}/${encodeURIComponent(key)}`);
    if (index.status === 'available') return;
    if (index.status === 'failed') throw new Error(`Appwrite could not create index ${tableId}.${key}`);
  }
  throw new Error(`Timed out waiting for index ${tableId}.${key}`);
}

async function ensureBucket() {
  const route = `/storage/buckets/${encodeURIComponent(bucketId)}`;
  let exists = true;
  try { await request('GET', route); }
  catch (error) {
    if (error.status !== 404) throw error;
    exists = false;
  }
  const payload = {
    bucketId,
    name: 'Borhan SK Client Files',
    permissions: [
      `create("any")`,
      `read("user:${ownerId}")`,
      `update("user:${ownerId}")`,
      `delete("user:${ownerId}")`
    ],
    fileSecurity: true,
    enabled: true,
    maximumFileSize: 50 * 1024 * 1024,
    allowedFileExtensions: [],
    encryption: true,
    stripMetadata: true,
    description: 'Customer attachments and owner-delivered project files.'
  };
  if (!exists) await request('POST', '/storage/buckets', payload);
  else await request('PUT', route, { name: payload.name, permissions: payload.permissions, fileSecurity: payload.fileSecurity, enabled: payload.enabled, maximumFileSize: payload.maximumFileSize, allowedFileExtensions: payload.allowedFileExtensions, encryption: payload.encryption, stripMetadata: payload.stripMetadata, description: payload.description });
  console.log(`Ready bucket: ${bucketId}`);
}

try {
  console.log('Starting Borhan_SK Appwrite setup...');
  await ensureDatabase();
  for (const table of tables) await ensureTable(table);
  await ensureBucket();
  console.log('\nSUCCESS: Borhan_SK Appwrite database and storage schema are ready.');
  console.log('Next: copy Project ID, Owner User ID and endpoint into public/assets/js/config.js.');
  console.log('Also deploy functions/order-chat as the order_chat Appwrite Function; see README_FA.md.');
  console.log('Security: remove the temporary setup API key from Appwrite Console after setup.');
} catch (error) {
  console.error('\nSETUP FAILED:', error.message);
  if (error.status === 401 || error.status === 403) {
    console.error('Check the API key scopes: databases.read/write, tables.read/write, columns.read/write, indexes.read/write, buckets.read/write.');
  }
  process.exitCode = 1;
}
