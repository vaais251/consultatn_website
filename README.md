# GB Guide 🏔️

> **Plan Gilgit-Baltistan with Local Experts**
> A premium web platform connecting foreign tourists with verified local GB experts via paid video consultations.

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run Locally

```bash
# Clone the repo and enter directory
cd "03_consulant website"

# Start all services (Next.js + PostgreSQL)
docker compose up --build

# The app will be available at:
# → http://localhost:3000
```

### Stop

```bash
docker compose down

# To also remove the database volume:
docker compose down -v
```

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Home page |
| `http://localhost:3000/about` | About & Experts |
| `http://localhost:3000/services` | Services & Pricing |
| `http://localhost:3000/destinations` | Destinations |
| `http://localhost:3000/visa` | Visa & Logistics |
| `http://localhost:3000/preparation` | Preparation & Culture |
| `http://localhost:3000/blog` | Travel Blog |
| `http://localhost:3000/contact` | Contact & FAQ |
| `http://localhost:3000/login` | Login / Register |
| `http://localhost:3000/dashboard` | Client Dashboard |
| `http://localhost:3000/api/health` | Health Check API |

## Project Structure

```
├── apps/
│   └── web/                    # Next.js app (App Router + TypeScript)
│       ├── app/
│       │   ├── components/     # Navbar, Footer
│       │   ├── about/          # About & Experts page
│       │   ├── api/health/     # Health check endpoint
│       │   ├── blog/           # Travel Blog page
│       │   ├── contact/        # Contact & FAQ page
│       │   ├── dashboard/      # Client Dashboard page
│       │   ├── destinations/   # Destinations page
│       │   ├── login/          # Login / Register page
│       │   ├── preparation/    # Preparation & Culture page
│       │   ├── services/       # Services & Pricing page
│       │   ├── visa/           # Visa & Logistics page
│       │   ├── globals.css     # Tailwind design system
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Home page (hero)
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── ui/                     # Shared UI components (future)
├── infra/                      # Infrastructure docs & scripts
├── .agent/skills/gb-guide/     # Antigravity skill file
├── docker-compose.yml
├── .env.example
└── .env                        # Local dev config (not committed)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend + Backend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| ORM | Prisma (coming soon) |
| Auth | NextAuth (coming soon) |
| Payments | Stripe (coming soon) |
| Email | Resend/SendGrid (stubbed) |
| Meetings | Google Meet / Zoom (stubbed) |

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random secret for NextAuth
- `STRIPE_SECRET_KEY` — Stripe API key (when ready)

## NPM Scripts (inside `apps/web`)

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Troubleshooting

### Docker build fails
- Ensure Docker Desktop is running
- Try `docker compose down -v && docker compose up --build`

### Port 3000 already in use
- Stop other processes: `npx kill-port 3000`
- Or change the port in `docker-compose.yml`

### Hot reload not working
- The `WATCHPACK_POLLING=true` env var is set for Docker file-watching
- If still not working, restart: `docker compose restart web`

### Database connection errors
- Wait for the `db` service health check to pass
- Check `docker compose logs db` for PostgreSQL errors

## Database Migration Discipline

| Environment | Command | When |
|-------------|---------|------|
| **Development** | `npx prisma migrate dev --name description` | After schema changes |
| **Production** | `npx prisma migrate deploy` | On deploy |
| **Emergency** | `npx prisma db push` | Only if migrations are broken |

> ⚠️ Never use `prisma migrate dev` in production — it can reset data.
> Always review migration SQL files before deploying.

## Cron Jobs

### Reservation Expiry

Expired reservations must be cleaned up periodically. Call this endpoint every 2–5 minutes:

```
GET /api/cron/expire-reservations?token=YOUR_CRON_TOKEN
```

Set `CRON_TOKEN` in your environment variables.

**Platform examples:**

| Platform | Setup |
|----------|-------|
| **Vercel** | Add to `vercel.json` crons config |
| **Coolify** | Docker cron or external curl-based cron |
| **Self-hosted** | `crontab -e` → `*/5 * * * * curl -s https://yourdomain.com/api/cron/expire-reservations?token=...` |

## Database Backups

```bash
# Manual backup
./infra/scripts/backup-db.sh

# Schedule daily at 2 AM:
0 2 * * * /path/to/project/infra/scripts/backup-db.sh >> /var/log/gb-backup.log 2>&1
```

See [`infra/DEPLOYMENT_CHECKLIST.md`](infra/DEPLOYMENT_CHECKLIST.md) for the full deployment guide.
