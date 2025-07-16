# Parapraxis Backend

A backend API for the Parapraxis wellness and productivity platform.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Security**: Helmet, rate limiting, CORS, input sanitization
- **Database**: Prisma ORM with MySQL
- **Validation**: Comprehensive input validation with Yup
- **Logging**: Structured logging with different levels
- **Error Handling**: Centralized error handling with custom error classes
- **Modular Architecture**: Clean, organized code structure
- **API Documentation**: Well-documented routes and endpoints

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.js       # Environment configuration
│   │   ├── prisma.js    # Database configuration
│   │   └── constants.js # Application constants
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── validator/       # Validation schemas (deprecated)
├── prisma/              # Database schema and migrations
├── server.js            # Application entry point
├── index.js             # Express app configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed database (optional)
   npm run db:seed
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user profile
- `POST /logout` - Logout user
- `POST /change-password` - Change user password

### User Routes (`/api/users`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account
- `GET /stats` - Get user statistics

### Journal Routes (`/api/journals`)

- Coming soon...

### Task Routes (`/api/tasks`)

- Coming soon...

### Workout Routes (`/api/workouts`)

- Coming soon...

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:debug` - Start development server with debugging
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database
- `npm run health` - Check server health

## 🔐 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: API rate limiting
- **CORS**: Cross-origin resource sharing
- **Input Sanitization**: Request data sanitization
- **JWT**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable rounds

## 📝 Environment Variables

Required environment variables:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="mysql://username:password@localhost:3306/parapraxis_db"
JWT_SECRET=your-secret-key
```

See `.env.example` for all available configuration options.

## 🏗️ Architecture

### Configuration Layer

- `config/env.js` - Environment configuration with validation
- `config/prisma.js` - Database configuration and connection
- `config/constants.js` - Application constants

### Middleware Layer

- `middleware/auth.middleware.js` - Authentication middleware
- `middleware/security.middleware.js` - Security middleware

### Service Layer

- `services/auth.service.js` - Authentication business logic
- Clean separation of concerns

### Utils Layer

- `utils/logger.js` - Structured logging
- `utils/response.js` - Standardized API responses
- `utils/createError.js` - Custom error classes
- `utils/validation.js` - Input validation schemas

## 🐛 Error Handling

The application uses a comprehensive error handling system:

- Custom error classes (`AppError`)
- Centralized error handler
- Proper HTTP status codes
- Structured error responses
- Development vs production error formatting

## 📊 Logging

Structured logging with different levels:

- `error` - Error messages
- `warn` - Warning messages
- `info` - Information messages
- `debug` - Debug messages

## 🔄 Health Check

The server includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🚦 Rate Limiting

Different rate limits for different endpoints:

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Password reset: 3 requests per hour

## 📋 TODO

- [ ] Add comprehensive tests
- [ ] Implement caching layer
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Implement file upload functionality
- [ ] Add email notifications
- [ ] Implement user roles and permissions
- [ ] Add database query optimization
- [ ] Implement audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when available)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
