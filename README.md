# Borhan_SK Portfolio

A bilingual Persian/English developer portfolio and project-request website, rebuilt as a static application backed by Supabase.

## Stack

- GitHub: source control
- statichost.eu: static hosting
- Supabase: Postgres, owner authentication, and private file storage

No Python, Flask, Telegram Desktop, Docker, or always-on server is required in this version.

## Features

- Full Persian RTL and English LTR language switch
- Profile, services, skills, projects, and social links
- Public project-request form with optional private attachment
- Public contact/support inbox
- Public feedback form with owner moderation
- Private owner dashboard at `/owner.html`
- Owner order workflow, private attachments, file delivery uploads, and bilingual profile, skills, services, and project editing
- Privacy page

## Quick setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create the owner user in Supabase Authentication, disable public sign-ups, then insert the user's UUID into `public.site_admins` as shown in `README_FA.md`.
4. Set `supabaseUrl`, `supabasePublishableKey`, and social links in `public/assets/js/config.js`.
5. Push the repository to GitHub.
6. Create a site at `https://builder.statichost.eu`, connect the repository, and deploy. `statichost.yml` publishes only `public/`; no build command is needed.

Read `README_FA.md` for the complete Persian setup and operational notes.

**Security:** expose only the Supabase publishable/legacy anon key in the browser. Never expose a Supabase secret or service-role key. RLS is configured in `supabase/schema.sql` and must be applied before going live.

**Limitations:** customer delivery links are signed for seven days and must be shared manually. Email replies use the owner's local mail app; this package does not send email automatically. Supabase Free projects can pause after inactivity and do not include automatic database backups. statichost.eu's Hobby plan is currently published with one site, 10 GB monthly bandwidth, and 100 build minutes; the host's terms state that the service is beta/best-effort without SLA. Check current quotas and whether signup works from your location before relying on it.
