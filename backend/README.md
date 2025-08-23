# ClientCore Backend API

A robust Node.js/Express backend API for the ClientCore CRM system, featuring MongoDB database, JWT authentication, and comprehensive CRUD operations.

## 🚀 Features

- **🔐 JWT Authentication** with role-based access control
- **📊 MongoDB Database** with Mongoose ODM
- **🛡️ Security Middleware** including Helmet, CORS, and rate limiting
- **✅ Input Validation** using express-validator
- **📝 Comprehensive API** for all CRM operations
- **🌱 Database Seeding** with sample data
- **📚 RESTful Design** following best practices

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors
- **Logging**: Morgan
- **Rate Limiting**: express-rate-limit

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js      # User authentication model
│   ├── Client.js    # Client/Supplier model
│   ├── Proposal.js  # Proposal management model
│   ├── Project.js   # Project management model
│   └── Task.js      # Task management model
├── routes/           # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── clients.js   # Client management routes
│   ├── proposals.js # Proposal management routes
│   ├── projects.js  # Project management routes
│   ├── tasks.js     # Task management routes
│   ├── users.js     # User management routes
│   └── employees.js # Employee management routes
├── middleware/       # Custom middleware
│   └── auth.js      # Authentication middleware
├── server.js         # Main server file
├── seeder.js         # Database seeder
├── package.json      # Dependencies
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Seed Database** (optional)
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## ⚙️ Environment Variables

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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔐 Authentication

### JWT Token Structure

```json
{
  "id": "user_id_here",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Protected Routes

All protected routes require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

### User Roles

- **admin**: Full access to all features
- **manager**: Access to most features, can manage teams
- **employee**: Limited access, assigned tasks only
- **user**: Basic access, view-only for most features

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/users` | Get all users | Admin |

### Client Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/clients` | Get all clients | Private |
| GET | `/api/clients/:id` | Get single client | Private |
| POST | `/api/clients` | Create client | Private |
| PUT | `/api/clients/:id` | Update client | Private |
| DELETE | `/api/clients/:id` | Delete client | Private |
| GET | `/api/clients/stats/overview` | Get client statistics | Private |

### Proposal Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/proposals` | Get all proposals | Private |
| GET | `/api/proposals/kanban` | Get proposals for Kanban | Private |
| GET | `/api/proposals/:id` | Get single proposal | Private |
| POST | `/api/proposals` | Create proposal | Private |
| PUT | `/api/proposals/:id` | Update proposal | Private |
| PATCH | `/api/proposals/:id/status` | Update status | Private |
| DELETE | `/api/proposals/:id` | Delete proposal | Private |

### Project Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/projects` | Get all projects | Private |
| POST | `/api/projects` | Create project | Private |

### Task Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/tasks` | Get all tasks | Private |
| POST | `/api/tasks` | Create task | Private |

### Employee Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/employees` | Get all employees | Private |
| POST | `/api/employees` | Create employee | Admin |

## 📊 Database Models

### User Model
- Authentication fields (email, password)
- Profile information (name, phone, department)
- Role-based access control
- Preferences and settings
- Timestamps and activity tracking

### Client Model
- Company information (name, type, industry)
- Contact details (email, phone, address)
- Business metrics (projects, revenue)
- Status tracking and notes
- Assignment and source tracking

### Proposal Model
- Project details (title, description, address)
- Status management (lead → approved)
- Client and team assignment
- Financial information (value, phases)
- Document attachments and notes

### Project Model
- Project information (name, description, dates)
- Progress tracking and milestones
- Team assignment and roles
- Budget and cost management
- Status and priority management

### Task Model
- Task details (title, description, due date)
- Assignment and priority
- Time tracking and logging
- Status management
- Dependencies and categories

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcryptjs
- **Input Validation** with express-validator
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent abuse
- **Helmet Security** headers
- **Request Logging** with Morgan

## 🚀 Development

### Available Scripts

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Run database seeder
npm run seed

# Run tests
npm test
```

### API Testing

Test the API endpoints using tools like:
- **Postman** or **Insomnia**
- **cURL** commands
- **Thunder Client** (VS Code extension)

### Sample API Calls

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

#### Get Clients (with auth)
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Seeding

The seeder creates sample data for development:

- **3 Users** (admin, manager, employee)
- **2 Clients** with complete information
- **3 Proposals** in different stages
- **2 Projects** with various statuses
- **2 Tasks** assigned to users

Run the seeder:
```bash
npm run seed
```

## 📝 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## 🔧 Customization

### Adding New Models

1. Create model file in `models/` directory
2. Define schema with validation
3. Add to `server.js` routes
4. Create corresponding route file
5. Update seeder if needed

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and use in `server.js`
3. Add authentication middleware as needed
4. Implement CRUD operations

### Environment Configuration

Modify `.env` file for different environments:
- Development: `NODE_ENV=development`
- Production: `NODE_ENV=production`
- Testing: `NODE_ENV=test`

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI

2. **Security**
   - Enable HTTPS
   - Configure CORS origins
   - Set appropriate rate limits

3. **Performance**
   - Enable compression
   - Use PM2 or similar process manager
   - Configure MongoDB indexes

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Test with sample data
4. Create an issue with details

---

**ClientCore Backend** - Powering modern CRM solutions with robust APIs.
