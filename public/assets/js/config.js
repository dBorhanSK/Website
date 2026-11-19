// Public Appwrite configuration. Project IDs and the owner user ID are identifiers,
// not secrets. NEVER place an Appwrite API key in this file.
export const SITE_CONFIG = {
  appwriteEndpoint: 'https://fra.cloud.appwrite.io/v1',
  appwriteProjectId: 'YOUR_APPWRITE_PROJECT_ID',
  appwriteDatabaseId: 'borhan_sk',
  appwriteOwnerUserId: 'YOUR_APPWRITE_OWNER_USER_ID',
  appwriteBucketId: 'client_files',
  appwriteDeliveryFunctionId: 'delivery_link',
  social: {
    telegram: 'https://t.me/YOUR_CHANNEL',
    linkedin: 'https://www.linkedin.com/in/YOUR_PROFILE/',
    github: 'https://github.com/YOUR_USERNAME',
    email: 'YOUR_EMAIL@example.com'
  },
  maxUploadBytes: 12 * 1024 * 1024
};

export const isAppwriteConfigured = () =>
  /^https:\/\/[a-z0-9-]+\.cloud\.appwrite\.io\/v1$/i.test(SITE_CONFIG.appwriteEndpoint) &&
  /^[a-zA-Z0-9][a-zA-Z0-9._-]{7,35}$/.test(SITE_CONFIG.appwriteProjectId) &&
  /^[a-zA-Z0-9._-]{8,}$/i.test(SITE_CONFIG.appwriteOwnerUserId) &&
  SITE_CONFIG.appwriteProjectId !== 'YOUR_APPWRITE_PROJECT_ID' &&
  SITE_CONFIG.appwriteOwnerUserId !== 'YOUR_APPWRITE_OWNER_USER_ID';
