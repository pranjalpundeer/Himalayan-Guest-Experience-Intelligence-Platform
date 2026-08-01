# 🏔️ Himalayan Guest Experience Intelligence Platform

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-black?logo=openai)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)
![Week](https://img.shields.io/badge/SIP-Week%203-orange)

</p>

> AI-powered hospitality analytics platform that transforms guest reviews into actionable business insights using Large Language Models.

---

# 📖 Overview

Himalayan Guest Experience Intelligence Platform helps hotels, resorts, and hospitality businesses understand customer feedback instantly.

Instead of manually reading hundreds of reviews, the platform automatically:

- Detects sentiment
- Identifies major complaint themes
- Generates professional management responses
- Calculates business insights
- Visualizes customer satisfaction trends

The project combines **React**, **Node.js**, **Express**, and **OpenAI** to create a modern AI-powered analytics dashboard.

---

# ✨ Features

## 🤖 AI Review Analysis

- Sentiment Classification
- Theme Detection
- AI-generated Response Suggestions
- Review Categorization
- Batch Review Processing

---

## 📊 Dashboard

- Total Reviews
- Positive Reviews
- Negative Reviews
- Neutral Reviews
- Theme Distribution
- Sentiment Analytics
- Interactive Charts

---

## 👤 Authentication

- User Login
- Secure Authentication
- Protected Dashboard
- Session Management

---

## 📈 Analytics

- Pie Charts
- Review Statistics
- Theme Analysis
- Sentiment Breakdown
- Exportable Reports

---

## 📂 Data Management

- CSV Export
- Search Reviews
- Filter by Theme
- Filter by Sentiment
- Sort Results

---

## 🎨 User Experience

- Responsive Design (Mobile / Tablet / Desktop)
- Modern UI
- Dark / Light Mode Toggle
- Loading States
- Error Handling
- Clean Dashboard

---

## 🧩 Component Library (Week 3)

Reusable UI primitives in `client/src/components/ui/`:

| Component | Description |
|---|---|
| `Button` | Primary, secondary, ghost variants with size control |
| `Input` | Text input with label, error state, icon support |
| `Modal` | Accessible overlay dialog with backdrop dismiss |
| `Toast` | Auto-dismissing notification (success / error / warning / info) |
| `Loader` | Animated spinner with size and overlay variants |

All components are documented with JSDoc, exported via `index.js`, and demoed at `/components`.

---

# 🖼️ Screenshots

## Desktop (1440px)
<img width="1440" height="2295" alt="screenshot_desktop" src="https://github.com/user-attachments/assets/fb1e5ef6-6674-46ea-a759-14b8330f9006" />


## Tablet (768px)
<img width="768" height="3141" alt="screenshot_tablet" src="https://github.com/user-attachments/assets/3e54983a-7378-4a6a-9382-da5470c97f50" />


## Mobile (375px)
<img width="375" height="3965" alt="screenshot_mobile" src="https://github.com/user-attachments/assets/05ac7634-b73e-4f97-842e-025672e52a51" />


## Light Mode
<img width="1440" height="2295" alt="screenshot_light" src="https://github.com/user-attachments/assets/c5db45e1-3c4e-4a00-a681-0a7a61df07e7" />


## Dark Mode
<img width="1440" height="2295" alt="screenshot_dark" src="https://github.com/user-attachments/assets/3a54483f-cf3e-4da0-9826-c43dafd84135" />


---

# 🏗️ Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts

---

## Backend

- Node.js
- Express.js
- OpenAI SDK

---

## AI

- OpenAI GPT-3.5

---

## Database

- MongoDB *(if connected)*

---

## Authentication

- JWT / Firebase *(depending on your implementation)*

---

# 📂 Project Structure

```text
himalayan-review-platform/
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                        ← Week 3: Component Library
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── index.js
│   │   │   ├── DashboardSidebar.jsx       ← Week 3
│   │   │   ├── ReviewDetailModal.jsx      ← Week 3
│   │   │   ├── ThemeToggle.jsx            ← Week 3
│   │   │   ├── Badge.jsx
│   │   │   ├── ErrorBanner.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LiveReviewsPanel.jsx       ← Week 4: live /api/reviews + /api/stats demo
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultsTable.jsx
│   │   │   ├── ReviewInput.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatsCards.jsx
│   │   │
│   │   ├── context/                       ← Week 3
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── data/
│   │   │   └── sampleData.js
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── ComponentShowcase.jsx      ← Week 3
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── exportCSV.js
│   │   │   └── reviewMeta.js              ← Week 3
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── analyzeController.js
│   │   ├── reviewController.js            ← Week 4
│   │   └── statsController.js             ← Week 4
│   ├── middleware/                        ← Week 4
│   │   ├── errorHandler.js
│   │   └── validateReview.js
│   ├── data/                              ← Week 4
│   │   └── reviews.js
│   ├── routes/
│   │   ├── analyze.js
│   │   ├── reviews.js                     ← Week 4
│   │   └── stats.js                       ← Week 4
│   ├── services/
│   │   └── openaiService.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── docs/
│   └── screenshots/                       ← Week 3 responsive screenshots
│
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/pranjalpundeer/Himalayan-Guest-Experience-Intelligence-Platform.git
cd Himalayan-Guest-Experience-Intelligence-Platform
```

## Install Dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

---

# 🔑 Environment Variables

Create `server/.env`:

```env
OPENAI_API_KEY=your_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

# ▶️ Run Project

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` — and go to `/components` to see the full component library showcase.

---

# 🧪 How to Run Backend Locally (Week 4)

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Create your local `.env` file** from the provided example (the real `.env` is git-ignored and never committed):
   ```bash
   cp .env.example .env
   ```
   Then fill in your own `OPENAI_API_KEY` (only required for the `/api/analyze` route — the
   `/api/reviews` and `/api/stats` endpoints work without it).

3. **Start the server**
   ```bash
   npm run dev      # nodemon, auto-restarts on file changes
   # or
   npm start        # plain node
   ```

4. **Confirm it's running**
   ```bash
   curl http://localhost:5000/health
   # {"status":"ok","message":"Himalayan Platform API is running"}
   ```

5. **Try the new Week 4 endpoints**
   ```bash
   curl http://localhost:5000/api/reviews
   curl http://localhost:5000/api/stats
   curl "http://localhost:5000/api/reviews/search?q=hospitality"
   ```

The server runs on `http://localhost:5000` by default (configurable via `PORT` in `.env`).
CORS is restricted to `CLIENT_URL` (defaults to `http://localhost:5173`).

---

# 📡 API

## Guest Reviews — `/api/reviews` (Week 4)

| Method | Endpoint              | Description                                  |
|--------|------------------------|-----------------------------------------------|
| GET    | `/api/reviews`         | List all reviews                              |
| GET    | `/api/reviews/search?q=` | Search reviews by keyword, guest, theme, sentiment |
| GET    | `/api/reviews/:id`     | Get a single review by id                     |
| POST   | `/api/reviews`         | Create a new review                           |
| PUT/PATCH | `/api/reviews/:id`  | Update an existing review                     |
| DELETE | `/api/reviews/:id`     | Delete a review                               |

**Create / Update body**
```json
{
  "guestName": "Ananya Sharma",
  "rating": 5,
  "review": "Amazing food and very friendly staff!",
  "theme": "Food"
}
```

**List response**
```json
{
  "success": true,
  "count": 8,
  "data": [
    { "id": "r1", "guestName": "Ananya Sharma", "rating": 5, "sentiment": "Positive", "theme": "Hospitality", "review": "..." }
  ]
}
```

Error responses use a consistent shape and correct HTTP status codes (`400` validation, `404` not found, `500` server error):
```json
{ "success": false, "error": "Review not found" }
```

## Guest Stats — `/api/stats` (Week 4)

| Method | Endpoint      | Description                                         |
|--------|---------------|------------------------------------------------------|
| GET    | `/api/stats`  | Total/positive/negative/neutral counts, average rating, theme breakdown |

```json
{
  "success": true,
  "data": { "total": 8, "positive": 4, "negative": 2, "neutral": 2, "averageRating": 3.4 }
}
```

## POST `/api/analyze` (existing — unchanged)

### Request
```json
{
  "reviews": ["Great food and amazing staff!"]
}
```

### Response
```json
{
  "results": [
    {
      "review": "Great food and amazing staff!",
      "sentiment": "Positive",
      "theme": "Food",
      "response": "Thank you for your kind words! We are thrilled our team made your stay memorable."
    }
  ]
}
```

---

# 🧠 AI Workflow

```
Guest Reviews → OpenAI Analysis → Sentiment Detection
      → Theme Classification → AI Response Generation → Dashboard
```

---

# 🚀 Future Improvements

- Multi-language review support
- PDF Report Generation
- Email Reports
- Real-time Analytics
- Hotel Admin Panel
- Team Collaboration
- AI Trend Prediction
- Review History
- Cloud Deployment
- Accessibility (ARIA) pass on component library

---

# 🎯 Learning Outcomes

This project demonstrates:

- REST API Development
- React Application Architecture
- AI Integration & Prompt Engineering
- Reusable Component Library Design
- Dark / Light Theme System
- Responsive UI Development (Mobile → Desktop)
- Data Visualization
- Error Handling & Loading States
- Software Engineering Best Practices

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Pranjal Pundeer**  
Engineering Student  
AI • Full Stack Development • Software Engineering

---

⭐ If you like this project, consider giving it a star!

---

# 💾 Week 5 — Database Integration

## Database Choice: MongoDB with Mongoose ODM

**Why MongoDB?**
- **Flexible schema** — guest review fields (theme, response, AI tags) evolve weekly without painful migrations
- **JSON-native** — API already returns JSON; Mongoose documents map directly with zero transformation
- **Mongoose ODM** — provides schema validation, virtual fields, timestamps out-of-the-box
- **Free Atlas tier** — no infrastructure cost for a student project
- **NeDB fallback** — server works offline with embedded file storage (same API, zero config needed)

## Schema Diagram

Review collection schema (see `server/models/Review.js`):

```
Collection: reviews
┌─────────────────────────────────────────────────────────┐
│ _id (ObjectId, PK)      Primary key                     │
│ guestName (String)*     Required, max 100 chars         │
│ rating (Number)*        Required, min 1, max 5          │
│ review (String)*        Required, max 2000 chars        │
│ sentiment (String)      enum: Positive|Neutral|Negative │
│ theme (String)          e.g. Food, Spa, Location        │
│ response (String)       Staff reply text                 │
│ createdAt (Date)        auto-populated (timestamps)      │
│ updatedAt (Date)        auto-populated (timestamps)      │
└─────────────────────────────────────────────────────────┘
* = required field, with validation
```

## Set Up the Database

### Option 1: MongoDB Atlas (Cloud)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/himalayan`
3. Add it to `server/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/himalayan?retryWrites=true&w=majority
   ```
4. Restart the server — it will auto-connect

### Option 2: Embedded NeDB (Local, No Setup)

Leave `MONGO_URI` blank or unset in `server/.env`. The server automatically:
- Creates an embedded NeDB store (`server/db/reviews.db`)
- Seeds 8 sample reviews on first run
- Supports all 6+ CRUD endpoints identically

Both modes use the **same Mongoose schema** and **same API** — seamless fallback.

### Verification

```bash
# Fetch all reviews from the DB (MongoDB or NeDB, same API)
curl http://localhost:5000/api/reviews

# Create a new review (persisted to DB)
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"guestName":"Test Guest","rating":5,"review":"Amazing!","theme":"Food","sentiment":"Positive"}'

# Update a review
curl -X PUT http://localhost:5000/api/reviews/r1 \
  -H "Content-Type: application/json" \
  -d '{"guestName":"Updated Name","rating":4}'

# Delete a review
curl -X DELETE http://localhost:5000/api/reviews/r1

# Stats (computed from DB)
curl http://localhost:5000/api/stats
```

All data is **persisted** to the database (not in-memory), survives server restarts, and supports concurrent updates.


---

# 🔐 Week 6 — Authentication System

## Overview

Full JWT-based authentication with email/password and Google OAuth, rate limiting, and protected routes on both frontend and backend.

## Auth Endpoints — `/api/auth`

| Method | Endpoint | Description | Rate Limited |
|--------|----------|--------------|--------------|
| POST | `/api/auth/register` | Create account (name, email, password, role) | 10 / 15 min |
| POST | `/api/auth/login` | Login, returns JWT | 5 / 15 min |
| POST | `/api/auth/logout` | Clear auth cookie | — |
| GET | `/api/auth/me` | Get current user (**protected**) | — |
| GET | `/api/auth/google` | Start Google OAuth flow | — |
| GET | `/api/auth/google/callback` | Google OAuth callback | — |

## Protected Routes

**Backend**: `POST/PUT/PATCH/DELETE /api/reviews*` and `GET /api/auth/me` require a valid JWT
(`Authorization: Bearer <token>`). Missing/invalid tokens return `401 Unauthorized`.

**Frontend**: `/dashboard` and `/analytics` are wrapped in `<ProtectedRoute>` — unauthenticated users
are redirected to `/login`, then returned to the page they wanted after signing in.

## Set Up Auth Locally

1. Add to `server/.env` (see `.env.example`):
   ```
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

2. **For Google OAuth**, create an OAuth 2.0 Client ID at
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials) with:
   - Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Scopes: `profile`, `email`

3. Test:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'

   curl http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer <token-from-login>"
   ```


---

## 🚀 Deployment

### Live URLs

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://himalayan-app-pranjal.vercel.app |
| **Backend (Render)** | https://himalayan-guest-experience-intelligence.onrender.com |

> ✅ Both services are live and fully deployed.

---

### 🖥️ Frontend Deployment (Vercel)

1. Push this repo to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo.
3. Set **Root Directory** to `client`.
4. Add Environment Variable:
   ```
   VITE_API_URL = https://your-render-app.onrender.com/api
   ```
5. Click **Deploy**. Vercel auto-detects Vite and builds it.
6. A `vercel.json` in `client/` handles SPA routing (all paths redirect to `index.html`).

---

### ⚙️ Backend Deployment (Render)

1. Go to [render.com](https://render.com) → **New Web Service** → Connect your GitHub repo.
2. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add the following Environment Variables in Render dashboard:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random secret string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `OPENAI_API_KEY` | Your OpenAI API key |
   | `CLIENT_URL` | Your Vercel frontend URL |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
   | `GOOGLE_CALLBACK_URL` | `https://your-render-app.onrender.com/api/auth/google/callback` |

4. A `render.yaml` in the project root pre-configures the service.

---

### 🗄️ Database Setup (MongoDB Atlas)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and whitelist `0.0.0.0/0` (all IPs) for Render.
3. Copy the connection string and set it as `MONGO_URI` in Render.
4. If `MONGO_URI` is not set, the app automatically falls back to an embedded **NeDB** file-based store (data persists on disk but resets on Render free-tier redeploys).

---

### 🧰 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router, Recharts, Axios |
| **Backend** | Node.js, Express.js, REST API |
| **AI** | OpenAI GPT-4o (sentiment, themes, response generation) |
| **Database** | MongoDB Atlas (production) / NeDB (fallback/dev) |
| **Auth** | JWT (email/password) + Google OAuth 2.0 (Passport.js) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

### ⚠️ Known Limitations on Free Tier

| Limitation | Detail |
|------------|--------|
| **Render cold starts** | The free tier spins down after 15 minutes of inactivity. The **first request after idle takes 30–60 seconds** to wake up. Subsequent requests are fast. |
| **NeDB fallback** | If `MONGO_URI` is not configured, data is stored in a local `.db` file. On Render's free tier, this file is **wiped on every redeploy** — use MongoDB Atlas for persistent data. |
| **OpenAI rate limits** | The free/trial OpenAI tier has low rate limits. Batch-analyzing many reviews at once may hit a `429 Too Many Requests` error. |
| **Vercel function timeout** | Vercel serverless functions time out at 10s on the hobby plan — not an issue here since the frontend is purely static. |
| **Google OAuth callback** | Must update `GOOGLE_CALLBACK_URL` env var on Render to match the live domain after first deploy. |

