# KothaKhoj

**Find rooms and flats for rent in Nepal.** Owners post rooms, people search and send inquiries, owners accept or reject them, and an admin manages everything.

A full-stack web app built with the **MERN stack**: MongoDB, Express, React and Node.js.

<!-- Add screenshots here, e.g. ![Home page](screenshots/home.png) -->

## Features

**Everyone**
- Browse available rooms as cards with photo, type, location and rent
- Search by location, room type and rent range, sort by newest or rent
- Room details page with owner name (phone and email are shown only to logged-in users, so contacts can't be collected by anyone)

**Logged-in users**
- Register and login (passwords hashed with bcrypt, login with JWT)
- Post, edit and delete own rooms, mark a room available / not available
- Send an inquiry about someone else's room
- Inquiries page: **Received** (accept / reject) and **Sent** (see status, delete). The owner's phone is shown once an inquiry is accepted
- Profile page: update name and phone, change password

**Admin**
- Dashboard with totals for users, rooms and inquiries
- See and delete any user, room or inquiry. Deleting a user also deletes their rooms and inquiries

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19 (Vite), React Router, Axios, React Toastify, plain CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | bcrypt (password hashing), JSON Web Token (login) |
| Config | dotenv (`.env` files) |

## Project structure

```
kotha-khoj/
  backend/
    index.js                 express app, routes, error handling
    seedAdmin.js             creates the admin account
    seedDemo.js              adds sample data
    src/
      constant.js            reads values from .env
      connectToDb.js
      schema/                User, Room, Inquiry (Mongoose models)
      routes/                userRoute, roomRoute, inquiryRoute
      middleware/            isAuthenticated, isAuthorized, checkId
  frontend/
    src/
      App.jsx                keeps logged-in user, navbar, routes, footer
      KothaRoute.jsx         all pages
      auth.js                token in localStorage, logout on expired session
      User/  Room/  Inquiry/  Admin/
```

## Run locally

You need **Node.js** (v20 or newer) and **MongoDB** running on `localhost:27017`.

**1. Backend**

```
cd backend
cp .env.example .env      # then change SECRET_KEY to a long random text
npm install
npm run seed:admin        # creates the admin account from .env
npm run seed:demo         # optional: adds sample users, rooms and inquiries
npm run dev               # http://localhost:8000
```

**2. Frontend** (in a second terminal)

```
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

### Login accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@kothakhoj.com` | `Admin@123` (set in `backend/.env`) |
| Demo owner | `hari@demo.com`, `sita@demo.com` | `demo123` |
| Demo user | `ram@demo.com` | `demo123` |

Demo accounts exist only after `npm run seed:demo`.

## Environment variables

**backend/.env**

| Name | Example | Used for |
|---|---|---|
| `PORT` | `8000` | port of the API |
| `DB_URL` | `mongodb://localhost:27017/kothakhoj` | MongoDB connection |
| `SECRET_KEY` | long random text | signing JWT tokens |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PHONE` | | used by `npm run seed:admin` |

**frontend/.env**

| Name | Example | Used for |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | backend URL |

## API

Routes marked 🔒 need the header `Authorization: Bearer <token>` (token comes from login).

**User** `/user`

| Method | Route | Who | Does |
|---|---|---|---|
| POST | `/user/register` | anyone | create account |
| POST | `/user/login` | anyone | get token |
| GET | `/user/my-profile` | 🔒 user | read own profile |
| PATCH | `/user/my-profile` | 🔒 user | update name, phone |
| PATCH | `/user/change-password` | 🔒 user | change password |
| GET | `/user` | 🔒 admin | all users |
| GET | `/user/:id` | 🔒 admin | one user |
| DELETE | `/user/:id` | 🔒 admin | delete user and their rooms and inquiries |

**Room** `/room`

| Method | Route | Who | Does |
|---|---|---|---|
| POST | `/room` | 🔒 user | create room |
| GET | `/room` | anyone | available rooms. Query: `location`, `roomType`, `minRent`, `maxRent`, `sort` (`rent` or `-rent`) |
| GET | `/room/my-rooms` | 🔒 user | own rooms |
| GET | `/room/all` | 🔒 admin | all rooms |
| GET | `/room/:id` | anyone | one room. Owner phone and email only if a token is sent |
| PATCH | `/room/:id` | 🔒 owner / admin | update room |
| DELETE | `/room/:id` | 🔒 owner / admin | delete room and its inquiries |

**Inquiry** `/inquiry`

| Method | Route | Who | Does |
|---|---|---|---|
| POST | `/inquiry` | 🔒 user | send inquiry (`room`, `message`, `phone`) |
| GET | `/inquiry/sent` | 🔒 user | inquiries I sent |
| GET | `/inquiry/received` | 🔒 user | inquiries on my rooms |
| GET | `/inquiry/all` | 🔒 admin | all inquiries |
| PATCH | `/inquiry/:id` | 🔒 room owner | set `status`: `accepted` or `rejected` |
| DELETE | `/inquiry/:id` | 🔒 sender / admin | delete inquiry |

Every response looks like `{ "success": true, "message": "...", "result": ... }`.
