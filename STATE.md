# Project State: WILDTRAIL Platform (College FSD Project)

## Current Status
- **Current Phase**: Deployed to Production on Vercel
- **Date**: 2026-11-01
- **Status**: Live in Production, 100% Deployed & Verified

---

## Production Deployment URLs
- **Main Production URL**: [https://wildtrail-fsd-project.vercel.app](https://wildtrail-fsd-project.vercel.app)
- **Deployment URL**: [https://wildtrail-fsd-project-qbrns3tt1-adi3-5611.vercel.app](https://wildtrail-fsd-project-qbrns3tt1-adi3-5611.vercel.app)
- **Deployment Inspector**: [https://vercel.com/adi3-5611/wildtrail-fsd-project/4VvQH3r6g7oRERSLGN5FcGMgxCPc](https://vercel.com/adi3-5611/wildtrail-fsd-project/4VvQH3r6g7oRERSLGN5FcGMgxCPc)
- **Vercel Project Scope**: `adi3-5611`
- **Ready State**: `READY` (HTTP 200)

---

## GitHub Repository
- **URL**: [https://github.com/Adityakumarsinghcoder/wildtrail-fsd-project](https://github.com/Adityakumarsinghcoder/wildtrail-fsd-project)
- **Branch**: `main`
- **Owner**: `Adityakumarsinghcoder`

---

## Architecture & Technology Compliance
- **Frontend**: Clean React 18 (Vite 5) + React Router v6 + native hooks (`useState`, `useEffect`, `useContext`).
- **Styling**: 100% Standard Clean CSS (`App.css`). No PostCSS, Tailwind, or complex build configurations.
- **State Management**: Native React Context (`AuthContext`, `CartContext`) persisted in `localStorage`.
- **Backend API**: Node.js (ES Modules) + Express.js + Mongoose with Vercel serverless functions in `/api`.
- **Catalog**: Embedded instant fallback catalog (`fallbackData.js`) ensuring all 6 expeditions, 6 stays, and 8 gear products render with images, prices, and interactive forms even when cloud database is offline.

---

## Active Local Services
- **Backend API**: Running on port 5000 (`http://localhost:5000/api/v1`).
- **Client Application**: Running on port 5173 (`http://localhost:5173`).
- **Database**: Local desktop MongoDB on port 27017 (`mongodb://127.0.0.1:27017/wildtrail`).

---

## Demo Credentials
- **Admin**: `admin@wildtrail.com` / `Admin@123`
- **User**: `user@wildtrail.com` / `User@123`
