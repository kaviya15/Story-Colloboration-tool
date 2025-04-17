# 📚 Plotline — Collaborative Story Creation Tool

Plotline is a full-stack web application that enables users to collaboratively create, edit, and explore stories in real time. It supports live editing, structured snapshots, and user notifications — making storytelling an immersive and interactive experience.

---

## 🌟 Key Features

- ✍️ **Live Collaborative Editing** — Only one user can edit a story at a time, others can view it in real-time.
- 🔒 **Story Locking & Notification** — Users can click “Notify” if a story is locked; they'll be notified when it becomes editable again.
- 📌 **Snapshots** — Add important moments in the story with custom descriptions and relevant links (e.g., articles, images).
- 🕓 **Central Log System** — Tracks all edits and views along with user information and timestamps.
- 🔍 **Tagging System** — Add contextual tags to organize and categorize stories.

---

## ⚙️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js (MVC Architecture)
- **Real-Time Communication:** Socket.io
- **Database:** MongoDB Atlas
- **Caching / Lock Control:** Redis

---

# to run
npm install
npm run dev     # Runs using nodemon (for development)
npm start       # Runs server normally