// Public browser configuration. The Supabase publishable key is safe to expose
// only when the SQL schema and RLS policies in supabase/schema.sql are applied.
// NEVER place a Supabase secret/service_role key in this file.
export const SITE_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  social: {
    telegram: "https://t.me/YOUR_CHANNEL",
    linkedin: "https://www.linkedin.com/in/YOUR_PROFILE/",
    github: "https://github.com/YOUR_USERNAME",
    email: "YOUR_EMAIL@example.com"
  },
  maxUploadBytes: 12 * 1024 * 1024
};

export const isSupabaseConfigured = () =>
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SITE_CONFIG.supabaseUrl) &&
  SITE_CONFIG.supabasePublishableKey.startsWith("sb_publishable_") ||
  (/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SITE_CONFIG.supabaseUrl) &&
   SITE_CONFIG.supabasePublishableKey.length > 40 &&
   SITE_CONFIG.supabasePublishableKey !== "YOUR_SUPABASE_PUBLISHABLE_KEY");
