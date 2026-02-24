---
name: GB Guide
description: Development conventions and workflow for the GB Guide web platform
---

# GB Guide — Skill Reference

## What This Project Is
**GB Guide** is a production-ready web platform connecting foreign tourists with trusted local experts from Gilgit-Baltistan (Pakistan) via paid video consultations. Travelers browse experts, book a session, pay in USD, receive a meeting link, and get a custom itinerary.

## Required Tone
- **Adventurous**: Evoke the thrill of high mountains, remote valleys, and once-in-a-lifetime experiences.
- **Trustworthy**: Communicate safety, verified experts, secure payments, and reliable logistics.
- **Premium**: Every UI element should feel polished, modern, and high-end — no generic or cookie-cutter designs.

## Conventions

### Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (premium design tokens) |
| Database | PostgreSQL (via Docker) |
| ORM | Prisma |
| Auth | NextAuth (email/password + Google OAuth) |
| Payments | Stripe (primary), PayPal/Wise (future) |
| Email | Resend/SendGrid (stubbed) |
| Meetings | Google Meet / Zoom link generation (stubbed) |

### Code Style
- TypeScript strict mode (`"strict": true`)
- Prettier + ESLint enforced
- All components use `@/` import alias
- App Router file-based routing
- Server Components by default; `"use client"` only when needed

### Design System
- Dark theme: Navy background (`#080a18`), slate text, gold accent, emerald success
- Fonts: Inter (body) + Outfit (headings) from Google Fonts
- Glass morphism for cards and overlays
- Custom button variants: `btn-primary`, `btn-accent`, `btn-outline`
- Micro-animations: `animate-fade-in-up`, `animate-float`

### Docker-First Development
- Always develop inside Docker: `docker compose up --build`
- Two services: `web` (Next.js) + `db` (PostgreSQL)
- Hot reload via volume mounts
- Environment variables in `.env` (never committed)

### File Organization
```
/apps/web/          → Next.js app
/apps/web/app/      → App Router pages and layouts
/apps/web/app/components/ → Shared UI components
/apps/web/app/api/  → API routes
/packages/ui/       → Shared UI library (future)
/infra/             → Docker configs, scripts, docs
```

## Definition of Done (per feature)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Feature works correctly in Docker (`docker compose up --build`)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All new pages have proper SEO metadata
- [ ] No hardcoded secrets or credentials
- [ ] TODO comments left for future integrations
