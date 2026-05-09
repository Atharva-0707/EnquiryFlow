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
| `ng serve` | Start development server |
| `ng build` | Build production bundle |
| `ng build --watch` | Build in watch mode for development |
| `ng test` | Run unit tests using Vitest |


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


## 📷 Screenshots

### Login
<img width="2880" height="1620" alt="image" src="https://github.com/user-attachments/assets/d6a3a46b-2876-47a7-bec1-05f582b0e142" />


### Dashboard
<img width="2878" height="1616" alt="image" src="https://github.com/user-attachments/assets/fe4c164f-499a-4dbf-ab59-be6c1fd0730a" />


### Home
<img width="2880" height="1618" alt="image" src="https://github.com/user-attachments/assets/3bc78235-6e60-4161-84ea-48313e89677c" />
<img width="2880" height="1624" alt="image" src="https://github.com/user-attachments/assets/e4005ef5-a356-4f9a-b0a9-fe9b97b8a246" />


### Enquiry List
<img width="2880" height="1620" alt="image" src="https://github.com/user-attachments/assets/46cffc7d-c152-48dd-ad61-c023fb41c365" />


### Submit Enquiry
<img width="2880" height="1618" alt="image" src="https://github.com/user-attachments/assets/332e1807-6fd7-4300-8ebe-5d43281b5caa" />
<img width="2880" height="1588" alt="image" src="https://github.com/user-attachments/assets/bde39b1b-0085-4849-9f67-1844ad608250" />



---
