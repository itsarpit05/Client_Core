# ClientCore - Professional CRM System

A modern, fully-featured Customer Relationship Management (CRM) system built with React frontend and Node.js backend, featuring a beautiful UI and comprehensive functionality for managing clients, proposals, projects, and tasks.

## 🚀 Features

### 🔐 Authentication & Security
- **Professional Login System** with form validation
- **Secure Session Management** using JWT tokens
- **User Role Management** (Admin, Manager, Employee, User)
- **Backend API Security** with middleware protection

### 📊 Dashboard
- **Real-time Statistics** (Revenue, Clients, Projects, Tasks)
- **Activity Feed** showing recent system activities
- **Quick Action Buttons** for common tasks
- **Responsive Design** for all devices

### 📋 Proposal Management
- **Kanban Board Layout** with drag-and-drop functionality
- **5-Stage Pipeline**: Lead → Bidding → Signature → Hold → Approved
- **Proposal Cards** with detailed client information
- **Search & Filter** capabilities
- **Backend API** for CRUD operations

### 🚀 Project & Task Management
- **Project Overview** with progress tracking
- **Status Management** (Planning, In Progress, Completed, On Hold)
- **Budget Tracking** and team assignment
- **Task Assignment** with priority levels
- **Time Tracking** and dependencies

### 👥 Client & Employee Management
- **Client Database** with contact information
- **Supplier Management** for partnerships
- **Revenue Tracking** per client
- **Employee Profiles** with roles and departments
- **Project Assignment** tracking

### 👤 User Profile & Settings
- **Personal Information** management
- **Company Details** and preferences
- **Notification Settings** customization
- **Theme Selection** (Light/Dark mode)
- **Security Settings** (Password, 2FA)

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for professional styling
- **React Router** for navigation
- **Lucide React** for beautiful icons
- **Vite** for fast development

### Backend
- **Node.js** runtime environment
- **Express.js** web framework
- **MongoDB** database with Mongoose ODM
- **JWT** authentication system
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Helmet** for security headers
- **CORS** and rate limiting

## 📁 Project Structure

```
clientcore/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
├── backend/                 # Node.js backend API
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   ├── seeder.js           # Database seeder
│   └── README.md           # Backend documentation
├── package.json            # Root dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clientcore
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up Environment Variables**
   ```bash
   # In backend directory
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

5. **Start Backend Server**
   ```bash
   # In backend directory
   npm run dev
   # Server will run on http://localhost:5000
   ```

6. **Start Frontend Development Server**
   ```bash
   # In frontend directory (new terminal)
   npm run dev
   # Frontend will run on http://localhost:3000
   ```

7. **Seed Database (Optional)**
   ```bash
   # In backend directory
   npm run seed
   ```

### Environment Configuration

Create a `.env` file in the backend directory:

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
```

## 🔑 Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: `admin@example.com`
- **Password**: `password123`

## 📚 API Documentation

The backend provides a comprehensive REST API:

- **Authentication**: `/api/auth/*`
- **Clients**: `/api/clients/*`
- **Proposals**: `/api/proposals/*`
- **Projects**: `/api/projects/*`
- **Tasks**: `/api/tasks/*`
- **Users**: `/api/users/*`
- **Employees**: `/api/employees/*`

For detailed API documentation, see [Backend README](./backend/README.md).

## 🎨 Design Features

### Modern UI/UX
- **Clean & Professional** design matching enterprise standards
- **Responsive Layout** that works on all devices
- **Consistent Color Scheme** with primary and secondary palettes
- **Smooth Animations** and transitions

### Component System
- **Reusable Components** for buttons, cards, and forms
- **Custom CSS Classes** with Tailwind utilities
- **Icon Integration** using Lucide React
- **Loading States** and error handling

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔧 Customization

### Frontend
Modify the color scheme in `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  }
}
```

### Backend
Customize API endpoints, add new models, or modify business logic in the backend directory.

## 🚀 Future Enhancements

- **Real-time Chat** between team members
- **Email Integration** for client communication
- **Calendar Integration** for scheduling
- **Advanced Analytics** and reporting
- **Mobile App** development
- **File Upload** and management
- **Advanced Search** and filtering
- **API Rate Limiting** and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ClientCore Team**
- Built with ❤️ for modern business needs

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **React Team** for the amazing framework
- **Node.js** and **Express** for the robust backend
- **MongoDB** for the flexible database
- **Vite** for the fast build tool

---

**ClientCore** - Empowering businesses with modern CRM solutions featuring both frontend and backend excellence.

