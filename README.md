# vote_polling

> A secure, responsive voting web application for admins and users — create polls, vote once per poll, and view results as a static summary chart. 🚀

---

## Project Overview

This project provides a secure and responsive voting system where users can register, vote, and view results. Admins create multiple-choice polls and manage poll lifecycle (open/close). The app demonstrates full CRUD cycles, role-based access (Admin/User), and clean API design.

---

## ⭐ Key Features

* **User Roles**: Admin and User with role-based access control.
* **Create & Manage Polls**: Admins can create, edit, delete, and close polls.
* **Vote Once**: Each authenticated user can cast only one vote per poll.
* **Real-Time Results**: Results update and can be shown as a static summary chart after closing.
* **JWT Authentication**: Secure registration/login using JSON Web Tokens.
* **Responsive UI**: Built with Tailwind CSS; works on mobile and desktop.

---

## 🧰 Technology Stack

**Frontend**

* React.js (Vite)
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB

**Auth**

* JWT (JSON Web Tokens)

**Version Control**

* GitHub

---

## 🧠 Why these technologies?

* **React + Vite**: Fast dev server, quick HMR, and modern build pipeline.
* **Tailwind CSS**: Utility-first approach for fast, consistent UI styling.
* **Node.js + Express**: Simple, flexible backend for RESTful APIs.
* **MongoDB**: Flexible schema works well for polls/options/votes relationships.
* **JWT**: Stateless, scalable authentication for APIs.

---

## ⚙️ Prerequisites

* Node.js 
* npm 
* MongoDB
* Github

---

## 📦 Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/manisha-bhadani-02/vote_polling.git
cd vote_polling
```

2. **Backend setup**

```bash
cd backend
npm install
# create a .env file (see .env.example)
npm run dev
```

3. **Frontend setup**

```bash
cd ../frontend
npm install
npm run dev
```

4. Open the frontend dev URL (Vite default) and backend API URL in your browser.

---


## 🧩 System Components (high-level)

```
┌────────────────────────────────────────┐
│            POLL & VOTING SYSTEM        │
└────────────────────────────────────────┘
       ▲                          ▲
       │                          │
  [Admin Role]               [User Role]
```

---

## 🔁 Workflow Diagram (text)

```
START APP
  ├─> USER REGISTRATION & LOGIN (JWT)
  ├─> ADMIN DASHBOARD          USER DASHBOARD
  │    ├─ Create / Edit /      ├─ View OPEN POLLS
  │    │  Delete / Close Polls │
  │    └─ Manage Options       └─ Select Option (one per poll)
  ├─> POLLS STORED IN DB
  ├─> SAVE VOTE IN DB (user + poll + option)
  ├─> SHOW “VOTE CONFIRMED”
  ├─> POLL CLOSES (time/admin)
  └─> USER VIEWS RESULTS (static bar chart / list)
```

---

## 🗂️ Database Schema (conceptual)

**Users**

* `_id` (ObjectId)
* `name` (String)
* `email` (String, unique)
* `passwordHash` (String)
* `role` (String: `admin` | `user`)
* `createdAt` (Date)

**Polls**

* `_id` (ObjectId)
* `question` (String)
* `createdBy` (ObjectId -> User)
* `options` ([{ _id, text }])
* `status` (String: `open` | `closed`)
* `closingTime` (Date | null)
* `createdAt` (Date)

**Votes**

* `_id` (ObjectId)
* `pollId` (ObjectId -> Poll)
* `optionId` (ObjectId -> option in Poll)
* `userId` (ObjectId -> User)
* `votedAt` (Date)

> Note: Options can be embedded inside Polls in MongoDB for simplicity.

---

## 🧭 API Overview (suggested endpoints)

**Auth**

* `POST /api/auth/register` — register
* `POST /api/auth/login` — login (returns JWT)

**Polls**

* `GET /api/polls` — list open polls
* `GET /api/polls/:id` — get poll details
* `POST /api/polls` — create poll (admin)
* `PUT /api/polls/:id` — update poll (admin)
* `DELETE /api/polls/:id` — delete poll (admin)
* `POST /api/polls/:id/close` — close poll (admin)

**Votes**

* `POST /api/polls/:id/vote` — cast vote (user) — body: `{ optionId }`
* `GET /api/polls/:id/results` — get voting summary / counts

---

## 🚀 Deployment

* Backend: Deploy to platforms like Heroku, Render, Railway, or DigitalOcean App Platform.
* Database: MongoDB Atlas.
* Frontend: Vercel or Netlify (build from Vite).

---

## 🎥 Preview

Add a demo video (hosted on YouTube) or screenshots in this section.

**Demo video**: *https://drive.google.com/file/d/1sFnSMkAA1-02VMhqY3gVKhNMc-zFVHmV/view?usp=sharing*

**Live preview**: [https://your-deployment-link.com](https://your-deployment-link.com)

---

## 📞 Contact Developer

**Manisha Bhadani**
GitHub: [https://github.com/manisha-bhadani-02/vote_polling](https://github.com/manisha-bhadani-02/vote_polling)

---

---

## 📜 License

Add your preferred license here (MIT recommended).

---
