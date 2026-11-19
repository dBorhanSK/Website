# Borhan_SK Portfolio — Appwrite edition

A bilingual Persian/English developer portfolio and project-request website powered by Appwrite Cloud.

## Features

- Public bilingual portfolio with RTL/LTR support
- Profile, skills, services, and projects
- Public project requests without visitor registration
- Private client attachments
- Private support messages
- Feedback and suggestions moderated by the owner
- Owner login via Appwrite Account email/password
- Owner dashboard for orders, content, messages, and deliverables
- Appwrite TablesDB, Authentication, and Storage

## Architecture

- GitHub: source control
- statichost.eu: static hosting
- Appwrite Cloud: TablesDB, Authentication, Storage
- One Appwrite Function: owner-authorized, expiring file-token links

## Setup

1. Create an Appwrite Cloud project and add a Web platform for `localhost` and your deployed hostname.
2. Create the owner user in Appwrite Authentication and copy its user ID.
3. Create a temporary API key with `databases.read/write`, `tables.read/write`, `columns.read/write`, and `buckets.read/write` scopes.
4. Copy `.env.example` to `.env`, fill the Appwrite endpoint, project ID, temporary API key, and owner user ID, then run:

   ```bash
   node tools/setup-appwrite.mjs
   ```

5. Delete the temporary API key after the schema has been created. Never commit `.env` or expose a server API key in browser code.
6. Update `public/assets/js/config.js` with the project endpoint, project ID, owner user ID, function ID, and social links.
7. Deploy the function in `functions/create-delivery-link/`:
   - Function ID: `delivery_link`
   - Runtime: Node.js 22+
   - Entrypoint: `src/main.js`
   - Build command: `npm install`
   - Scope: `tokens.write`
   - Execute permission: only `user:<OWNER_USER_ID>`
   - Variables: `BORHAN_OWNER_USER_ID`, `BORHAN_BUCKET_ID=client_files`
8. Deploy the `public/` directory from GitHub through statichost.eu with no build command and output directory `public`.
9. Add the final hosting hostname as a Web platform in Appwrite.

The schema script creates a new Appwrite database and bucket. It does not migrate existing rows or files from Supabase. Export/import any existing data separately if you need to keep it.

## Security notes

- Public visitors can create requests/messages/feedback, but cannot list private inbox tables.
- Only approved feedback and public portfolio content can be read by unauthenticated visitors.
- The Storage bucket allows public uploads but only the owner can read files directly. Customer files are not made public.
- The delivery-link Function checks the invoking Appwrite user ID against the configured owner ID, and the Function's Execute permission must also be restricted to that owner.
- Delivery links are Appwrite File Token URLs. Treat them as secrets and share only with the intended customer.
- Do not put an Appwrite API key in `config.js`, HTML, JavaScript, or GitHub.

## Free plan caveat

Appwrite's Free plan currently lists 5 GB bandwidth, 2 GB storage, 750K executions, 75K monthly active users, one database, one bucket, and two functions. Free projects with no development activity for seven consecutive days are automatically paused. If quotas are reached, Free projects can freeze until the next usage reset or a plan/resource change. See the official [pricing](https://appwrite.io/pricing) and [inactivity notice](https://appwrite.io/changelog/entry/2026-02-20-1).

## Main files

```text
public/index.html
public/owner.html
public/privacy.html
public/assets/js/config.js
public/assets/js/appwrite-compat.js
public/assets/js/site.js
public/assets/js/owner.js
tools/setup-appwrite.mjs
functions/create-delivery-link/src/main.js
statichost.yml
```
