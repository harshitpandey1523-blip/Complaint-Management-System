# ResolvX — E-Commerce Complaint Management System

ResolvX is a frictionless, premium e-commerce complaint management system designed to track, resolve, and analyze customer issues in real-time. Built as a monorepo, it features a Next.js frontend with integrated API routes and an optional standalone Hono backend.

---

## 📁 Repository Structure

This project is organized as a **monorepo**:

*   **[`complaint-mgmt/`](file:///Users/harshitpandey/Web/complaint-mgmt)**: Next.js 16 (App Router + Turbopack) frontend dashboard and user interface. It contains self-contained Next.js serverless API routes that connect directly to the database.
*   **[`complaint-backend/`](file:///Users/harshitpandey/Web/complaint-backend)**: An optional, standalone backend API server built with Hono and Node.js.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, Next.js 16 (Turbopack), Tailwind CSS, Lucide icons.
*   **Backend**: Hono, Node.js.
*   **Database ORM**: Prisma v7.8.0.
*   **Database Engine**: PostgreSQL (configured via the `@prisma/adapter-pg` driver pool).
*   **Charts & Visuals**: Recharts (rich KPI visualization).

---

## ✨ Features

*   **Interactive Dashboard**: Real-time analytical widgets tracking open tickets, average resolution hours, SLA breaches, ticket volume trends (last 7 days), category pie charts, and priority distributions.
*   **Complaint Management**: Creation of complaints with order IDs, priority levels (Low, Medium, High, Urgent), and specific issue categories.
*   **Unified Timeline & Messaging**: Customer chat history integrated with private, agent-only internal notes.
*   **Role-Based Interface Access**: Interactive switcher to toggle views between **Admin**, **Agent**, and **Customer** perspectives to test user experiences.
*   **Premium Dark Theme**: Harmanious oklch dark aesthetic with glassmorphic overlays.

---

## 🚀 Local Development Setup

To run this application locally, you will need a running **PostgreSQL** instance (e.g. from Supabase, Neon, or a local server).

### 1. Database Setup

1.  Create a PostgreSQL database and obtain the connection string.
2.  Create `.env` files in both project folders containing the database connection URL:

    **`complaint-mgmt/.env`** & **`complaint-backend/.env`**:
    ```env
    DATABASE_URL="your-postgresql-connection-string"
    ```

3.  Generate the database schema and seed mock data:
    ```bash
    cd complaint-mgmt
    npx prisma db push
    npx tsx prisma/seed.ts
    ```
    *This populates your database with 8 standard users, 19 realistic e-commerce complaints, and 17 timeline comments.*

### 2. Start the Applications

Open two terminal tabs to run both services:

#### Tab A: Start the Next.js Frontend
```bash
cd complaint-mgmt
npm run dev
```
*The app will be accessible at [http://localhost:3000](http://localhost:3000).*

#### Tab B: Start the Standalone Hono Backend (Optional)
```bash
cd complaint-backend
npm run start
```
*The API server will run at [http://localhost:4000](http://localhost:4000).*
