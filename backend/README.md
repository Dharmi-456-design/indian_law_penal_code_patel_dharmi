# 🚀 LexIndia Backend Service

This is the Express.js API backend for **LexIndia — India's Premier Legal Reference Platform**. It handles authentication, RBAC, full-text search, user annotations (notes), bookmarks, admin audits, and analytics dashboards across 8 major Indian Acts.

---

## 🛠 Features & Security Stack
- 🔐 **Authentication & RBAC**: JWT token-based authentication with separate `user` and `admin` roles.
- 🔍 **Full-Text Legal Search**: Powered by MongoDB `$text` indexes and text relevance scoring.
- ⚡ **Performance & Pagination**: Reusable pagination helper and query builder for paginated sections.
- 📊 **Analytics Pipeline**: MongoDB Aggregation pipeline queries for statistics, user growth, act distribution, and trending searches.
- 🛡 **Security**:
  - **Helmet.js** for securing HTTP headers.
  - **express-rate-limit** for API rate limiting (100 requests per 15 minutes per IP).
  - **bcryptjs** (12 rounds) for password hashing.
  - **express-validator** for strictly validating all inputs.
  - **CORS whitelist** configurations.
  - **Soft delete** implementation (`isArchived` flag) for section deletions.
  - **Audit Logs** for tracking all admin write/update mutations with details and IP addresses.

---

## 📂 Backend Project Structure

```
backend/
├── coverage/                  # Jest coverage report output
├── docs/
│   └── openapi.yaml           # Complete OpenAPI 3.0.3 Specification
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB Atlas connection
│   │   └── env.js             # Environment variable validator
│   ├── controllers/           # Route controller functions
│   ├── data/                  # Original raw JSON datasets of the 8 Acts
│   ├── middlewares/           # Global, Auth, Role, Validator, Logger & Error middleware
│   ├── models/                # Mongoose Schema Definitions (User, Section, Note, etc.)
│   ├── routes/                # Route definitions split by resource
│   │   └── v1/                # v1 API endpoints router mapping
│   ├── services/              # Business logic layers
│   ├── utils/                 # Reusable utility functions (ApiError, ApiResponse, pagination, etc.)
│   └── scripts/
│       └── seed.js            # Normalized bulk database seeder
├── tests/                     # Jest + Supertest integration tests suite
├── .env                       # Local environment variables configuration
├── .env.example               # Example configurations template
├── package.json               # Package dependencies & npm scripts
└── server.js                  # App bootstrap entrypoint
```

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9.x or higher
- **MongoDB**: A running MongoDB Atlas cluster or a local MongoDB community server.

### 2. Installation
Navigate to the backend directory and install the node dependencies:
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file by copying the template from `.env.example`:
```bash
cp .env.example .env
```
Fill in the configuration details inside `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lexindia
JWT_SECRET=your_super_strong_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Database Seeding
To seed MongoDB with all 8 Acts (2,043+ sections normalized) and create a default admin account, run the idempotent seeding script:
```bash
npm run seed
```
This script parses the raw files, normalizes fields, fixes malformed CSV keys, resolves section formatting, performs bulk upserts, and generates the necessary `$text` index.

### 5. Running the Application
To run the server in development mode (with hot reloading enabled via node watch):
```bash
npm run dev
```
The backend server will run at `http://localhost:5000`.

To run the server in production mode:
```bash
npm start
```

---

## 🧪 Testing

The codebase includes integration tests for all routers, middleware, and database operations. Tests are run using Jest and Supertest.

To run the test suite:
```bash
npm test
```
To run tests with code coverage report generation:
```bash
npx jest --coverage
```

---

## 📡 API Reference & Documentation

A complete documentation of all API routes, parameter parameters, bodies, and response envelopes is located in the **OpenAPI v3.0.3 Spec** at:
👉 **[`backend/docs/openapi.yaml`](docs/openapi.yaml)**

You can view the endpoints details inside that spec. Here is a brief summary of available categories:

| Base Route | Description | Auth Required | Admin-Only |
| :--- | :--- | :---: | :---: |
| `/api/v1/auth` | User register, login, logout, get profile, and refresh token | Optional / Yes | No |
| `/api/v1/sections` | Complete CRUD on Sections, recent, trending, random, and archive | Yes | Partially (Mutations & Archive) |
| `/api/v1/search` | Global search across all acts | Optional | No |
| `/api/v1/acts` | Query metadata, sections list, chapter lists, and stats per Act | Yes | No |
| `/api/v1/users` | Admin user manager dashboard and self-profile updates | Yes | Partially (User lists & status toggle) |
| `/api/v1/bookmarks` | Manage personal section bookmarks and annotations | Yes | No |
| `/api/v1/notes` | Create, read, update, delete personal notes on laws | Yes | No |
| `/api/v1/analytics` | Fetch metrics overview, charts datasets, search terms, and growth | Yes | Yes |
| `/api/v1/health` | Public server heartbeat check | No | No |
