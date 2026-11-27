// Public Appwrite configuration. Project IDs and the owner user ID are identifiers,
// not secrets. NEVER place an Appwrite API key in this file.
export const SITE_CONFIG = {
  appwriteEndpoint: 'https://fra.cloud.appwrite.io/v1',
  appwriteProjectId: '6af9a0a7000035d5d551',
  appwriteDatabaseId: 'borhan_sk',
  appwriteOwnerUserId: '6afef76b00124e0aa655',
  appwriteBucketId: 'client_files',
  appwriteDeliveryFunctionId: 'delivery_link',
  appwriteChatFunctionId: 'order_chat',
  social: {
    telegram: 'https://t.me/YOUR_TELEGRAM_USERNAME',
    linkedin: 'https://www.linkedin.com/in/borhan-sk/',
    email: 'dBorhan.SK@example.com'
  },
  maxUploadBytes: 50 * 1024 * 1024
};

export const isAppwriteConfigured = () =>
  /^https:\/\/[a-z0-9-]+\.cloud\.appwrite\.io\/v1$/i.test(SITE_CONFIG.appwriteEndpoint) &&
  /^[a-zA-Z0-9][a-zA-Z0-9._-]{7,35}$/.test(SITE_CONFIG.appwriteProjectId) &&
  /^[a-zA-Z0-9._-]{8,}$/i.test(SITE_CONFIG.appwriteOwnerUserId) &&
  SITE_CONFIG.appwriteProjectId !== 'YOUR_APPWRITE_PROJECT_ID' &&
  SITE_CONFIG.appwriteOwnerUserId !== 'YOUR_APPWRITE_OWNER_USER_ID';
