# 🏠 HomeOrbit — Scalable Rental Service Platform

**HomeOrbit** is a full-stack, scalable rental service platform that enables tenants to search for properties and managers to manage listings efficiently. The platform features multi-role dashboards, secure authentication, real-time workflows, and advanced property search capabilities.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15  
- **Styling:** Tailwind CSS, Shadcn UI  
- **State Management:** Redux Toolkit  
- **Form Handling & Validation:** React Hook Form, Zod  
- **UI Enhancements:** Framer Motion, Radix UI components, Lucide icons  
- **Map & Geo:** Leaflet, Mapbox GL  
- **Authentication:** Clerk (Next.js + Clerk SDK)  
- **File Uploads:** FilePond + Cloudinary plugins  

### Backend
- **Framework:** Node.js, Express.js  
- **Database:** PostgreSQL (via Prisma ORM)  
- **Authentication:** Clerk SDK + JWT for APIs  
- **File Uploads & Media:** Cloudinary  
- **Security:** Helmet, CORS  
- **Logging:** Morgan  
- **Utilities:** Multer for file uploads, Terraformer WKT for geospatial data  

---

## 🗂️ Architecture Overview

HomeOrbit uses a **frontend-backend separated architecture** communicating via REST APIs.

- **Frontend:** Handles rendering, form validations, dashboards, map-based property search, and user interactions.  
- **Backend:** Provides API endpoints for tenants, managers, and admins to manage properties, applications, and approvals.  
- **Authentication:** Managed by Clerk with two-factor authentication support.  
- **Database:** PostgreSQL via Prisma ORM stores users, properties, applications, and system settings.

**High-level Flow:**
1. Tenant or Manager logs in via Clerk.  
2. Tenant searches properties, favorites listings, or applies for residence.  
3. Manager receives applications and approves/rejects them.  
4. Admin oversees all properties, users, and system workflows.  
5. Real-time notifications planned for application status updates.

---

## 🖥️ Features

### Tenant Dashboard
- Browse and favorite properties  
- Apply for residences and track application status  
- Manage account settings  
- Interactive map-based property search with filters  

### Manager Dashboard
- Add, update, and remove properties  
- Approve or reject tenant applications  
- Manage applications and property settings  

### Admin Panel
- Oversee all properties and users  
- Manage application workflows  
- Configure system-level settings  

### Core Features
- Role-based access control (Tenant, Manager, Admin)  
- Two-Factor Authentication (2FA)  
- Map-based property search with filters for location, price, and type  
- File upload support for property images  
- Responsive UI with Framer Motion animations  

---

## 📊 Database Schema (ERD)

The backend uses **Prisma ORM** with PostgreSQL. Entities include:

- **User:** Stores tenant, manager, and admin information  
- **Property:** Contains location, price, images, and metadata  
- **Application:** Links tenant applications to properties and managers  
- **Settings:** Stores user-specific or system-wide configurations  

![ERD](backend/docs/prisma-erd.png)

---

## ⚡ Scripts & Setup

### Frontend
```bash
npm install
npm run dev       # Start frontend development server
npm run build     # Build frontend for production
npm run start     # Start frontend production server
npm run lint      # Run ESLint
```


### Backend
```bash
npm install
npm run dev       # Start backend in development mode
npm run build     # Compile TypeScript backend code
npm run start     # Start backend production server
```


## 📌 Deployment
- **Frontend:** [Vercel Link](your-link)  
- **Backend:** [Render Link](your-link)  
- **Database:** PostgreSQL (Supabase or cloud instance)


## 📂 Repository Structure

### Backend
/backend
  /dist           # Compiled production code
  /doc            # Documentation
  /prisma         # Prisma schema and migrations
  /src
    /controllers  # API logic and controllers
    /middleware   # Middlewares (auth, logging, error handling)
    /routes       # API routes
    /types        # TypeScript type definitions
    index.ts      # Entry point of the backend
  .gitignore
  package.json
  tsconfig.json

### Frontend
/frontend
  /public         # Static assets (images, icons, etc.)
  /src            # Application source code
  /components.json
  package.json
  .gitignore



  ## 🏗️ Future Enhancements
- Smart property recommendations based on tenant behavior  
- Real-time notifications for application updates  
- Analytics dashboards for tenants and managers  
- Payment integration for rent or subscription models  
- Deployment optimizations (Docker, Kubernetes)

