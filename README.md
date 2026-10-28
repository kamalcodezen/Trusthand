
<div align="center">

# TrustHand

### Find skilled local professionals. Book with confidence.

**A Bangladesh-focused platform connecting customers with local service professionals through discovery, booking, reviews, and trust-focused workflows.**

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [API Overview](#api-overview) · [Contributing](#contributing)

</div>

---

## Overview

TrustHand is a full-stack web application designed to make finding and hiring local service professionals easier and more transparent.

Customers can explore worker profiles, submit service requests, and follow their bookings. Workers can manage service-related information, while administrators oversee platform operations.

The project focuses on skilled professionals in Bangladesh, including electricians, plumbers, AC technicians, and other home-service workers.

> **Project Status:** Actively under development. Some AI-assisted workflows and advanced features may still be in progress.

---

## Features

### Customer Features

- Browse and discover skilled local workers
- View worker profiles and service details
- Submit service booking requests
- Track booking progress
- Access a dedicated customer dashboard
- Review completed service experiences

### Worker Features

- Create a worker account
- Manage professional profile information
- Display services and experience
- Manage assigned bookings
- Update job progress
- Access a dedicated worker dashboard

### Admin Features

- Administrative dashboard
- Manage customers and workers
- Review worker verification status
- Monitor bookings and payments
- Manage platform operations

### AI-Powered Assistance

TrustHand is being developed with role-based AI assistance:

- **Trust AI:** General platform guidance and trust-related information
- **Customer AI:** Help with service discovery, bookings, and service questions
- **Worker AI:** Assistance with job-related workflows
- **Admin AI:** Platform insights and operational assistance

AI features are under active development. AI-generated information is advisory and should be reviewed where necessary.

### Bangladesh Location System

- Dynamic Division selection
- District selection based on Division
- Upazila selection based on District
- Backend-based location validation

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React.js, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Motion / Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT-based backend authentication |
| Validation | Zod |
| API | REST API |
| Version Control | Git, GitHub |

---

## Project Structure

```text
Trusthand/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   │
│   │   │   ├── (main)/
│   │   │   └── dashboard/
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── package.json
│   └── next.config.ts
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── scripts/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Getting Started

### Prerequisites

Before running the project, install:

- Node.js 20.9+ (a supported LTS version is recommended)
- npm
- Git
- MongoDB or MongoDB Atlas

### 1. Clone the Repository

```bash
git clone https://github.com/kamalcodezen/Trusthand.git

cd Trusthand
```

### 2. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `backend/`:

```env
NODE_ENV=development
PORT=5000

FRONTEND_URL=http://localhost:3000

MONGODB_URI=mongodb://127.0.0.1:27017/trusthand
MONGODB_DATABASE=trusthand

JWT_SECRET=REPLACE_WITH_A_SECURE_RANDOM_SECRET
```

Use a secret of at least 32 characters.

Seed Bangladesh location data:

```bash
npm run seed:locations
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Health-check endpoint:

```text
GET http://localhost:5000/api/health
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

---

## Available Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/services` | Service information |
| `/find-workers` | Find local professionals |
| `/find-workers/[id]` | Worker details |
| `/login` | Login |
| `/register` | Registration |
| `/dashboard` | Dashboard |
| `/dashboard/customer` | Customer dashboard |
| `/dashboard/worker` | Worker dashboard |
| `/dashboard/admin` | Admin dashboard |

Additional pages and features may be added during development.

---

## API Overview

Base API URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a customer or worker |
| POST | `/auth/login` | User login |
| GET | `/auth/me` | Get authenticated user |

### Locations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/locations/divisions` | Get divisions |
| GET | `/locations/districts?division=Dhaka` | Get districts |
| GET | `/locations/upazilas?division=Dhaka&district=Dhaka` | Get upazilas |

### Workers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/workers` | Discover workers |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Get authorized bookings |
| POST | `/bookings` | Create a booking |

### Administration

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/overview` | Get administrative overview |

For complete and updated API definitions, check:

```text
backend/src/api/
```

---

## Registration Example

```json
{
  "name": "Example Customer",
  "email": "customer@example.com",
  "password": "choose-a-strong-password",
  "phone": "01700000000",
  "role": "customer",
  "division": "Dhaka",
  "district": "Dhaka",
  "upazila": "Savar"
}
```

Supported public registration roles:

```text
customer
worker
```

Administrator accounts should be managed separately.

---

## AI Integration

TrustHand includes AI-oriented backend development for assisting different user roles.

The AI system is intended to provide contextual support for:

1. Service discovery and platform guidance
2. Customer booking assistance
3. Worker job-related support
4. Admin insights and operational workflows

AI-related backend modules are located under:

```text
backend/src/api/
backend/src/services/
```

Actual AI functionality depends on the current implementation, configuration, and external service availability.

AI recommendations are advisory and must not automatically replace human verification or administrative decisions.

---

## Build and Testing

### Frontend Build

```bash
cd frontend

npm run build
```

### Backend Build

```bash
cd backend

npm run build
```

A successful build confirms compilation but does not guarantee that database connections, authentication, or AI integrations work correctly.

Test API-dependent workflows against a running backend.

---

## Git Workflow

TrustHand follows a collaborative Git workflow.

### Create a Feature Branch

```bash
git fetch origin

git switch development

git pull --ff-only origin development

git switch -c feature/your-feature-name
```

### Commit Changes

```bash
git add .

git commit -m "feat: add new functionality"
```

### Push Changes

```bash
git push -u origin feature/your-feature-name
```

### Pull Request

Create a pull request:

```text
feature branch → development
```

Before merging:

- Review all changed files
- Resolve merge conflicts
- Verify frontend and backend builds
- Test affected functionality
- Check environment variables and credentials
- Obtain team review

---

## Security

TrustHand follows backend-based authorization and data validation practices.

Important considerations:

- Never commit `.env` files or private credentials
- Validate user input through the backend
- Restrict sensitive routes using role-based authorization
- Secure authentication tokens and sessions
- Use HTTPS in production
- Protect database credentials
- Review AI-generated recommendations before high-impact decisions

For production, prefer appropriately secured HttpOnly cookie-based sessions rather than storing authentication tokens in browser storage.

---

## Future Improvements

Planned development priorities may include:

- Improved worker verification workflows
- Enhanced booking and quote management
- Role-specific AI assistants
- Better customer-worker communication
- Booking progress notifications
- Improved analytics and reporting
- Performance optimization
- Accessibility improvements
- Additional testing and production security hardening

---

## Contributing

TrustHand is a collaborative development project.

Contributors should follow the existing project structure, coding conventions, and API contracts.

For significant changes, discuss the implementation with the team before creating a pull request.

Repository:

https://github.com/kamalcodezen/Trusthand

Contributors:

https://github.com/kamalcodezen/Trusthand/graphs/contributors

---

## License

No license is specified in this README. Refer to the repository's license file, if one is added, for reuse permissions.

---

<div align="center">

### TrustHand

**Building trust into local services.**

Made with care for the communities of Bangladesh.

</div>
