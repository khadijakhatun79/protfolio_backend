# Portfolio Backend API

A professional, standardized backend for a personal or agency portfolio. This project is built with Node.js, Express, and MongoDB, featuring a clean architecture inspired by SaaS-grade systems.

## 🚀 Features

- **Public Access**: All endpoints are public and require no authentication, making it perfect for direct frontend integration.
- **Service Management**: CRUD operations for managing professional services offered.
- **Project Showcase**: CRUD operations for managing portfolio projects, including technology stacks and links.
- **Portfolio Form Submissions**: Lead generation and contact form handling.
- **Advanced Querying**: Integrated support for filtering, searching, and pagination.
- **Transaction Support**: Critical database operations are wrapped in Mongoose sessions/transactions for data integrity.
- **Standardized API**: JSend-style consistent response format.

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Utilities**: 
  - `http-status`: Standardized HTTP status codes.
  - `cors`: Permissive Cross-Origin Resource Sharing.
  - `helmet` & `xss-clean`: Basic security headers and sanitization.
  - `moment-timezone`: Date and time handling.

## 📋 API Documentation

All API endpoints are prefixed with `/api`.

### 1. Services Module
Manage the services displayed on your portfolio.
- `GET /api/services`: List all services (Supports pagination & filtering).
- `POST /api/services`: Create a new service.
- `GET /api/services/:id`: Get service details.
- `PATCH /api/services/:id`: Update a service.
- `DELETE /api/services/:id`: Delete a service.

### 2. Projects Module
Showcase your best work.
- `GET /api/projects`: List all projects (Supports pagination & filtering).
- `POST /api/projects`: Create a new project.
- `GET /api/projects/:id`: Get project details.
- `PATCH /api/projects/:id`: Update a project.
- `DELETE /api/projects/:id`: Delete a project.

### 3. Portfolio Submissions
Handle contact form submissions.
- `POST /api/portfolio`: Submit a contact form.
- `GET /api/portfolio`: List all submissions (Admin view).
- `GET /api/portfolio/:id`: Get submission details.
- `DELETE /api/portfolio/:id`: Delete a submission.

---

## 📊 Standardized Response Format

All responses follow this structure:

```json
{
  "status": "success",
  "data": {
    "data": [...],
    "metaData": {
      "page": 1,
      "totalPages": 5,
      "perPage": 10,
      "total": 48
    }
  },
  "message": "Operation successful"
}
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Atlas or Local)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   ATLAS_URI=your_mongodb_connection_string
   PORT=4000
   ```

### Running the App
- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

## 📁 Project Structure

```text
src/
├── app/
│   ├── modules/          # Business logic separated by domain
│   │   ├── portfolio/    # Contact form submissions
│   │   ├── service/      # Professional services
│   │   └── project/      # Portfolio projects
│   ├── routes/           # Main route index
│   └── middleware/       # Shared middleware
├── config/               # DB and app configuration
├── utils/                # Shared utility functions (ApiError, catchAsync, etc.)
├── app.js                # Express app initialization
└── index.js              # Server entry point
```

## 📝 License
This project is for educational/personal use.
