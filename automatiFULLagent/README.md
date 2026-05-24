# Agentflow_AI

Agentic AI Automation Platform that turns natural-language automation requests into executable visual workflows.

## Apps

- `client/` - Next.js Pages Router frontend
- `server/` - Express API backend

## Phase 1

Phase 1 includes project initialization, authentication, JWT sessions, MongoDB connection with an in-memory fallback, protected frontend routes, Zustand auth persistence, and the base application shell.

## Getting Started

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env.local
npm run dev
```

If port `5001` is already in use, run:

```bash
npm run dev:5002
```
