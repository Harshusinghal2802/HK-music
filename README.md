# Resonance — MERN Music Player

A small, complete MERN-stack music player with JWT auth, role-based access
(Admin / User), playlists, and a glassmorphism red+blue dark UI.

The database starts **completely empty**. No seeding. The first time you run
the app, you'll be asked to create the first Admin account directly from the
UI (First Time Setup page). After that, the setup page disables itself
forever.

## Tech Stack
- MongoDB + Mongoose
- Express.js + JWT + Multer
- React (Vite) + Tailwind CSS
- Axios + Context API (no Redux/React Query)

## Project Structure
```
mern-music-player/
  server/   -> Express API, MongoDB models, JWT auth, file uploads
  client/   -> React (Vite) frontend, Tailwind UI
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## 1. Backend Setup

```bash
cd server
npm install
```

Check `server/.env` (already included with sensible defaults):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/music_player
JWT_SECRET=super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```
Update `MONGO_URI` if you're using MongoDB Atlas or a different host. Change
`JWT_SECRET` to your own random string before deploying.

Start the backend:
```bash
npm run dev
```
The API runs on `http://localhost:5000`.

## 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
The app runs on `http://localhost:5173`.

## 3. First Run

1. Open `http://localhost:5173`.
2. Since the database is empty, you'll land on the **First Time Setup**
   page automatically.
3. Create the first Admin account (name, email, password).
4. You're now logged in as Admin. Go to **Admin Panel** to upload your first
   songs (MP3 + optional cover image).
5. Any other visitor can **Register** as a normal User to browse, search,
   play songs, and build personal playlists.

There is no seed script and no predefined data — everything is created from
the UI, by design.

## Roles

**Admin**
- Upload / edit / delete songs
- Manage all songs in the library
- View Admin Dashboard (total songs, users, playlists)
- Create / rename / delete playlists (including any user's, for moderation)

**User**
- Browse, search, and filter the library
- Play / pause / stop / next / previous / seek / volume / shuffle / repeat
- Create personal playlists, add/remove songs
- Rename / delete only their own playlists
- View their own Dashboard (their playlists + recently played)

Admin-only UI (Upload, Add/Edit/Delete buttons, Admin Panel link) is
completely hidden from normal users — not just disabled.

## Notes
- Uploaded audio/cover files are stored on disk under `server/uploads/` and
  served statically at `/uploads/...`.
- JWT tokens are stored in `localStorage` on the client and attached via an
  Axios interceptor.
