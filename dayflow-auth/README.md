# Dayflow — Login & Register pages

This is a self-contained slice of the Dayflow frontend: just the
authentication flow (Login + Register), wired up to real Context API
state and Axios services, so it runs standalone for preview and drops
straight into the full `Dayflow/frontend/` project later.

## What's included

```
src/
├── pages/
│   ├── auth/
│   │   ├── Login.jsx        ← Sign-in page
│   │   └── Register.jsx     ← Company sign-up page
│   └── DashboardPlaceholder.jsx   (stands in for the real dashboards)
├── context/
│   └── AuthContext.jsx      ← login / register / logout / persistent session
├── services/
│   ├── api.js                ← shared Axios instance (attaches JWT, handles 401s)
│   └── authService.js        ← calls /api/auth/login, /register, /me, /logout
├── components/
│   └── ProtectedRoute.jsx    ← redirects to /login if no user is logged in
├── App.jsx
├── main.jsx
└── index.css
```

Design notes: the brand panel uses a "sunrise" palette (`ink` → `dusk`
→ `coral` → `gold`) and greets the person differently depending on the
time of day — a nod to Dayflow being a daily check-in / attendance
tool. Display type is **Sora**, body text is **Inter**, and employee
IDs/roles use **IBM Plex Mono**. All colors/fonts are defined as
Tailwind tokens in `tailwind.config.js`.

## Run it standalone

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 — you'll land on `/login`.

Without a backend running, submitting the form will show the "didn't
match" error (the request fails), which is expected. Point
`VITE_API_URL` in `.env` at your running Dayflow backend
(`http://localhost:5000/api` by default) to log in for real.

## Dropping this into the full Dayflow project

Copy the contents of `src/` into `Dayflow/frontend/src/`, merging
folders that already exist (e.g. add `Login.jsx`/`Register.jsx` into
your existing `pages/auth/` folder). Then in your main `App.jsx`, add:

```jsx
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

Make sure `AuthProvider` (from `context/AuthContext.jsx`) wraps your
router in `main.jsx`, as shown here.

## Expected backend contract

These pages assume the backend from the main spec:

- `POST /api/auth/login` — body `{ loginId, password }`, returns `{ token, user }`. `loginId` can be an employee ID (`OT-JODO-2023-0001`) or an email.
- `POST /api/auth/register` — multipart form with `companyName, firstName, lastName, email, phone, password, companyLogo?`, returns `{ token, user }`.
- `GET /api/auth/me` — returns `{ user }` for the current token.
- `POST /api/auth/logout` — invalidates the session server-side if applicable.

`user.role` is expected to be one of `ADMIN`, `HR`, or `EMPLOYEE`.
