# Enquiry Management System

A modern Angular-based enquiry management application with a responsive Bootstrap UI, authentication guard, and backend API integration for submitting and tracking customer enquiries.


## 🚀 Project Overview

Enquiry Management System is a single-page web application built with Angular 21 and Bootstrap 5. It allows admins to log in, browse all enquiries in a structured card layout, users to view a styled enquiry dashboard and submit new enquiries.

The app connects to a public REST API for categories, statuses, and submission of enquiry records. It demonstrates modern Angular development practices including standalone components, reactive routing with guards, observables, and service-based architecture.


## ✨ Key Features

- **Login Authentication** — Secure login using localStorage for session management
- **Public Dashboard** — Welcome page with app overview and feature highlights
- **Protected Routes** — Home page and enquiry list secured with auth guards
- **Enquiry Submission** — Comprehensive form with category selection and date picker
- **Enquiry Listing** — View all enquiries in structured card layout with full details
- **Bootstrap 5 UI** — Responsive design with modern styling and animations
- **Font Awesome Icons** — User-friendly visual indicators throughout the app
- **API Integration** — Real-time data sync with backend REST API


## 📄 Pages & Components

| Page | Route | Features | Protected |
|------|-------|----------|-----------|
| **Dashboard** | `/dashboard` | App overview, feature highlights, CTA button | ❌ No |
| **Login** | `/login` | Admin credentials form | ❌ No |
| **Home** | `/home` | Hero section, features, benefits, CTAs | ✅ Yes |
| **Submit Enquiry** | `/submit-enquiry` | Full enquiry form with validation | ❌ No |
| **Enquiry List** | `/enquiry-list` | Cards showing all submitted enquiries | ✅ Yes |


## 🛠️ Technology Stack

- **Frontend Framework:** Angular 21.1.0
- **UI Framework:** Bootstrap 5.3.8
- **Icons:** Font Awesome 4.7.0
- **Language:** TypeScript 5.9.2
- **State Management:** RxJS 7.8.0
- **Routing:** Angular Router with CanActivateFn guards
- **HTTP Client:** Angular HttpClient
- **Forms:** Reactive Forms with Two-way Binding


## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Landing page
│   │   ├── login/          # Authentication page
│   │   ├── home/           # Protected home page
│   │   ├── submit-enquiry/ # Form for new enquiries
│   │   └── enquiry-list/   # Display all enquiries
│   ├── services/
│   │   ├── master-service.ts    # API service
│   │   └── auth.guard.ts        # Route protection
│   ├── model/
│   │   ├── class/               # TypeScript classes
│   │   └── interface/           # TypeScript interfaces
│   ├── app.routes.ts       # Route definitions
│   └── app.ts              # Root component
├── styles.css              # Global styles
└── index.html
```

### Key Services

**MasterService** — Handles all API communication
- `getAllCategory()` — Fetch enquiry categories
- `getAllStatus()` — Fetch enquiry statuses
- `saveEnquiry()` — Submit new enquiry
- `getAllEnquiry()` — Fetch all enquiries

**Auth Guard** — Protects authenticated routes
- Checks localStorage for user session
- Redirects to login if not authenticated


## 🌐 API Integrations

The app connects to [Free Project API](https://freeprojectapi.com/api.html) for all backend operations:

```
GET  /api/Enquiry/get-categories       → Fetch all categories
GET  /api/Enquiry/get-statuses         → Fetch all statuses
POST /api/Enquiry/create-enquiry       → Submit new enquiry
GET  /api/Enquiry/get-enquiries        → Fetch all enquiries
```


## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 21.1.0

### Step 1: Clone the Repository
```bash
git clone <https://github.com/Atharva-0707/Enquiry-Management-System.git>
cd Enquiry-Management-System
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
ng serve
```

The application will open automatically at `http://localhost:4200/`

### Step 4: Login
Use the following test credentials:
- **Username:** `admin`
- **Password:** `admin123`


## 🚀 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (ng serve) |
| `npm run build` | Build production bundle (ng build) |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests using Vitest |


## 📊 Data Models

### IEnquiry Interface
```typescript
interface IEnquiry {
  enquiryId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  categoryId: number;
  statusId: number;
  enquiryType: string;
  isConverted: boolean;
  enquiryDate: string;
  followUpDate: string;
  feedback: string;
}
```

### ICategory & IStatus Interfaces
```typescript
interface ICategory {
  categoryId: string;
  categoryName: string;
  isActive: boolean;
}

interface IStatus {
  statusId: string;
  statusName: string;
  isActive: boolean;
}
```


## 🎨 UI/UX Highlights

- **Dashboard:** Hero section with feature cards and CTA button
- **Login:** Centered form with icons and professional styling
- **Home:** Hero, features showcase, benefits section, and call-to-action
- **Submit Enquiry:** Multi-section form with organized field groups
- **Enquiry List:** Card-based layout displaying all enquiry details


## 👨‍💻 Author

Created by Atharva Srivastava
**GitHub:**   https://github.com/Atharva-0707
**LinkedIn:** https://linkedin.com/in/atharva-srivastava-83073429a 


## 🙌 Acknowledgments

- Bootstrap for responsive UI components
- Font Awesome for beautiful icons
- Free Project API for backend services


---
