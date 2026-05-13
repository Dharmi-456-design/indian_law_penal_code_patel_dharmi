<div align="center">

<img src="https://img.shields.io/badge/LexIndia-India's%20Law%2C%20Decoded-1a1a2e?style=for-the-badge&logo=scales&logoColor=gold" alt="LexIndia Banner" width="100%"/>

# ⚖️ LexIndia

### *India's Law, Decoded.*

**India's Premier Legal Reference Platform** — Browse, Search, Bookmark & Annotate 2,000+ sections across 8 major Indian Acts.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-lexindia.app-4f46e5?style=for-the-badge)](https://lexindia.vercel.app)
[![Frontend](https://img.shields.io/badge/▲%20Vercel-Frontend%20Deploy-000000?style=for-the-badge&logo=vercel)](https://lexindia.vercel.app)
[![Backend](https://img.shields.io/badge/🚀%20Render-Backend%20API-46e3b7?style=for-the-badge&logo=render)](https://lexindia-api.onrender.com)
[![YouTube](https://img.shields.io/badge/▶%20YouTube-Demo%20Video-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/watch?v=YOUR_VIDEO_ID)
[![GitHub Repo](https://img.shields.io/badge/⭐%20GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/lexindia)

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 🌐 **Live App (Production)** | [https://lexindia.vercel.app]() |
| ▲ **Frontend Deploy (Vercel)** | [https://lexindia.vercel.app]() |
| 🚀 **Backend API (Render)** | [https://lexindia-api.onrender.com]() |
| 📦 **Frontend Repository** | [github.com/YOUR_USERNAME/lexindia-frontend]() |
| 🗄️ **Backend Repository** | [github.com/YOUR_USERNAME/lexindia-backend]() |
| ▶️ **YouTube Demo** | [Watch Full Demo]() |
| 📄 **API Health Check** | [/api/v1/health]() |

> **⚠️ Note:** Replace all placeholder URLs with your actual deployed links before publishing.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Dataset Coverage](#-dataset-coverage)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Database Design](#-database-design)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the Project

**LexIndia** is a full-stack legal reference platform built for students, lawyers, researchers, and citizens who need fast, reliable access to Indian law. It aggregates **2,043+ sections** across **8 major Indian Acts** into a single searchable, bookmarkable, and annotatable interface.

Built over 30 days (13 May – 13 June 2026) as a production-grade MERN application with:

- Role-based access control (Admin & User)
- Full-text cross-act search powered by MongoDB `$text` indexes
- Personal bookmarks and notes per section
- Admin analytics dashboard with Recharts visualizations
- CI/CD via GitHub Actions → Vercel (frontend) + Render (backend)

---

## 🎬 Demo

<div align="center">

[![LexIndia Demo Video](https://img.shields.io/badge/▶%20Watch%20Full%20Demo%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/watch?v=YOUR_VIDEO_ID)

> Click the badge above to watch the complete walkthrough of LexIndia — featuring user login, section browsing, full-text search, bookmarks, notes, and the admin analytics dashboard.

</div>

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server & routing |
| **MongoDB Atlas** | Cloud NoSQL database (M0 free → M2 production) |
| **Mongoose** | ODM — schema modeling & query building |
| **JWT + bcryptjs** | Authentication & password hashing (saltRounds: 12) |
| **express-validator** | Request input validation & sanitization |
| **Helmet.js** | Security HTTP headers |
| **express-rate-limit** | Rate limiting (100 req / 15 min) |
| **Morgan** | HTTP request logging |
| **GitHub Actions** | CI/CD pipeline — lint → test → deploy |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 (Vite)** | Component-based UI framework |
| **Tailwind CSS + MUI** | Utility-first styling + Material Design components |
| **Redux Toolkit** | Global state management |
| **React Router v6** | Client-side routing with protected routes |
| **Axios** | HTTP client with interceptors |
| **Formik + Yup** | Form handling & schema validation |
| **Recharts** | Data visualization — bar, line, pie charts |

### Deployment & Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting with instant CDN |
| **Render** | Backend Node.js hosting |
| **MongoDB Atlas** | Managed cloud database |
| **GitHub Actions** | Automated CI/CD pipelines |

---

## ✨ Features

### 👤 User Features
- 🔐 **JWT Authentication** — Secure register/login with token-based sessions
- 📚 **Act Browser** — Browse all 8 Indian Acts via intuitive tile-based selector
- 🔍 **Full-Text Search** — Cross-act search with relevance scoring and debounce (300ms)
- 📖 **Section Detail View** — Full section content with chapter metadata
- 🔖 **Bookmarks** — Save and manage sections; filter bookmarks by act
- 📝 **Personal Notes** — Add, edit, delete private notes per section
- 👤 **Profile Management** — Edit name, email; change password securely
- 🌙 **Dark / Light Mode** — Theme toggle persisted via localStorage

### 🛡️ Admin Features
- 📊 **Analytics Dashboard** — Live stats: users, sections, notes, bookmarks
- 📈 **Recharts Visualizations** — Bar chart (sections per act), line chart (user growth), pie chart (act distribution)
- 👥 **User Management** — CRUD users, toggle roles (admin/user), activate/deactivate
- 📋 **Content Management** — Create, edit, soft-delete sections and act metadata
- 🔍 **Search Logs** — Browse search query history; identify trending queries
- 🗂️ **Audit Logs** — All admin mutations tracked with IP and timestamp

### ⚙️ Platform Features
- 🔐 **RBAC** — Role-based access control (`admin` | `user`)
- 📄 **Pagination** — All listing endpoints paginated (configurable limit)
- 🛡️ **Security** — Helmet, rate limiting, CORS whitelist, parameterized queries
- 📡 **Standard API Responses** — Consistent `success/message/data/meta` envelope
- 🔄 **Idempotent Seeding** — Safe re-run seeder using `bulkWrite` upserts
- 📱 **Responsive Design** — Mobile, tablet, and desktop optimized

---

## 📚 Dataset Coverage

LexIndia covers **~2,043 sections** across **8 major Indian Acts**:

| # | Act | Act Number | Sections |
|---|---|---|---|
| 1 | 🔴 Indian Penal Code, 1860 | 45 of 1860 | 575 |
| 2 | 🟠 Code of Criminal Procedure, 1973 | 2 of 1974 | 525 |
| 3 | 🟡 Civil Procedure Code, 1908 | 5 of 1908 | — |
| 4 | 🟢 Hindu Marriage Act, 1955 | 25 of 1955 | 283 |
| 5 | 🔵 Indian Divorce Act, 1869 | 4 of 1869 | 64 |
| 6 | 🟣 Indian Evidence Act, 1872 | 1 of 1872 | 184 |
| 7 | 🟤 Negotiable Instruments Act, 1881 | 26 of 1881 | 156 |
| 8 | ⚫ Motor Vehicles Act, 1988 | 59 of 1988 | 256 |

---

## 🏗 Architecture

```
                    ┌──────────────────────┐
                    │       Vercel          │
                    │   (Frontend Hosting)  │
                    │   React 18 + Vite     │
                    │   lexindia.vercel.app │
                    └──────────┬───────────┘
                               │ HTTPS (REST)
                    ┌──────────▼───────────┐
                    │       Render          │
                    │   (Backend Hosting)   │
                    │   Node.js + Express   │
                    │   lexindia-api.onrender.com │
                    └──────────┬───────────┘
                               │ Mongoose Driver
                    ┌──────────▼───────────┐
                    │    MongoDB Atlas      │
                    │  (Cloud Database)     │
                    │  lexindia cluster     │
                    └──────────────────────┘

CI/CD: GitHub → Actions → lint → test → deploy
```

### Middleware Chain

```
Request → morgan(logger) → helmet → cors → express.json
       → verifyToken → roleGuard → validate → controller → response
```

### Authentication Flow

```
POST /register → bcrypt hash (saltRounds: 12) → create user → JWT (7d)
POST /login    → verify password              → JWT issued  → store in localStorage
Protected APIs → Authorization: Bearer <token> → verifyToken middleware
POST /logout   → client clears token + optional server-side blacklist
```

---

## 📡 API Documentation

**Base URL:** `https://lexindia-api.onrender.com/api/v1`

All responses follow this envelope:

```json
{
  "success": true,
  "message": "Sections fetched successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 575,
    "totalPages": 29
  }
}
```

### 🔐 Auth Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `GET` | `/auth/me` | Protected | Get current user profile |
| `POST` | `/auth/logout` | Protected | Logout and invalidate token |

### 📋 Sections (Laws) Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/sections` | Protected | All sections — paginated, filterable, sortable |
| `GET` | `/sections/:id` | Protected | Single section by ID (increments viewCount) |
| `GET` | `/sections/act/:actCode` | Protected | All sections of one act |
| `GET` | `/sections/search` | Protected | Full-text search within an act |
| `POST` | `/sections` | Admin | Create new section |
| `PUT` | `/sections/:id` | Admin | Full replace of section |
| `PATCH` | `/sections/:id` | Admin | Partial update |
| `DELETE` | `/sections/:id` | Admin | Soft delete (isArchived: true) |
| `PATCH` | `/sections/:id/archive` | Admin | Archive section |
| `PATCH` | `/sections/:id/restore` | Admin | Restore archived section |

**Query Parameters for Listings:**
```
?actCode=IPC         — filter by act
?chapter=2           — filter by chapter
?page=1&limit=20     — pagination
?sortBy=sectionNumber&sortOrder=asc
?q=cheque            — full-text search
?isArchived=false    — archive filter (admin)
```

### 🔍 Search Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/laws/search?q=&actCode=&page=&limit=` | Protected | Full-text search with relevance scoring |
| `GET` | `/search/global?q=` | Protected | Cross-act global search |
| `GET` | `/laws/trending` | Protected | Top 10 by viewCount |
| `GET` | `/laws/random` | Protected | Random law/section |
| `GET` | `/laws/recent` | Protected | Last 20 inserted sections |

### 🏛 Acts (Metadata) Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/acts` | Protected | List all 8 acts |
| `GET` | `/acts/:actCode` | Protected | Act metadata |
| `GET` | `/acts/:actCode/sections` | Protected | All sections in act (paginated) |
| `GET` | `/acts/:actCode/chapters` | Protected | All chapters with counts |
| `GET` | `/acts/:actCode/stats` | Protected | Section/chapter count aggregation |

### 🔖 Bookmarks Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/bookmarks` | Protected | Get user's bookmarks (paginated, filterable) |
| `POST` | `/bookmarks/:sectionId` | Protected | Add bookmark (upsert, no duplicates) |
| `DELETE` | `/bookmarks/:sectionId` | Protected | Remove bookmark |
| `GET` | `/bookmarks/:sectionId/check` | Protected | Check if section is bookmarked |
| `PATCH` | `/bookmarks/:sectionId/note` | Protected | Update bookmark note |

### 📝 Notes Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/notes` | Protected | Get current user's notes |
| `POST` | `/notes` | Protected | Add note to a section |
| `PUT` | `/notes/:id` | Protected | Edit own note |
| `DELETE` | `/notes/:id` | Protected | Delete own note |

### 👥 Users Endpoints (Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | List all users (paginated, searchable) |
| `GET` | `/users/:id` | Admin | Get single user |
| `PATCH` | `/users/:id/role` | Admin | Update user role |
| `PATCH` | `/users/:id/status` | Admin | Toggle active/inactive |
| `DELETE` | `/users/:id` | Admin | Soft delete user |
| `PATCH` | `/users/me` | Protected | Self-profile update + password change |

### 📊 Analytics Endpoints (Admin)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/overview` | Admin | Total users, sections, notes, bookmarks |
| `GET` | `/analytics/acts` | Admin | Section count by act (for charts) |
| `GET` | `/analytics/users` | Admin | User registration trend over time |
| `GET` | `/analytics/top-viewed` | Admin | Top viewed sections |
| `GET` | `/analytics/search-trends` | Admin | Daily search count for last N days |
| `GET` | `/analytics/top-queries` | Admin | Most common search terms |

### ⚙️ System

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Server health check |

---

## 🗄 Database Design

### Collections Overview

```
users       — Auth, roles, profile
sections    — Unified store for all 8 acts (~2,043 documents)
acts        — Act metadata (name, year, act number)
bookmarks   — User ↔ Section many-to-many
notes       — User personal notes per section
searchLogs  — Search query history + result counts
auditLogs   — Admin mutation tracking with IP
```

### Relationships

```
users    (1) ──── (many) notes
users    (1) ──── (many) bookmarks
sections (1) ──── (many) notes
sections (1) ──── (many) bookmarks
users  (many) ─── (many) sections   [via bookmarks]
```

### Sections Schema (Unified)

```json
{
  "actCode":       "enum: ['IPC','CrPC','CPC','HMA','IDA','IEA','NIA','MVA']",
  "actName":       "string — full act name",
  "actYear":       "number",
  "chapter":       "number | null",
  "chapterTitle":  "string | null",
  "sectionNumber": "string (required)",
  "sectionTitle":  "string (required)",
  "sectionDesc":   "string (required)",
  "isArchived":    "boolean, default: false",
  "viewCount":     "number, default: 0"
}
```

**Indexes:** `actCode`, `sectionNumber`, `{ actCode, sectionNumber }` (compound unique), `$text` on `sectionTitle + sectionDesc`

---

## 📁 Project Structure

### Backend (`lexindia-backend/`)

```
src/
├── config/
│   ├── db.js                   # MongoDB connection
│   └── env.js                  # Environment validation
├── models/
│   ├── User.js
│   ├── Section.js
│   ├── Note.js
│   ├── Bookmark.js
│   ├── SearchLog.js
│   └── AuditLog.js
├── controllers/
│   ├── auth.controller.js
│   ├── section.controller.js
│   ├── act.controller.js
│   ├── user.controller.js
│   ├── note.controller.js
│   ├── bookmark.controller.js
│   ├── search.controller.js
│   └── analytics.controller.js
├── services/
│   └── [mirrored per controller]
├── routes/v1/
│   ├── auth.routes.js
│   ├── section.routes.js
│   ├── act.routes.js
│   ├── user.routes.js
│   ├── note.routes.js
│   ├── bookmark.routes.js
│   ├── search.routes.js
│   └── analytics.routes.js
├── middlewares/
│   ├── auth.middleware.js      # JWT verify → req.user
│   ├── role.middleware.js      # RBAC guard
│   ├── error.middleware.js     # Global error handler
│   ├── validate.middleware.js  # express-validator
│   └── logger.middleware.js    # Morgan HTTP logger
├── utils/
│   ├── asyncHandler.js
│   ├── ApiResponse.js
│   ├── ApiError.js
│   ├── pagination.js
│   └── filterBuilder.js
└── scripts/
    └── seed.js                 # Master data seeder
```

### Frontend (`lexindia-frontend/`)

```
src/
├── assets/
├── components/
│   ├── ui/                     # Button, Input, Modal, Badge, Card, Table
│   ├── layout/                 # Sidebar, Navbar, PageWrapper, Footer
│   └── shared/                 # SectionCard, SearchBar, Pagination
├── features/
│   ├── auth/                   # authSlice + Login/Register pages
│   ├── sections/               # sectionsSlice + Section pages
│   ├── acts/                   # actsSlice + ActSelector
│   ├── bookmarks/              # bookmarksSlice + BookmarkList
│   ├── notes/                  # notesSlice + NoteForm
│   ├── users/                  # usersSlice + UserTable (admin)
│   ├── analytics/              # analyticsSlice + Charts
│   └── search/                 # searchSlice + SearchResults
├── hooks/
│   ├── useAuth.js
│   ├── useDebounce.js          # 300ms debounce for search
│   ├── usePagination.js
│   └── useLocalStorage.js
├── pages/
│   ├── public/                 # Login, Register, NotFound
│   └── dashboard/
│       ├── admin/              # AdminDashboard, UsersPage, AnalyticsPage...
│       └── user/               # UserDashboard, BrowsePage, SectionDetail...
├── services/
│   └── api.js                  # Axios instance + interceptors
├── store/
│   ├── index.js
│   └── slices/                 # All Redux slices
└── router.jsx                  # React Router v6 with protected routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repositories

```bash
# Backend
git clone https://github.com/YOUR_USERNAME/lexindia-backend.git
cd lexindia-backend

# Frontend (separate tab/terminal)
git clone https://github.com/YOUR_USERNAME/lexindia-frontend.git
cd lexindia-frontend
```

### 2. Backend Setup

```bash
cd lexindia-backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Seed the database with all 8 Acts (~2,043 sections)
node src/scripts/seed.js

# Create default admin user
node src/scripts/seed.js --create-admin

# Start development server
npm run dev
# API running at → http://localhost:5000
```

### 3. Frontend Setup

```bash
cd lexindia-frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start development server
npm run dev
# App running at → http://localhost:5173
```

---

## 🔧 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lexindia
JWT_SECRET=your-super-strong-random-secret-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=LexIndia
```

> **For Production:** Update `CLIENT_URL` to your Vercel domain and `VITE_API_BASE_URL` to your Render backend URL.

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd lexindia-frontend
vercel --prod

# Set environment variables in Vercel Dashboard:
# VITE_API_BASE_URL = https://lexindia-api.onrender.com/api/v1
# VITE_APP_NAME = LexIndia
```

### Backend → Render

1. Push your backend repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your `lexindia-backend` repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables in Render dashboard (same as your `.env`)
6. Deploy → Your API will be live at `https://lexindia-api.onrender.com`

### CI/CD — GitHub Actions

The project uses GitHub Actions for automated pipelines:

```
Push to main branch
  → Lint (ESLint)
  → Test (Jest)
  → Deploy Frontend to Vercel
  → Deploy Backend to Render
```

---

## 🖼 Screenshots

> _Add screenshots of your app here. Below are suggested placeholders._

| Page | Preview |
|---|---|
| 🏠 User Dashboard | _(screenshot)_ |
| 📚 Browse Acts | _(screenshot)_ |
| 🔍 Search Results | _(screenshot)_ |
| 📖 Section Detail | _(screenshot)_ |
| 🔖 Bookmarks | _(screenshot)_ |
| 📊 Admin Dashboard | _(screenshot)_ |
| 👥 Admin Users | _(screenshot)_ |

---

## 🔒 Security

- ✅ Helmet.js for secure HTTP headers
- ✅ Rate limiting: 100 requests / 15 minutes per IP
- ✅ bcrypt password hashing (saltRounds: 12)
- ✅ JWT expiry: 7 days (configurable)
- ✅ Input validation via express-validator
- ✅ CORS restricted to whitelisted client URL
- ✅ No raw queries — all access via Mongoose ODM
- ✅ Audit log on all admin mutations with IP tracking
- ✅ Soft deletes — no data is permanently destroyed

---

## 🗺 Roadmap

- [ ] Bare Acts PDF export
- [ ] Compare sections side-by-side
- [ ] AI-powered plain-language summaries
- [ ] Push notifications for legal amendments
- [ ] Multi-language support (Hindi, Gujarati, Tamil)
- [ ] Mobile app (React Native)
- [ ] Public API access with API key management
- [ ] BNS / BNSS (2023 new codes) integration

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feat/your-feature-name

# 3. Commit using conventional commits
git commit -m "feat(search): add section-level relevance scoring"

# 4. Push and open a Pull Request
git push origin feat/your-feature-name
```

Please follow the commit convention: `feat | fix | chore | docs | refactor | test`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Built with ❤️ for Indian legal access**

[![GitHub](https://img.shields.io/badge/GitHub-YOUR__USERNAME-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/YOUR_USERNAME)
[![YouTube](https://img.shields.io/badge/YouTube-Demo%20Video-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/watch?v=YOUR_VIDEO_ID)

> *"India's Law, Decoded."*

⭐ **Star this repo if you found it useful!**

</div>
