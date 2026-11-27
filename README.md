# Borhan_SK Portfolio — Appwrite edition

Bilingual Persian/English developer portfolio and project-order website, with private order conversations between customers and the owner.

## Features

- Public portfolio, skills, services, and projects with RTL/LTR support
- Project requests without a normal customer account (Appwrite guest sessions)
- Private per-order chat for text and file attachments
- Any file extension supported; up to 5 files per message, 50 MB per file
- Direct project-image upload from the owner dashboard (15 MB max)
- Owner order management, quote/status/private notes, deliverables automatically posted into the order chat, message deletion, and full order deletion
- Private Telegram profile link instead of the public GitHub profile link
- Feedback moderation and support-message inbox

## Architecture

- GitHub: source control
- GitHub Pages or statichost.eu: static hosting
- Appwrite Cloud: TablesDB, Authentication, and Storage
- Appwrite Functions: private order-chat API and expiring file-token links

`statichost.yml` publishes `public/`. The root `index.html`, `owner.html`, and `assets/` are mirrored from `public/` for GitHub Pages root publishing.

## Setup

1. Create an Appwrite Cloud project and a Web platform for `localhost` and your deployed hostname.
2. Create the owner user in Appwrite Authentication; copy its user ID.
3. Enable **Auth → Settings → Anonymous sessions** so customers can start private order chats without creating regular accounts.
4. Create a temporary setup API key with `databases.read/write`, `tables.read/write`, `columns.read/write`, `indexes.read/write`, and `buckets.read/write` scopes.
5. Copy `.env.example` to `.env`, fill the endpoint, project ID, temporary API key, and owner user ID, then run:

   ```bash
   node tools/setup-appwrite.mjs
   ```

6. Delete the temporary setup key. Never commit `.env` or expose API keys in browser code.
7. Update `public/assets/js/config.js`: endpoint, project ID, owner user ID, Function IDs, and your personal Telegram URL (`https://t.me/YOUR_TELEGRAM_USERNAME`). You can also update Telegram in the owner dashboard.
8. Deploy `functions/create-delivery-link/`:
   - Function ID `delivery_link`; Node.js 22+; entrypoint `src/main.js`; build command `npm install`
   - Scope `tokens.write`; Execute access only `user:<OWNER_USER_ID>`
   - Variables `BORHAN_OWNER_USER_ID`, `BORHAN_BUCKET_ID=client_files`
9. Zip the contents of `functions/order-chat/` and deploy it:
   - Function ID `order_chat`; Node.js 22+; entrypoint `src/main.js`; build command `npm install`
   - Scopes `rows.read`, `rows.write`, `files.read`, `files.write`, `tokens.write`
   - Execute access `Any`; the function checks the caller ID and order ownership in code
   - Variables `BORHAN_OWNER_USER_ID`, `BORHAN_DATABASE_ID=borhan_sk`, `BORHAN_BUCKET_ID=client_files`
10. Deploy `public/` on Statichost with output directory `public`, or use the root folder for GitHub Pages. Add the final hostname as an Appwrite Web platform.

The schema script creates/updates the Appwrite tables, the private `order_messages` table and its index, and the `client_files` bucket. It does not import old Supabase rows or files.

## Security and known limitation

- Public visitors may create orders, but cannot list private order or message tables.
- The chat Function is callable by anyone so guest customers can invoke it, but it checks the Appwrite caller ID and only allows the customer attached to that order or the configured owner. Do not remove these checks.
- Customer sessions are anonymous guest sessions. Appwrite cannot recover an anonymous account after session expiry, browser-data deletion, or switching devices. Customers should keep the same browser session; cross-device recovery would require adding a regular sign-in/account-linking flow.
- Chat attachments stay private. The Function creates 15-minute file-token links after checking the file is part of that order's conversation. The owner can delete one message with its files, clear the whole chat history and delivery file while retaining the order, or delete the entire order and its files.
- Project cover images are public-read so they can be rendered on the portfolio; only the owner can update or delete them.
- Never put an Appwrite API key in `config.js`, HTML, JavaScript, or GitHub.

## Main files

```text
public/index.html
public/owner.html
public/assets/js/config.js
public/assets/js/appwrite-compat.js
public/assets/js/site.js
public/assets/js/owner.js
tools/setup-appwrite.mjs
functions/create-delivery-link/src/main.js
functions/order-chat/src/main.js
```
