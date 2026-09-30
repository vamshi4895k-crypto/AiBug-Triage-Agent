# AI Bug Triage Agent ⚡

A modern, production-quality, developer-focused **Single-Agent AI Bug Triage Agent** web application. 
Designed with an unconventional mission-control / developer IDE interface:

> **Error → AI Analysis → Likely Cause → Debugging Steps → Possible Fix**

---

## 🚀 Key Features

- **Debug Lab Workspace**: Single-screen immersive technical command center without routine SaaS card bloat or generic admin dashboards.
- **Multi-Modal Error Drop Zone**: Paste raw errors, stack traces, code snippets, logs, screenshots, or drag-and-drop log/code files.
- **Interactive AI Investigation Scanner**: High-tech animated scanning pipeline showing real-time triage stages (`Reading error message` → `Identifying error type` → `Inspecting stack trace` → `Finding probable cause` → `Preparing debugging steps`).
- **Interactive Debugging Timeline**: Step-by-step numbered diagnosis with expand/collapse guidance, CLI copy shortcuts, and real-time step completion checkboxes.
- **IDE Code Viewer**: Syntax-highlighted code container with line numbers, error gutters, suspicious line markers (`^^^^^^^^^^ POSSIBLE ISSUE`), and `AI INSIGHT` annotations.
- **Suggested Fix (Diff View)**: Clean `BEFORE` vs `AFTER` code comparison with one-click `[ Copy Fix ]`.
- **Confidence Meter**: Visual progress gauge and honest rationale explaining why confidence is high/medium/low.
- **"Why This Happened"**: Deep-dive architectural explanation written for clarity.
- **Demo Mode**: One-click presets for JavaScript (`TypeError`), Python (`KeyError`), and API Backend (`HTTP 500`).
- **Pluggable AI Backend**: Works out of the box with intelligent built-in heuristic parsing, and seamlessly integrates with Google Gemini (`gemini-2.0-flash`), OpenAI, or custom LLM endpoints via `.env`.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (Dark developer terminal theme)
- **Framer Motion** (Smooth fluid stage transitions)
- **Lucide React** (Crisp developer icons)

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Google Generative AI SDK** (`@google/generative-ai`)
- **Smart Local Heuristic Fallback Engine** (ensures 100% offline uptime)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your API key if you want live multi-turn LLM agent triage:
```env
AI_API_KEY=your_gemini_or_openai_key
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
```
*(If no API key is provided, the agent runs via its built-in intelligent diagnostic engine).*

### 3. Run Development Server
```bash
npm run dev
```
- Client runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:3001`

---

## ⌨️ Keyboard Shortcuts
- `Ctrl + Enter` (or `Cmd + Enter`): Trigger error analysis
- `Esc`: Clear active session / Reset

---

## 📄 License
MIT
