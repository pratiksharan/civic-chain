# CivicChain

> AI-powered civic grievance platform for citizens — file complaints, track SLAs, draft RTI applications, and escalate to legal authorities.

**Live demo:** [civicchain.vercel.app](https://civicchain.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Build Tool | Vite 5 |
| AI | Google Gemini 2.5 Flash |
| Deployment | Vercel (with Serverless Functions) |
| API Security | Vercel Environment Variables (key never reaches browser) |

---

## Architecture

```
Browser (React + TS + Tailwind)
        │
        │  POST /api/gemini  (no API key in browser)
        ▼
Vercel Serverless Function  ◄── GEMINI_API_KEY (env var, server-only)
        │
        │  HTTPS
        ▼
Google Gemini 1.5 Flash API
```

The Gemini API key lives **only** in Vercel's environment variables. It is never bundled into the frontend JavaScript and never sent to the browser.

---

## Features

- **AI Issue Analysis** — Paste a plain-language complaint; Gemini identifies the department, severity, location, and urgency
- **Smart Department Routing** — Routes to the correct BBMP / BWSSB / BESCOM / KSPCB authority
- **Portal Companion Mode** — Step-by-step checklist guides you through each government portal
- **Formal Complaint Generator** — AI drafts a legally-structured complaint letter
- **RTI Assistant** — Generates a complete RTI Act 2005 application with step-by-step filing guide
- **Enforcement Workflow** — SLA tracking, escalation chain (Ward Officer → Lokayukta), First Appeal drafting
- **Social Accountability** — Generates social media posts for public pressure after SLA breach
- **Lokayukta Form I** — Auto-drafts complaint for Karnataka Lokayukta after 3 failed cycles

---

## Project Structure

```
civicchain/
├── api/
│   └── gemini.ts              ← Vercel serverless function (API key lives here)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx
│   │   ├── screens/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SubmitIssue.tsx
│   │   │   ├── RoutingResult.tsx
│   │   │   ├── Enforcement.tsx
│   │   │   ├── RTIAssistant.tsx
│   │   │   └── Settings.tsx
│   │   ├── ui/
│   │   │   ├── index.tsx       ← Card, Badge, Spinner, SL
│   │   │   ├── Button.tsx      ← PrimaryBtn, GhostBtn, DangerBtn
│   │   │   └── CopyField.tsx   ← CopyField, CopyableText
│   │   └── Sidebar.tsx
│   ├── lib/
│   │   ├── api.ts              ← All AI API calls (calls /api/gemini)
│   │   ├── constants.ts        ← Department data, escalation chain
│   │   └── theme.ts            ← Color tokens
│   ├── types/
│   │   └── index.ts            ← TypeScript interfaces
│   ├── App.tsx                 ← Root component + global state
│   ├── main.tsx
│   └── index.css               ← Tailwind directives + global styles
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A free Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR-USERNAME/civicchain.git
cd civicchain

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_key_here

# 4. Install Vercel CLI (needed to run serverless functions locally)
npm install -g vercel

# 5. Run with Vercel dev (runs both frontend + serverless function)
vercel dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Use `vercel dev` instead of `npm run dev` so the `/api/gemini` serverless function runs alongside the frontend. `npm run dev` alone won't proxy the API calls.

---

### Step 4 — Auto-deploy

Every `git push` to `main` automatically triggers a new Vercel deployment. No manual steps needed.

---

## Getting a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key**
4. Copy the key (starts with `AIza...`)

The free tier gives **1,500 requests/day** — more than enough for a civic tool.

---

## Coverage (Currently only available for Bangalore)

Currently covers Bengaluru / Karnataka:

- **BBMP Sahaaya** — Garbage, Potholes, Street Lights, Encroachment, Public Health
- **BWSSB** — Water Supply, Sewerage & Drainage
- **BESCOM** — Power Outages, Electrical Issues
- **KSPCB** — Noise & Environmental Pollution
- **CPGRAMS** — General Central Government Grievances
- **RTI Online** — Right to Information applications
- **Karnataka Sakala** — Service delivery SLA enforcement
- **Karnataka Lokayukta** — Anti-corruption & maladministration
