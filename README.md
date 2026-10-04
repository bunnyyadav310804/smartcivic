# React + Express + MongoDB Starter

This workspace contains a Vite React frontend, an Express backend, Tailwind CSS, and a Mongoose connection layer for MongoDB.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- `server/.env`

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rajashekar
CORS_ORIGIN=http://localhost:5173
```

- `client/.env`

```bash
VITE_API_URL=/api
```

3. Start both apps:

```bash
npm run dev
```

## Apps

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Vercel multi-service deployment

This project is prepared for Vercel using GitHub.

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Create a MongoDB Atlas cluster and database user, then add these environment variables in Vercel under **Project Settings → Environment Variables**. Apply them to Production and Preview (and Development if you use Vercel's local tooling):

```bash
MONGODB_URI=mongodb+srv://<database-user>:<url-encoded-password>@<cluster-host>/smartcivic?retryWrites=true&w=majority
VITE_API_URL=/api
```

Allow network access from Vercel in the Atlas Network Access settings. For a quick setup Atlas commonly uses `0.0.0.0/0`; use a database user with access only to the `smartcivic` database, and never commit the real URI or credentials. If the database password contains special characters, URL-encode it. After adding or changing variables, redeploy so the Vite client is rebuilt and the Express service receives the database URI.

4. Keep the project root as the repository root so Vercel reads the root `vercel.json`.
5. The `client` Vite service receives public paths other than `/api/*`; the `server` Express service receives `/api/*` and keeps the `/api` prefix in Express.
6. These services do not call one another internally: the browser calls the public same-origin `/api` route, so no service binding is needed. Set `MONGODB_URI` in the project environment; do not define a service binding URL manually.
7. If registration returns a database configuration/connection error, check the server service's Vercel Function logs and verify the variable name, Atlas network access, database user, and URI. The API now returns a `503` when MongoDB initialization fails instead of leaving registration pending.

## API

- `GET /api/health`
- `GET /api/sample`
