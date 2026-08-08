# 🏔️ Himalayan Guest Experience Intelligence Platform

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?logo=openai&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

<p align="center">
  <strong>AI-powered hospitality analytics platform that transforms guest reviews into actionable business insights using Large Language Models.</strong>
</p>

<p align="center">
  <a href="https://himalayan-app-pranjal.vercel.app/">🌐 Live Demo</a> •
  <a href="https://youtu.be/HY5tq4guf_U">🎬 Demo Video</a> •
  <a href="https://github.com/pranjalpundeer/Himalayan-Guest-Experience-Intelligence-Platform">📦 GitHub Repo</a>
</p>

---

## 📖 Overview

The **Himalayan Guest Experience Intelligence Platform** is a full-stack web application built to help hotels, resorts, and hospitality businesses in the Himalayan region understand and act on customer feedback — instantly and intelligently.

Instead of manually reading hundreds of guest reviews, the platform automatically:

- 🔍 **Detects sentiment** — Positive, Neutral, or Negative classification
- 🏷️ **Identifies themes** — Food, Cleanliness, Service, Location, and more
- 💬 **Generates smart responses** — AI-crafted, professional management replies
- 📊 **Visualizes trends** — Interactive charts and analytics dashboard
- 🔐 **Secures access** — JWT-based authentication with protected routes

---

## 🖼️ Screenshots

### 🖥️ Dashboard — Desktop (1440px)
<img width="1440" alt="Dashboard Desktop" src="https://github.com/user-attachments/assets/fb1e5ef6-6674-46ea-a759-14b8330f9006" />

### 📱 Mobile View (375px)
<img width="375" alt="Mobile View" src="https://github.com/user-attachments/assets/05ac7634-b73e-4f97-842e-025672e52a51" />

### 🌙 Dark Mode
<img width="1440" alt="Dark Mode" src="https://github.com/user-attachments/assets/3a54483f-cf3e-4da0-9826-c43dafd84135" />

### ☀️ Light Mode
<img width="1440" alt="Light Mode" src="https://github.com/user-attachments/assets/c5db45e1-3c4e-4a00-a681-0a7a61df07e7" />

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Review Analysis** | Sentiment classification, theme detection, AI-generated response suggestions via OpenAI GPT-3.5 |
| 📊 **Analytics Dashboard** | Pie charts, stat cards, theme distribution, sentiment breakdown |
| 👤 **Authentication** | JWT-based login/register with protected routes and session management |
| 🔎 **Search & Filter** | Filter reviews by sentiment, theme, rating; full-text search |
| 📥 **CSV Export** | Download filtered review data as CSV |
| 🌗 **Dark/Light Mode** | Full theme toggle with persistent context |
| 📱 **Responsive Design** | Mobile, tablet, and desktop optimized |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Vite** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization (pie, bar charts) |
| **Axios** | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **OpenAI SDK** | GPT-3.5 integration for AI analysis |
| **Mongoose** | MongoDB ODM |
| **JWT + bcryptjs** | Authentication & password hashing |
| **express-validator** | Input validation middleware |
| **express-rate-limit** | API rate limiting |
| **Passport.js** | OAuth strategy (Google) |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | Primary database (cloud: MongoDB Atlas) |
| **NeDB** | Embedded fallback for local dev without MongoDB |

### Hosting
| Service | What it hosts |
|---|---|
| **Vercel** | React frontend |
| **Render** | Express backend + API |
| **MongoDB Atlas** | Cloud database |

---

## 📂 Project Structure

```
himalayan-review-platform/
│
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   └── ui/                  # Reusable component library
│       │       ├── Button.jsx
│       │       ├── Input.jsx
│       │       ├── Modal.jsx
│       │       ├── Toast.jsx
│       │       └── Loader.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── About.jsx
│       ├── context/
│       │   ├── ThemeContext.jsx     # Dark/Light mode
│       │   └── ToastContext.jsx     # Notifications
│       └── utils/
│           ├── api.js
│           └── exportCSV.js
│
└── server/                          # Express backend
    ├── controllers/
    │   ├── analyzeController.js     # AI analysis logic
    │   ├── reviewController.js      # CRUD operations
    │   └── statsController.js       # Aggregated stats
    ├── models/
    │   ├── Review.js                # Mongoose schema
    │   └── User.js                  # User schema
    ├── routes/
    │   ├── analyze.js               # POST /api/analyze
    │   ├── reviews.js               # CRUD /api/reviews
    │   ├── stats.js                 # GET /api/stats
    │   └── auth.js                  # Auth routes
    ├── middleware/
    │   ├── auth.js                  # JWT protect middleware
    │   ├── validateReview.js        # Input validation
    │   └── errorHandler.js
    └── services/                    # Business logic layer
```

---

## 🔌 API Reference

### 🤖 AI Analysis — `POST /api/analyze`

Sends review text to OpenAI GPT-3.5 and returns structured analysis.

**Request:**
```json
{
  "reviews": [
    {
      "guestName": "Rahul Sharma",
      "rating": 4,
      "review": "Beautiful mountain views. Food was excellent but room service was slow."
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "guestName": "Rahul Sharma",
      "rating": 4,
      "review": "Beautiful mountain views...",
      "sentiment": "Positive",
      "theme": "Food & Service",
      "response": "Thank you Rahul for your wonderful feedback! We're delighted you enjoyed the views and cuisine. We're actively improving our room service turnaround times."
    }
  ]
}
```

---

### 📋 Reviews CRUD — `GET /api/reviews`

Full CRUD with search, filter, and pagination.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | ❌ | List all reviews |
| `GET` | `/api/reviews/search?q=food` | ❌ | Full-text search |
| `GET` | `/api/reviews/:id` | ❌ | Get single review |
| `POST` | `/api/reviews` | ✅ JWT | Create review |
| `PUT` | `/api/reviews/:id` | ✅ JWT | Update review |
| `DELETE` | `/api/reviews/:id` | ✅ JWT | Delete review |

---

### 📊 Stats — `GET /api/stats`

Returns aggregated analytics.

**Response:**
```json
{
  "total": 150,
  "positive": 95,
  "negative": 30,
  "neutral": 25,
  "averageRating": 4.1,
  "themes": {
    "Food": 45,
    "Cleanliness": 30,
    "Service": 40,
    "Location": 35
  }
}
```

---

## 🗄️ Database Schema

### Review Collection (`reviews`)

```js
{
  guestName:  String,   // required, max 100 chars
  rating:     Number,   // required, 1–5
  review:     String,   // required, max 2000 chars
  sentiment:  String,   // enum: ["Positive", "Neutral", "Negative"]
  theme:      String,   // e.g. "Food", "Cleanliness", "Service"
  response:   String,   // AI-generated management response
  createdAt:  Date,     // auto timestamps
  updatedAt:  Date
}
```

### User Collection (`users`)

```js
{
  name:       String,   // required
  email:      String,   // required, unique
  password:   String,   // bcrypt hashed
  createdAt:  Date
}
```

**Indexes:** Text index on `guestName`, `review`, `theme`, `sentiment` for full-text search performance.

---

## 🤖 AI Feature

**Model:** OpenAI `gpt-3.5-turbo`

**Use Case:** Automated guest review intelligence

The platform sends structured prompts to GPT-3.5 with each review's text and rating. The model returns:
1. **Sentiment** — `Positive`, `Neutral`, or `Negative`
2. **Theme** — Primary complaint/praise category (Food, Service, Cleanliness, Location, etc.)
3. **Response** — A ready-to-use, professional management reply

This eliminates hours of manual review processing for hospitality managers.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB URI (or runs with NeDB fallback)
- OpenAI API Key

### 1. Clone & Install

```bash
git clone https://github.com/pranjalpundeer/Himalayan-Guest-Experience-Intelligence-Platform.git
cd Himalayan-Guest-Experience-Intelligence-Platform

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
# In /server
npm run dev

# In /client
npm run dev
```

App runs at `http://localhost:5173` · API at `http://localhost:5000`

---

## 🌐 Live URLs

| Resource | URL |
|---|---|
| 🌐 Live App | [https://himalayan-app-pranjal.vercel.app/](https://himalayan-app-pranjal.vercel.app/) |
| 📦 GitHub Repo | [https://github.com/pranjalpundeer/Himalayan-Guest-Experience-Intelligence-Platform](https://github.com/pranjalpundeer/Himalayan-Guest-Experience-Intelligence-Platform) |
| 🎬 Demo Video | [https://youtu.be/HY5tq4guf_U](https://youtu.be/HY5tq4guf_U) |

---

## 👨‍💻 Author

**Pranjal Pundeer**  
Intern ID: TBI-26101352  
TBI-GEU Summer Internship Program 2025

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
