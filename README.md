# Delivery Agent Management System

A full-stack web application designed to manage delivery agent records, featuring caching, persistent relational storage, and an interactive React dashboard.

---

## Tech Stack & Architecture Choices

- **Backend:** Node.js with Express.js — lightweight, fast, and simple REST API architecture.
- **Frontend:** React with Vite & Tailwind CSS — component-based UI with responsive design.
- **Database:** PostgreSQL — ACID-compliant relational database ensuring data integrity with strict constraints (unique emails, validated statuses, indexing).
- **Cache:** Redis via `ioredis` — in-memory key-value cache layer with automatic TTL and event-driven invalidation.

---

## Project Structure

```text
├── backend/
│   ├── db/
│   │   ├── schema.sql              # SQL schema definitions & indices
│   │   ├── migrate.js              # Migration runner script
│   │   └── seed.js                 # Sample dataset seeder
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # PostgreSQL connection pool (pg)
│   │   │   └── redis.js            # Redis client configuration & fallback
│   │   ├── controllers/
│   │   │   └── agentController.js  # CRUD handlers and caching logic
│   │   ├── routes/
│   │   │   └── agentRoutes.js      # REST endpoint definitions
│   │   ├── utils/
│   │   │   └── cache.js            # Redis helper utilities (get, set, del)
│   │   ├── app.js                  # Express app configuration
│   │   └── server.js               # HTTP server entrypoint
│   ├── tests/
│   │   └── agent.test.js           # Jest & Supertest API test suite
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── AgentList.jsx
│   │   │   ├── AgentFormModal.jsx
│   │   │   ├── AgentDetailsModal.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   ├── services/
│   │   │   └── api.js              # API service wrapper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Core Agent Record Schema

Each delivery agent includes:
- `id`: Unique identifier (Serial auto-increment integer)
- `full_name`: Agent's full name (required, string)
- `phone`: Contact phone number (required, string)
- `email`: Contact email address (required, unique, validated)
- `service_area`: Delivery zone / neighborhood (required, string)
- `status`: Availability status (`active` or `inactive`, default: `active`)
- `created_at`: Timestamp of creation (auto-generated)
- `updated_at`: Timestamp of last modification (auto-updated)

---

## Redis Caching Strategy

### What is Cached?
1. **Agent List (`agents:list:*`):**
   - Stores query results partitioned by filter criteria (e.g., `agents:list:active:all:none`).
   - Time to Live (TTL): **300 seconds (5 minutes)**.
2. **Individual Agent Details (`agent:<id>`):**
   - Stores single agent profile details.
   - Time to Live (TTL): **600 seconds (10 minutes)**.
3. **Overview Statistics (`agents:stats`):**
   - Stores aggregated counts of active/inactive agents and service areas.
   - Time to Live (TTL): **300 seconds (5 minutes)**.

### Cache Verification Header
- Read requests return an `X-Cache` HTTP header:
  - `X-Cache: HIT` indicates the response was served directly from Redis.
  - `X-Cache: MISS` indicates the response was retrieved from PostgreSQL and subsequently cached.

### Cache Invalidation Strategy
To guarantee strict consistency:
- **On Agent Creation (`POST /api/agents`):**
  All list cache keys (`agents:list*`) and statistics (`agents:stats`) are purged so new records immediately appear in queries.
- **On Agent Update (`PUT /api/agents/:id`):**
  The specific agent key (`agent:<id>`), all list cache keys (`agents:list*`), and statistics (`agents:stats`) are purged.
- **On Agent Deletion (`DELETE /api/agents/:id`):**
  The specific agent key (`agent:<id>`), all list cache keys (`agents:list*`), and statistics (`agents:stats`) are purged.
- **Graceful Degradation:**
  If Redis is not running or temporarily unreachable, the application automatically catches the error and transparently falls back to PostgreSQL without interrupting user traffic.

---

## Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000

# Option A: Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=delivery_db

# Option B: Cloud PostgreSQL (e.g. Neon, Supabase, Render)
# DATABASE_URL=postgresql://user:password@host:5432/delivery_db?sslmode=require

# Option A: Local Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Option B: Cloud Redis (e.g. Upstash)
# REDIS_URL=redis://default:password@host:6379
```

### Frontend (`frontend/.env`)
Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api/agents
```

---

## Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (installed locally or a free cloud database like Neon.tech)
- Redis (installed locally or a free cloud Redis like Upstash, or run without Redis thanks to the graceful fallback)

### 2. Create Database & Run Migrations
In PostgreSQL (via pgAdmin, psql, or your cloud console), create the database:

```sql
CREATE DATABASE delivery_db;
```

Then run the migration script to create the table and indices, and optionally seed sample data:

```bash
cd backend
npm run migrate
npm run seed
```

### 3. Start the Backend API
From the `backend` folder:

```bash
npm run dev
```

The API will start at `http://localhost:5000`. Test health status at `http://localhost:5000/health`.

### 4. Start the React Frontend
In a separate terminal window:

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## API Documentation

### 1. Create Agent
- **Endpoint:** `POST /api/agents`
- **Body:**
  ```json
  {
    "full_name": "Rahul Sharma",
    "phone": "+91 98765 43210",
    "email": "rahul.sharma@example.com",
    "service_area": "North Delhi",
    "status": "active"
  }
  ```
- **Responses:**
  - `201 Created`: Returns newly created agent record.
  - `400 Bad Request`: Validation errors (missing fields, invalid email format, invalid status).
  - `409 Conflict`: Email already registered.

### 2. List Agents
- **Endpoint:** `GET /api/agents`
- **Query Parameters:**
  - `status` (optional): `active` | `inactive`
  - `service_area` (optional): filter by service area name
  - `search` (optional): search text across name, email, phone, and area
- **Responses:**
  - `200 OK`: Returns array of agents, count, and cache status.
  - Header `X-Cache: HIT` or `X-Cache: MISS`.

### 3. Get Single Agent Details
- **Endpoint:** `GET /api/agents/:id`
- **Responses:**
  - `200 OK`: Returns agent record.
  - `404 Not Found`: Agent ID not found.

### 4. Update Agent
- **Endpoint:** `PUT /api/agents/:id`
- **Body:** Any updatable field (`full_name`, `phone`, `email`, `service_area`, `status`).
- **Responses:**
  - `200 OK`: Returns updated record.
  - `404 Not Found`: Agent does not exist.
  - `409 Conflict`: Target email already used by another agent.

### 5. Delete Agent
- **Endpoint:** `DELETE /api/agents/:id`
- **Responses:**
  - `200 OK`: Confirms record deletion.
  - `404 Not Found`: Agent does not exist.

### 6. Get Summary Statistics
- **Endpoint:** `GET /api/agents/stats`
- **Responses:**
  - `200 OK`: `{ "total": 5, "active": 4, "inactive": 1, "areas": 5 }`

---

## Automated Testing

Run the test suite:

```bash
cd backend
npm test
```
All 12 automated tests verify CRUD flows, validations, HTTP status codes, and cache HIT/MISS behavior without needing external services running.
