# vote_polling
A web application that allows users to participate in polls created by an admin.  Admins can create multiple-choice polls, and users can vote once per poll. After the poll  closes, users can view the results as a static summary chart. This app should help  understand full CRUD cycles, user-role-based access, and clean API design.
🚀 Project Overview

This project provides a secure and responsive voting system where users can register, vote, and view results instantly. Admins can create polls, manage options, and track voting analytics efficiently.

⚙️ Project Setup & Installation
Prerequisites
Node.js 
npm
MongoDB 

🧰 Technology Stack
Category	Technology
Frontend	React.js, Tailwind CSS, Vite
Backend	Node.js, Express.js
Database	MongoDB 
Authentication	JWT (JSON Web Tokens)
Version Control	 GitHub

🧠 Why These Technologies?
React + Vite: Fast rendering and optimized development environment.
Tailwind CSS: For responsive and elegant UI.
Node.js + Express: Lightweight and efficient backend handling.
MongoDB: Schema-less, flexible data storage suitable for polling systems.
JWT: Secure and scalable authentication mechanism.

⭐ Key Features
🧾 User Roles: Admin & User functionalities.
🗳️ Create and Manage Polls: Admins can add, edit, and delete polls.
👥 Vote Once: Each user can cast only one vote per poll.
📈 Real-Time Results: View live voting statistics.
🔐 JWT Authentication: Secure user login and registration.
🌐 Responsive UI: Works smoothly across devices.

🧩 2️⃣ System Components
 ┌────────────────────────────────────────┐
 │          POLL & VOTING SYSTEM          │
 └────────────────────────────────────────┘
             ▲                     ▲
             │                     │
      [Admin Role]           [User Role]

 ⚙️ 3️⃣ Workflow Diagram
                 ┌──────────────────────────────┐
                 │        START APP             │
                 └──────────────┬───────────────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │  USER REGISTRATION │
                     │   & LOGIN (JWT)    │
                     └─────────┬──────────┘
                               │
             ┌────────────────┴─────────────────┐
             │                                  │
             ▼                                  ▼
     ┌────────────────────┐            ┌────────────────────┐
     │   ADMIN DASHBOARD   │            │    USER DASHBOARD  │
     └─────────┬───────────┘            └─────────┬──────────┘
               │                                    │
       ┌───────┴──────────┐                        │
       │ Create / Edit /   │                        │
       │ Delete / Close    │                        │
       │ Polls             │                        │
       └───────┬───────────┘                        │
               │                                    │
               ▼                                    ▼
     ┌────────────────────┐            ┌──────────────────────────────┐
     │ POLLS STORED IN DB │<-----------│   VIEW OPEN POLLS (from DB)  │
     └────────────────────┘            └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                         ┌────────────────────────┐
                                         │  USER SELECTS OPTION   │
                                         │ (only one per poll)    │
                                         └──────────┬─────────────┘
                                                    │
                                                    ▼
                                         ┌────────────────────────┐
                                         │  SAVE VOTE IN DATABASE │
                                         │  (User + Poll + Option)│
                                         └──────────┬─────────────┘
                                                    │
                                                    ▼
                                         ┌────────────────────────┐
                                         │  SHOW “VOTE CONFIRMED” │
                                         └──────────┬─────────────┘
                                                    │
                                                    ▼
                                         ┌────────────────────────┐
                                         │ POLL CLOSES (time/admin)│
                                         └──────────┬─────────────┘
                                                    │
                                                    ▼
                                         ┌────────────────────────┐
                                         │  USER VIEWS RESULTS    │
                                         │ (Static Bar Chart/List)│
                                         └────────────────────────┘
🧠 4️⃣ Database Flow
┌─────────────┐        ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   USERS     │        │    POLLS     │        │   OPTIONS     │        │    VOTES     │
├─────────────┤        ├──────────────┤        ├──────────────┤        ├──────────────┤
│ user_id (PK)│ 1    n │ poll_id (PK) │ 1    n │ option_id (PK)│  n  1 │ vote_id (PK) │
│ name        │◄──────►│ created_by(FK)│◄──────► poll_id (FK)  │◄──────► poll_id (FK) │
│ email       │        │ question     │        │ option_text   │        │ user_id (FK) │
│ password    │        │ closing_time │        │               │        │ option_id(FK)│
│ role        │        │ status       │        │               │        │ voted_at     │
└─────────────┘        └──────────────┘        └──────────────┘        └──────────────┘
🎥 Preview
Add demo video  here:
Video Link
Live Preview

📞 Contact
Developer: Manisha Bhadani
GitHub: https://github.com/manisha-bhadani-02/vote_polling
Deployment Link: https://your-deployment-link.com

💡 This project aims to enhance transparency and encourage digital voting participation through an efficient and user-friendly web platform.
                                         
