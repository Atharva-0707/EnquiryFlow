# 💼 EnquiryFlow — Enterprise MEAN Stack Enquiry Management System

> A production-ready, full-stack **MEAN** (MongoDB, Express.js, Angular 21, Node.js) Customer Relationship & Enquiry Management Application featuring secure JWT authentication, role-based access control (RBAC), real-time database-driven analytics, and reactive CRM operations.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Full-Stack Architecture](#-full-stack-architecture)
5. [Prerequisites & Environment Configuration](#-prerequisites--environment-configuration)
6. [Quick Start & Local Setup](#-quick-start--local-setup)
7. [Database Seeding](#-database-seeding)
8. [Demo Credentials & Roles](#-demo-credentials--roles)
9. [REST API Documentation](#-rest-api-documentation)
10. [Angular Architecture & Best Practices](#-angular-architecture--best-practices)
11. [Security Implementations](#-security-implementations)
12. [Postman API Collection](#-postman-api-collection)
13. [Production Deployment Guide](#-production-deployment-guide)

---

## 🚀 Project Overview

**EnquiryFlow** is a modern, enterprise CRM application engineered to streamline the intake, tracking, assignment, and resolution of customer inquiries. 

Previously dependent on a third-party mock API, the entire platform has been converted into an autonomous **full-stack MEAN application**:
- **MongoDB + Mongoose**: Cloud database persistence with structured schemas, validations, and aggregation pipelines.
- **Express.js + Node.js**: Scalable REST API with JWT authentication, role-based access control, security middleware (Helmet, CORS, Rate Limiting), and centralized error handling.
- **Angular 21**: High-performance frontend utilizing standalone components, reactive forms, functional HTTP interceptors (`Bearer` token injection), route guards, and toast notifications.

---

## ✨ Key Features

- 🔐 **Real JWT Authentication** — Secure login generating signed JSON Web Tokens; unauthenticated requests are rejected with HTTP 401.
- 🛡️ **Role-Based Authorization (RBAC)** — Distinct permissions for **Admin** (full CRUD, category/status management, record deletion) and **Employee** (view, submit, and update enquiries).
- 📊 **Real Database Analytics** — Dashboard metrics computed on-the-fly via MongoDB aggregation pipelines (total, new, in-progress, converted, closed, conversion rate).
- 📝 **Complete Enquiry Lifecycle (CRUD)** — Submit new inquiries, search and filter across customer details, update status/follow-up notes via responsive modals, and delete records with confirmation safeguards.
- 🏷️ **Dynamic Categories & Statuses** — Relational references connecting enquiries to MongoDB `Category` and `Status` collections.
- ⚡ **Angular Functional HTTP Interceptor** — Automatically attaches `Authorization: Bearer <token>` to protected API requests and intercepts 401 Unauthorized responses.
- 🔔 **Reactive Toast Notification System** — Instant user feedback for submissions, edits, deletions, and network errors without browser alerts.
- 📱 **Mobile-First Responsive Design** — Clean Bootstrap 5 UI, offcanvas navigation, glassmorphism stat cards, and accessible forms.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | Angular 21.1 | Standalone components, TypeScript 5.9, Vite dev engine |
| **Styling** | Bootstrap 5.3 & Icons | Responsive grid, utility classes, Bootstrap Icons |
| **Reactive State** | RxJS 7.8 | Observables, BehaviorSubjects, Subscriptions |
| **Backend** | Node.js & Express.js 4.21 | RESTful controllers, modular routes, middleware |
| **Database** | MongoDB & Mongoose 8.9 | Schemas, ObjectId references, aggregation, indexes |
| **Security** | JWT, bcryptjs, Helmet, CORS | Password hashing (salt rounds: 10), token verification, rate limiting |
| **Dev Tooling** | Concurrently, Nodemon, Vitest | Unified development workflows and unit testing |

---

## 🏗️ Full-Stack Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Angular 21 Client                    │
│            (Standalone Components & Services)          │
└──────────────────────────┬─────────────────────────────┘
                           │
                 HTTP Request with JWT
            (Angular AuthHttpInterceptor)
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  Express.js / Node.js                  │
│  - Helmet & CORS Middleware                            │
│  - Rate Limiter (Auth endpoints)                       │
│  - Authentication Middleware (JWT Protect)             │
│  - Role Authorization Middleware (authorizeRoles)      │
│  - Input Validation (validationMiddleware)             │
│  - Controllers & Business Logic                        │
│  - Centralized Error Handler (errorMiddleware)         │
└──────────────────────────┬─────────────────────────────┘
                           │
                   Mongoose ODM Queries
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│  - Users Collection (hashed passwords, roles)          │
│  - Enquiries Collection (friendly code, refs)          │
│  - Categories Collection (lookup)                      │
│  - Statuses Collection (lifecycle stages)              │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Prerequisites & Environment Configuration

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A free MongoDB Atlas cluster connection string (or a local MongoDB instance running on `mongodb://localhost:27017/enquiry_db`).

### Backend Environment Configuration
Inside the `backend/` directory, a `.env` file is prepared. Simply configure your MongoDB connection string:

```env
# Server Port (Default 5001 avoids macOS AirPlay collision on 5000)
PORT=5001

# MongoDB Connection String (Replace with your MongoDB Atlas or local URI)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yourdomain.mongodb.net/enquiry_management?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=super_secret_jwt_key_enquiry_flow_2026_production

# Frontend Client URL for CORS
CLIENT_URL=http://localhost:4200
```

> **Note:** The backend contains built-in graceful offline fallback detection if the MongoDB URI is still a placeholder, allowing the frontend and API server to start and display clear connection notices.

---

## 🚀 Quick Start & Local Setup

### 1. Install All Dependencies
From the project root:
```bash
# Installs root, frontend, and backend packages in one step
npm run install:all
```

Or install separately:
```bash
npm install
cd backend && npm install && cd ..
```

### 2. Populate the Database (Seeding)
Once your `MONGODB_URI` is entered in `backend/.env`, populate the initial database with demo users, categories, statuses, and sample enquiries:
```bash
npm run seed
```

### 3. Start the Full Application
To run both the **Angular Frontend** (port `4200`) and the **Express Backend** (port `5001`) concurrently:
```bash
npm run dev
```

Alternatively, run each service in separate terminals:
- **Terminal 1 (Backend):**
  ```bash
  npm run dev:backend
  # Express API runs at: http://localhost:5001
  ```
- **Terminal 2 (Frontend):**
  ```bash
  ng serve
  # Angular UI runs at: http://localhost:4200
  ```

---

## 👥 Demo Credentials & Roles

The seed script initializes two preconfigured accounts with hashed passwords:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@example.com` | `admin123` | Full access: View, create, update, delete enquiries, manage categories & statuses, view stats |
| **Employee** | `employee@example.com` | `employee123` | Operational access: View enquiries, submit new enquiries, update enquiries, view dashboard |

---

## 📡 REST API Documentation

Base URL: `http://localhost:5001/api` (proxied in Angular development via `/api`)

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user, returns JWT and user profile |
| `GET` | `/api/auth/me` | Protected | Get current authenticated user profile |
| `POST` | `/api/auth/register` | Public | Register a new user account (Employee or Admin) |

### 2. Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Public | Real-time counts (total, new, in-progress, converted, closed, conversion rate) calculated directly in MongoDB |

### 3. Enquiries (`/api/enquiries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/enquiries` | Protected | Fetch paginated enquiries with `?search=`, `?category=`, `?status=` |
| `GET` | `/api/enquiries/:id` | Protected | Retrieve single enquiry by MongoDB ObjectId |
| `POST` | `/api/enquiries` | Protected | Create a new enquiry (attaches `createdBy`) |
| `PUT` | `/api/enquiries/:id` | Protected | Update enquiry details, status, or follow-up |
| `DELETE`| `/api/enquiries/:id` | Admin Only | Delete an enquiry record from MongoDB |

### 4. Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all active categories |
| `POST` | `/api/categories` | Admin Only | Create new enquiry category |
| `PUT` | `/api/categories/:id`| Admin Only | Update category name / status |
| `DELETE`| `/api/categories/:id`| Admin Only | Remove category |

### 5. Statuses (`/api/statuses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/statuses` | Public | List all active lifecycle statuses |
| `POST` | `/api/statuses` | Admin Only | Create new status stage |
| `PUT` | `/api/statuses/:id` | Admin Only | Update status stage |
| `DELETE`| `/api/statuses/:id` | Admin Only | Remove status stage |

---

## 🅰️ Angular Architecture & Best Practices

- **Angular 21 Standalone Components**: Modern architecture without NgModule overhead.
- **Dependency Injection**: Services injected cleanly using `inject(MasterService)` and constructor DI.
- **HTTP Interceptor**: Functional `authInterceptor` configured in `app.config.ts`:
  ```typescript
  export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next(req);
  };
  ```
- **Type Safety**: Strongly-typed interfaces defined in `master.Model.ts` (`IEnquiry`, `IUser`, `ICategory`, `IStatus`, `IDashboardStats`, `IApiResponse`).
- **Reactive Notifications**: `ToastService` using RxJS `Subject` for real-time non-blocking alerts.
- **Development Proxy**: `proxy.conf.json` maps frontend `/api` calls directly to the Express server at `http://localhost:5001`.

---

## 🔒 Security Implementations

1. **Password Hashing**: `bcryptjs` with salt round 10 before saving to MongoDB. Plain-text passwords are never stored.
2. **JWT Authentication**: Short-to-medium lifespan JSON Web Tokens containing safe payload claims (`id`, `role`, `email`).
3. **Helmet**: Sets critical HTTP security headers preventing XSS, clickjacking, and MIME-type sniffing.
4. **CORS Restrictions**: Configured to only allow requests from the designated client origin (`CLIENT_URL`).
5. **Rate Limiting**: Protects `/api/auth/login` against brute-force attacks (limit of 20 attempts per 15 minutes).
6. **Backend Data Validation**: All incoming requests are validated server-side independently of client-side validation.
7. **Protected Errors**: Centralized error middleware ensures stack traces are never exposed in production responses.

---

## 📮 Postman API Collection

A complete Postman v2.1 collection file is provided at:
```text
backend/postman_collection.json
```
**To test the API with Postman:**
1. Open Postman.
2. Click **Import** and select `backend/postman_collection.json`.
3. Run the **Login** request — the test script automatically captures the returned JWT token into the collection's `{{authToken}}` variable.
4. Execute any of the CRUD and analytics requests with authorization automatically applied!

---

## 🚢 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Database User with read/write access.
3. In **Network Access**, allow access from anywhere (`0.0.0.0/0`) or whitelist your Render backend IP.
4. Copy the connection string and paste it into your production backend environment variable `MONGODB_URI`.

### 2. Backend (Render / Railway / AWS)
1. Deploy the `backend/` directory as a Node web service.
2. Set Build Command: `npm install`
3. Set Start Command: `node server.js`
4. Set Environment Variables:
   - `PORT`: `5001` (or leave default for cloud provider)
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<A strong random secret>`
   - `CLIENT_URL`: `<Your Vercel frontend URL>`

### 3. Frontend (Vercel)
1. Deploy the root directory to [Vercel](https://vercel.com).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist/Enquiry-Management-System`
4. In `src/environments/environment.prod.ts`, set `apiBaseUrl` to your deployed Render backend URL:
   ```typescript
   export const environment = {
     production: true,
     apiBaseUrl: 'https://your-backend-app.onrender.com/api'
   };
   ```

---

## 🧪 Testing

Run frontend unit tests (Vitest):
```bash
npm test -- --watch=false
```

Run Angular production build verification:
```bash
npm run build
```

---

## 👨‍💻 Author & Attribution

**Atharva Srivastava**  
Full-Stack MEAN Developer  
Portfolio Project demonstrating enterprise full-stack design patterns with Angular 21, Express.js, and MongoDB.
