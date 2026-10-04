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
3. Add the following environment variables in the Vercel project settings:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartcivic
VITE_API_URL=/api
```

4. Keep the project root as the repository root so Vercel reads the root `vercel.json`.
5. The `client` Vite service receives public paths other than `/api/*`; the `server` Express service receives `/api/*` and keeps the `/api` prefix in Express.
6. These services do not call one another internally: the browser calls the public same-origin `/api` route, so no service binding is needed. Set `MONGODB_URI` in the project environment; do not define a service binding URL manually.

## API

- `GET /api/health`
- `GET /api/sample`
