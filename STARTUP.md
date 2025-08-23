# 🚀 ClientCore Startup Guide

Complete guide to get your ClientCore CRM system running with both frontend and backend.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Database will be created automatically

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get your connection string
4. Update the `.env` file with your connection string

## ⚙️ Environment Configuration

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Copy environment template: `cp env.example .env`
3. Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/clientcore

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
# From root directory
npm run install:all
```

### 2. Start Backend Server
```bash
# Terminal 1 - Backend
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### 3. Start Frontend Development Server
```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### 4. Seed Database (Optional)
```bash
# Terminal 1 (Backend)
npm run seed
```

## 🔑 Default Login Credentials

After seeding the database:
- **Email**: `admin@example.com`
- **Password**: `password123`

## 📱 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🛠️ Development Commands

### Root Directory
```bash
# Start both frontend and backend
npm run dev

# Install all dependencies
npm run install:all

# Seed database
npm run seed
```

### Backend Directory
```bash
# Development server
npm run dev

# Production server
npm start

# Seed database
npm run seed

# Run tests
npm test
```

### Frontend Directory
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 Troubleshooting

### Backend Issues
1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using port 5000

3. **JWT Secret Error**
   - Ensure JWT_SECRET is set in `.env`
   - Use a strong, unique secret

### Frontend Issues
1. **Build Errors**
   - Clear node_modules and reinstall
   - Check for syntax errors in components

2. **API Connection Error**
   - Verify backend is running on port 5000
   - Check CORS configuration

## 📊 Database Models

The system includes these main models:
- **Users**: Authentication and profiles
- **Clients**: Customer and supplier information
- **Proposals**: Project proposals with status tracking
- **Projects**: Active projects and progress
- **Tasks**: Task management and assignment

## 🔐 API Security

- **JWT Authentication** for all protected routes
- **Role-based Access Control** (Admin, Manager, Employee, User)
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure production MongoDB
4. Enable HTTPS
5. Set up process manager (PM2)

### Frontend
1. Build with `npm run build`
2. Serve static files
3. Configure reverse proxy
4. Set up CDN if needed

## 📚 Additional Resources

- **Backend API Docs**: [./backend/README.md](./backend/README.md)
- **Frontend Docs**: [./frontend/README.md](./frontend/README.md)
- **Main Project Docs**: [./README.md](./README.md)

## 🆘 Need Help?

1. Check the logs in your terminal
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check network connectivity
5. Review the API documentation

---

**Happy Coding! 🎉**

Your ClientCore CRM system should now be running with a full-stack architecture!
