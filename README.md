<div align="center">

<img src="https://img.shields.io/badge/LexIndia-India's%20Law%2C%20Decoded-1a1a2e?style=for-the-badge&logo=scales&logoColor=gold" alt="LexIndia Banner" width="100%"/>

# ⚖️ LexIndia

### *India's Law, Decoded.*

**India's Premier Legal Reference Platform** — Browse, Search, Bookmark & Annotate 2,000+ sections across 8 major Indian Acts.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Coming%20Soon-4f46e5?style=for-the-badge)]()
[![Frontend](https://img.shields.io/badge/▲%20Vercel-Frontend%20Deploy-000000?style=for-the-badge&logo=vercel)]()
[![Backend](https://img.shields.io/badge/🚀%20Render-Backend%20API-46e3b7?style=for-the-badge&logo=render)]()
[![YouTube](https://img.shields.io/badge/▶%20YouTube-Demo%20Video-FF0000?style=for-the-badge&logo=youtube)]()
[![GitHub Repo](https://img.shields.io/badge/⭐%20GitHub-Source%20Code-181717?style=for-the-badge&logo=github)]()

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
| 🌐 **Live App (Production)** | Coming Soon |
| ▲ **Frontend Deploy (Vercel)** | Coming Soon |
| 🚀 **Backend API (Render)** | https://lexindia-backend-dharmi.onrender.com/ |
| 📦 **Frontend Repository** | Coming Soon |
| 🗄️ **Backend Repository** | https://github.com/Dharmi-456-design/indian_law_penal_code_patel_dharmi/tree/main/backend |
| ▶️ **YouTube Demo** | Coming Soon |
| 📄 **API Health Check** | https://documenter.getpostman.com/view/50839318/2sBXwnuCGK |

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

[![LexIndia Demo Video](https://img.shields.io/badge/▶%20Watch%20Full%20Demo%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)]()

> Demo video coming soon.

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
                    └──────────┬───────────┘
                               │ HTTPS (REST)
                    ┌──────────▼───────────┐
                    │       Render          │
                    │   (Backend Hosting)   │
                    │   Node.js + Express   │
                    └──────────┬───────────┘
                               │ Mongoose Driver
                    ┌──────────▼───────────┐
                    │    MongoDB Atlas      │
                    │  (Cloud Database)     │
                    └──────────────────────┘

CI/CD: GitHub → Actions → lint → test → deploy
```

### Middleware Chain

```
Request → morgan → helmet → cors → express.json
       → verifyToken → roleGuard → validate → controller → response
```

### Authentication Flow

```
POST /register → bcrypt hash (saltRounds: 12) → create user → JWT (7d)
POST /login    → verify password              → JWT issued  → store in localStorage
Protected APIs → Authorization: Bearer <token> → verifyToken middleware
POST /logout   → client clears token
```

---

## 📡 API Documentation

**Base URL:** `/api/v1`

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

**Query Parameters:**
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
  "actName":       "string",
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

### Backend

```
lexindia-backend/
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   │   └── v1/
│   ├── middlewares/
│   ├── validators/
│   ├── utils/
│   └── scripts/
│       └── seed.js
├── server.js
├── .env
├── .env.example
└── package.json
```

### Frontend

```
lexindia-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── sections/
│   │   ├── acts/
│   │   ├── bookmarks/
│   │   ├── notes/
│   │   ├── users/
│   │   ├── analytics/
│   │   └── search/
│   ├── hooks/
│   ├── pages/
│   │   ├── public/
│   │   └── dashboard/
│   │       ├── admin/
│   │       └── user/
│   ├── services/
│   ├── store/
│   │   └── slices/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── tailwind.config.js
└── vite.config.js
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

# Frontend
git clone https://github.com/YOUR_USERNAME/lexindia-frontend.git
cd lexindia-frontend
```

### 2. Backend Setup

```bash
cd lexindia-backend
npm install
cp .env.example .env
# fill in your .env values

node src/scripts/seed.js           # seed all 8 acts
npm run dev                        # runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd lexindia-frontend
npm install
cp .env.example .env
# fill in your .env values

npm run dev                        # runs on http://localhost:5173
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

---

## 🌐 Deployment

### Frontend → Vercel

```bash
npm i -g vercel
cd lexindia-frontend
vercel --prod
```

Set `VITE_API_BASE_URL` to your Render backend URL in the Vercel dashboard.

### Backend → Render

1. Push backend repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your `lexindia-backend` repository
4. Build command: `npm install` | Start command: `node server.js`
5. Add all environment variables from `.env`

### CI/CD — GitHub Actions

```
Push to main
  → Lint (ESLint)
  → Test (Jest)
  → Deploy Frontend to Vercel
  → Deploy Backend to Render
```

---

## 🖼 Screenshots

| Page | Preview |
|---|---|
| 🏠 User Dashboard | _(coming soon)_ |
| 📚 Browse Acts | _(coming soon)_ |
| 🔍 Search Results | _(coming soon)_ |
| 📖 Section Detail | _(coming soon)_ |
| 🔖 Bookmarks | _(coming soon)_ |
| 📊 Admin Dashboard | _(coming soon)_ |
| 👥 Admin Users | _(coming soon)_ |

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
git checkout -b feat/your-feature-name
git commit -m "feat(search): add section-level relevance scoring"
git push origin feat/your-feature-name
```

Commit convention: `feat | fix | chore | docs | refactor | test`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Built with ❤️ for Indian legal access**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/Dharmi-456-design)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/dharmi-patel-0b899b389/)
[![YouTube](https://img.shields.io/badge/YouTube-Demo%20Video-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/@DharmiPatel-x5l)

> *"India's Law, Decoded."*

⭐ **Star this repo if you found it useful!**

</div>
