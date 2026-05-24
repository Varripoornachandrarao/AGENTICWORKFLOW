# Agentflow_AI

Agentflow_AI is a full-stack Agentic AI Operations Automation Platform. It lets users describe an automation in natural language, generate a visual workflow graph, edit it on a React Flow canvas, execute it through a chain of AI agents, and monitor the execution timeline in real time.

The project is inspired by tools like Zapier and n8n, but adds an explicit multi-agent orchestration layer for planning, execution, validation, recovery, and monitoring.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected frontend routes with persistent Zustand auth state
- Workflow creation, editing, saving, duplication-ready structure
- React Flow visual workflow builder
- Node palette and node configuration panel
- AI workflow generation from natural-language prompts
- OpenRouter support
- Gemini fallback support
- Deterministic fallback workflow generator
- Multi-agent execution engine
- Execution logs and timeline events
- Pause, resume, and cancel execution endpoints
- Socket.IO real-time event streaming
- Notifications drawer with persisted notifications
- OAuth integration foundation for Gmail, Slack, Discord, and Google Sheets
- Encrypted credential storage for integration tokens
- BullMQ/Redis queue support with in-memory fallback
- MongoDB persistence with in-memory fallback support

## Tech Stack

### Frontend

- Next.js Pages Router
- React 19
- Tailwind CSS
- Zustand
- Axios
- React Flow
- Socket.IO Client
- lucide-react

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- BullMQ
- Redis / ioredis
- Socket.IO
- helmet
- morgan
- compression
- express-validator
- express-rate-limit

### AI Providers

- OpenRouter
- Google Gemini
- Deterministic rule-based fallback generator

## Project Structure

```txt
agentflow_ai/
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       ├── styles/
│       └── utils/
│
├── server/
│   └── src/
│       ├── agents/
│       ├── config/
│       ├── controllers/
│       ├── integrations/
│       ├── middleware/
│       ├── models/
│       ├── queues/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── spec.md
├── package.json
└── README.md
