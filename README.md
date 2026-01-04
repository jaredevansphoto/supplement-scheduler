# Supplement Scheduler

A Next.js (App Router) web application for tracking daily supplement intake.

This project is intended for **private, family use** and prioritizes
**stability, simplicity, and predictable behavior** over advanced features
or security concerns.

---

## Purpose

The core goal of this app is to:

- Display a daily list of supplements
- Allow each supplement to be marked as:
  - Taken
  - Skipped
  - Missed
- Persist daily status locally in the browser (IndexedDB)
- Work reliably as a deployed web app across devices

Authentication, backend services, and security hardening are intentionally
out of scope at this stage.

---

## Current Status

The app is functionally close to complete but has shown **structural fragility**
during refactors and deployment attempts.

This repository is being reviewed to identify:
- Architectural risks
- Client vs server boundary issues
- IndexedDB usage pitfalls in Next.js
- Causes of blank screens or unstable builds
- Opportunities to simplify for long-term stability

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- React (Client Components where required)
- IndexedDB (via a lightweight abstraction)
- Tailwind CSS

---

## Design Goals

- Simple mental model
- Minimal moving parts
- Boring, predictable patterns
- Stable builds and deployments

The priority is:
> “This app should not randomly break when deployed.”

---

## Notes for Reviewers

- This is not a production SaaS app
- No authentication is required
- No backend is required
- Stability and clarity are valued over cleverness
