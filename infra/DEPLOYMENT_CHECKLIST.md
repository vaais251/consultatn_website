# GB Guide — Deployment Checklist

Use this checklist for every deployment to staging or production.

---

## 1. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Full public URL (e.g., `https://gbguide.pk`) |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | ✅ | Random 32+ char secret for JWT signing |
| `STRIPE_SECRET_KEY` | ✅ | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `CRON_TOKEN` | ✅ | Secret token for cron endpoints |
| `RESEND_API_KEY` | ⚠️ | Email sending (Resend) — optional for dev |
| `SENTRY_DSN` | ⚡ | Optional — enables error tracking |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ | Public URL for sitemap/OG — defaults to NEXTAUTH_URL |

> **Generate secrets**: `openssl rand -base64 32`

---

## 2. Database Setup

```bash
# Apply schema to production database
npx prisma migrate deploy

# Or if using db push (dev-only):
npx prisma db push
```

- [ ] Database provisioned (PostgreSQL 15+)
- [ ] `DATABASE_URL` set and reachable
- [ ] Migrations applied
- [ ] Seed data applied (if applicable)

---

## 3. Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy signing secret → set as `STRIPE_WEBHOOK_SECRET`

- [ ] Webhook endpoint created
- [ ] Signing secret configured
- [ ] Test event sent successfully

---

## 4. Cron Jobs

### Reservation Expiry
Call every **2-5 minutes** to expire abandoned reservations:

```
GET https://yourdomain.com/api/cron/expire-reservations?token=YOUR_CRON_TOKEN
```

**Platform Setup:**

| Platform | How |
|----------|-----|
| **Vercel** | `vercel.json` → `"crons": [{ "path": "/api/cron/expire-reservations?token=...", "schedule": "*/5 * * * *" }]` |
| **Render** | Cron Job service → HTTP GET every 5 min |
| **Fly.io** | Use `fly-cron` or external service |
| **Coolify** | Docker cron or external curl-based cron |
| **Self-hosted** | `crontab -e` → `*/5 * * * * curl -s https://yourdomain.com/api/cron/expire-reservations?token=...` |

- [ ] `CRON_TOKEN` set in environment
- [ ] Cron job configured and running

---

## 5. Domain & HTTPS

- [ ] Custom domain configured
- [ ] HTTPS enforced (platform-level or Cloudflare)
- [ ] `NEXTAUTH_URL` matches production domain exactly
- [ ] `NEXT_PUBLIC_BASE_URL` matches production domain

---

## 6. Security Checklist

- [ ] All secrets are unique and not shared across environments
- [ ] Security headers verified (check with `curl -I https://yourdomain.com`)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` present
- [ ] Admin routes require ADMIN role
- [ ] API routes use rate limiting
- [ ] Stripe webhook signature verified

---

## 7. Monitoring

### Logs
- Application logs structured as JSON (search by `event` field)
- Key events logged: `booking.created`, `reservation.expired`, `payment.confirmed`, `refund.issued`

### Sentry (Optional)
- Set `SENTRY_DSN` → Sentry auto-initializes

### Health Check
```
GET /api/health
```
Returns `{ status: "ok", timestamp: "..." }`

---

## 8. Database Backups

```bash
# Manual backup
./infra/scripts/backup-db.sh

# Schedule (cron, daily at 2 AM):
0 2 * * * /path/to/infra/scripts/backup-db.sh >> /var/log/gb-backup.log 2>&1
```

- [ ] Backup script tested
- [ ] Backup schedule configured
- [ ] Backups stored off-server (S3/GCS recommended)

---

## 9. Smoke Tests After Deploy

Run these after every deployment:

- [ ] **Home page** loads at `/` with featured content
- [ ] **Register** → create test account
- [ ] **Login** → sign in with test credentials
- [ ] **Experts page** → experts listed
- [ ] **Booking flow** → select slot → submit form → booking created
- [ ] **Payment** → Pay Now redirects to Stripe
- [ ] **Admin** → login as admin → Content Hub accessible
- [ ] **Destinations** → `/destinations` shows published destinations
- [ ] **Blog** → `/blog` shows published posts
- [ ] **Sitemap** → `/sitemap.xml` accessible
- [ ] **Robots** → `/robots.txt` accessible
- [ ] **Cron** → `/api/cron/expire-reservations?token=...` returns `{"expired":0}`

---

## 10. Migration Discipline

| Environment | Command | When |
|-------------|---------|------|
| **Development** | `prisma migrate dev --name description` | After schema changes |
| **Production** | `prisma migrate deploy` | On deploy |
| **Emergency** | `prisma db push` | Only if migrations are broken |

> ⚠️ Never use `prisma migrate dev` in production — it can reset data.
> Always review migration SQL files before deploying.
