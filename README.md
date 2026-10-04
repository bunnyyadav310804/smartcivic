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

## Vercel deployment setup

This project is prepared for Vercel using GitHub.

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add the following environment variables in the Vercel project settings:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smartcivic
VITE_API_URL=/api
```

4. Keep the project root as the repository root.
5. Vercel will serve the Vite frontend and route `/api/*` to the Express API function.

## API

- `GET /api/health`
- `GET /api/sample`
