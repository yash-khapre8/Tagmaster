# TagMaster - Real-Time Collaborative Data Annotation Platform

A full-stack MERN application for collaborative data annotation with real-time synchronization, conflict resolution, and role-based access control.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node](https://img.shields.io/badge/Node-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

---

## 🎯 Overview

TagMaster is a real-time collaborative data annotation platform designed for machine learning teams. It enables multiple annotators to work on the same dataset simultaneously with instant synchronization, intelligent conflict resolution, and comprehensive task management.

**Built for**: B.Tech CSE Semester III - React.js + Node.js Case Study

---

## 🚨 Problem Statement

### Context
Machine learning teams often require multiple human workers to simultaneously annotate (tag) large datasets (images, text) for training. Existing tools lack:
- Seamless real-time collaboration
- Conflict resolution when multiple taggers work on the same asset
- Efficient task assignment and tracking

### Our Solution: TagMaster
A real-time collaborative platform that:
- ✅ Allows multiple users to tag the same asset simultaneously
- ✅ Manages task assignment instantly with claim/release mechanism
- ✅ Tracks real-time progress with live updates
- ✅ Resolves conflicts using optimistic concurrency control
- ✅ Provides comprehensive analytics and metrics

---

## ✨ Key Features

### Frontend (React.js)
- **Component-Based Architecture**: Modular components for asset viewer, annotation tools, and task management
- **Real-Time Collaboration**: WebSocket-powered instant updates for annotations
- **Intuitive UI/UX**: 
  - Bounding boxes appear instantly for all users
  - Tasks vanish from queue when claimed
  - Clean, minimal black/white design
- **Routing**: Dashboard, Workspace, Metrics, Admin Panel

### Backend (Node.js/Express.js)
- **RESTful API**: Complete CRUD operations for assets, annotations, and users
- **Authentication**: JWT-based secure authentication with role-based authorization
- **Real-Time Communication**: Socket.IO for high-frequency annotation data
- **Conflict Resolution**: Optimistic concurrency control with version tracking
- **Database**: MongoDB with flexible schema for annotations and metadata

### Advanced Features
- 🔄 **Version Control**: Track annotation changes with conflict detection
- 👥 **User Presence**: See who's actively annotating
- 📊 **Analytics Dashboard**: Real-time metrics and performance tracking
- 🔐 **Role-Based Access**: Admin, Manager, Annotator roles
- 🎨 **Multiple Annotation Types**: Bounding box, circle, polygon, text labels
- 🔔 **Toast Notifications**: User feedback for all operations

---

## 🏗️ Architecture

### System Architecture

\`\`\`mermaid
graph TB
    subgraph "Client Layer"
        A[React App]
        B[WebSocket Client]
        C[REST Client]
    end
    
    subgraph "Server Layer"
        D[Express Server]
        E[Socket.IO Server]
        F[JWT Middleware]
    end
    
    subgraph "Business Logic"
        G[Asset Service]
        H[Annotation Service]
        I[User Service]
    end
    
    subgraph "Data Layer"
        J[(MongoDB)]
    end
    
    A --> C
    A --> B
    C --> D
    B --> E
    D --> F
    E --> F
    F --> G
    F --> H
    F --> I
    G --> J
    H --> J
    I --> J
\`\`\`

### Real-Time Collaboration Flow

\`\`\`mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant WS as WebSocket Server
    participant DB as MongoDB
    
    U1->>DB: Create Annotation (v1)
    DB-->>U1: Success
    U1->>WS: Broadcast annotation_added
    WS->>U2: annotation_added event
    U2->>U2: Update local state
    
    Note over U1,U2: Concurrent Edit Scenario
    U2->>DB: Update Annotation (v1)
    DB-->>U2: Success (v2)
    
    U1->>DB: Update Annotation (v1)
    DB-->>U1: 409 Conflict (current: v2)
    U1->>U1: Refresh annotation data
    U1->>U1: Show conflict warning
\`\`\`

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18.x** - UI library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Konva.js** - Canvas-based annotation tools
- **React Toastify** - Toast notifications

### Backend
- **Node.js 18.x** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Mongoose** - MongoDB ODM

### DevOps
- **Git** - Version control
- **npm** - Package management
- **dotenv** - Environment variables

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd Tagmaster
\`\`\`

2. **Install Backend Dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

3. **Install Frontend Dependencies**
\`\`\`bash
cd ../frontend
npm install
\`\`\`

### Configuration

1. **Backend Environment Variables**

Create \`backend/.env\`:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tagmaster
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

2. **Frontend Environment Variables** (if needed)

Create \`frontend/.env\`:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
\`\`\`

### Database Setup

1. **Start MongoDB**
\`\`\`bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

2. **Seed Database** (optional)
\`\`\`bash
cd backend
npm run seed
\`\`\`

### Running the Application

1. **Start Backend Server**
\`\`\`bash
cd backend
npm run dev
\`\`\`
Server runs on \`http://localhost:5000\`

2. **Start Frontend (New Terminal)**
\`\`\`bash
cd frontend
npm start
\`\`\`
App opens at \`http://localhost:3000\`

### Default Login Credentials

**Admin**
- Email: \`admin@tagmaster.com\`
- Password: \`admin123\`

**Annotator**
- Email: \`annotator@tagmaster.com\`
- Password: \`annotator123\`

---

## 📁 Project Structure

\`\`\`
Tagmaster/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── assetController.js    # Asset management
│   │   └── annotationController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Asset.js              # Asset schema
│   │   └── Annotation.js         # Annotation schema (with versioning)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assets.js
│   │   └── annotations.js
│   ├── services/
│   │   ├── annotationService.js  # Business logic with conflict resolution
│   │   └── socketService.js      # WebSocket handlers
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssetCard.js
│   │   │   ├── ImageCanvas.js    # Annotation canvas
│   │   │   ├── ToastNotification.js
│   │   │   └── UserPresence.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── SocketContext.js
│   │   │   └── AnnotationContext.js  # Conflict handling
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   └── useAnnotations.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AnnotationWorkspace.js
│   │   │   ├── Metrics.js
│   │   │   ├── AdminPanel.js
│   │   │   ├── Pricing.js
│   │   │   ├── Platform.js
│   │   │   └── Services.js
│   │   ├── services/
│   │   │   ├── api.js            # API client
│   │   │   └── socket.js         # WebSocket client
│   │   └── App.js
│   └── package.json
│
└── README.md
\`\`\`

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

**Authentication**
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login
- \`GET /api/auth/me\` - Get current user

**Assets**
- \`GET /api/assets\` - Get all assets
- \`POST /api/assets\` - Create asset (Admin only)
- \`PATCH /api/assets/:id/claim\` - Claim asset
- \`PATCH /api/assets/:id/release\` - Release asset
- \`PATCH /api/assets/:id/complete\` - Complete asset

**Annotations**
- \`GET /api/annotations/asset/:assetId\` - Get annotations
- \`POST /api/annotations\` - Create annotation
- \`PUT /api/annotations/:id\` - Update (with version check)
- \`DELETE /api/annotations/:id\` - Delete annotation

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: Manage users, projects, assets, view all metrics |
| **Manager** | Create assets, assign tasks, view team metrics |
| **Annotator** | Claim assets, create/edit annotations, view own metrics |

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Secure HTTP headers

---

## 🎨 UI/UX Highlights

- **Minimal Black/White Design**: Professional, distraction-free interface
- **Real-Time Feedback**: Toast notifications for all user actions
- **Loading States**: Visual feedback during async operations
- **Responsive Design**: Works on desktop and tablet
- **Intuitive Navigation**: Clean routing and breadcrumbs

---

## 📊 Performance Optimizations

- Optimistic UI updates for instant feedback
- Debounced WebSocket events
- Lazy loading of components
- Efficient MongoDB indexes
- Connection pooling
- Memoized React components

---

## 🧪 Testing

\`\`\`bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
\`\`\`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yash Khapre**
- GitHub: [@yash-khapre8](https://github.com/yash-khapre8)
- LinkedIn: [Yash Khapre](https://www.linkedin.com/in/-yash)

---

## 🙏 Acknowledgments

- B.Tech CSE Semester III Project
- React.js + Node.js + MongoDB Stack
- Real-time collaboration patterns
- Conflict resolution in distributed systems

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: yashkhapre@example.com

**Built with ❤️ for collaborative ML annotation**
