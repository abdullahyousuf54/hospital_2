# 🏥 Hospital Patient Management System (MERN)

This project now runs as a **single deployable service** on Render:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React app built from `client/` and served by Express in production

## 📁 Project Structure

```text
hospital_2/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   └── services/
│   │       └── authService.js
│   └── package.json
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
└── package.json
```

## ⚙️ Root Scripts

```bash
npm run build   # cd client && npm install && npm run build
npm start       # node server.js
```

## 🚀 Local Development

### 1) Backend
```bash
npm install
npm run dev
```

### 2) Frontend (optional local dev server)
```bash
cd client
npm install
npm start
```

## 🏗️ Production Build

```bash
cd client
npm install
npm run build
```

This generates:

```text
client/build/
```

In production, Express serves these static assets and uses a fallback route for React Router.

## 🌐 Render Deployment (Single Web Service)

1. Push this repo to GitHub.
2. In Render, create/update a **Web Service** pointing to this repo.
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
   - (Optional) `PORT` is provided by Render automatically.
5. Deploy.

After deploy:
- `https://your-render-url/` loads the React frontend.
- `https://your-render-url/login` and `/signup` work via React Router fallback.
- API routes still work (for example `POST /auth/login`, `POST /auth/signup`, `GET /api/patients`).

## ✅ API Endpoints (unchanged)

- `POST /auth/signup`
- `POST /auth/login`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/health`
