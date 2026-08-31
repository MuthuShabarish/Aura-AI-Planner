# ⚡ AURA — AI-Powered Personal Planner & Productivity Workspace

AURA is a modern, high-performance personal productivity suite featuring smart AI context integration, daily schedule planning, habit streak tracking, goal management, focus timers, and deep analytics.

![AURA Planner AI](public/aura-logo.png)

---

## ✨ Features

- 🤖 **AURA AI Assistant**: Contextual AI assistant integrated with your live tasks, habits, and schedule.
- 🎯 **Task Management**: Categorized tasks with priority badges, due dates, filters, and status toggles.
- ⚡ **Habit Tracker**: Weekly targets, streak tracking, and interactive 7-day completion grids.
- 🗓️ **Interactive Schedule & Timeline**: Time-blocking calendar view with focus blocks and daily agendas.
- 📊 **Insights & Analytics**: Real-time productivity scoring, habit consistency graphs, and focus metrics.
- ⚙️ **Customizable Theme & Density**:
  - Light & Dark mode support.
  - 5 accent palette swatches (*Indigo, Emerald, Amber, Sky, Rose*).
  - **Layout Density**: Toggle between *Comfortable* and *Compact* display densities.
- 🔒 **100% Local & Private**: All data is stored securely in browser `localStorage` with full JSON backup & export tools.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons.
- **Backend API**: Node.js, Express.js.
- **State Management**: React Context (`AppContext.jsx`) with `localStorage` persistence.
- **Runner**: Concurrently for running client & server simultaneously.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MuthuShabarish/Aura-AI-Planner.git
   cd Aura-AI-Planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Optionally add your GEMINI API key in `.env` for AI features)*

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   This will start both the Express backend API (`http://localhost:3001`) and Vite frontend (`http://localhost:5173`).

---

## 📂 Project Structure

```text
Aura-AI-Planner/
├── server.js              # Express backend server (port 3001)
├── vite.config.js         # Vite configuration & proxy settings
├── index.html             # Main HTML entry point
├── src/
│   ├── components/        # UI components & AI widgets
│   ├── context/           # AppContext state & local storage logic
│   ├── pages/             # Main view pages (Habits, Tasks, AI, Insights, Settings)
│   ├── services/          # AI Service integration
│   └── index.css          # Core CSS variables, dark mode & layout density
└── README.md              # Project documentation
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
