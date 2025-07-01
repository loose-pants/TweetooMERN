# Twittoo - Full-Stack Microblogging Platform

A modern, full-featured microblogging platform built with React, Node.js, Express, and MongoDB. Features JWT authentication, role-based authorization, and a beautiful responsive UI.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based login/register system
- **Role-Based Authorization**: Three user roles (user, editor, admin) with different permissions
- **Tweet Management**: Create, read, update, delete tweets with 280 character limit
- **Real-time Updates**: Dynamic UI updates without page refreshes
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### User Roles & Permissions
- **User**: Can create, edit, and delete their own tweets
- **Editor**: Can moderate all content (edit/delete any tweet) + user permissions
- **Admin**: Full system access including user management + editor permissions

### Admin Features
- User management dashboard
- Role assignment and modification
- User deletion capabilities
- System statistics and analytics

### Editor Features
- Content moderation panel
- Tweet filtering (all, recent, edited)
- Universal edit/delete permissions for content management

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB/NeDB** - Database (NeDB for WebContainer compatibility)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/twittoo
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

3. **Seed the database with sample data**:
   ```bash
   npm run seed
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎯 Demo Accounts

After seeding, you can use these test accounts:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | Full system access |
| Editor | `editor_jane` | `editor123` | Content moderation |
| User | `john_doe` | `user123` | Basic tweet operations |

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user profile
```

### Tweet Endpoints
```
GET    /api/tweets     - Get all tweets (public)
GET    /api/tweets/:id - Get single tweet (public)
POST   /api/tweets     - Create tweet (authenticated)
PUT    /api/tweets/:id - Update tweet (owner/editor/admin)
DELETE /api/tweets/:id - Delete tweet (owner/editor/admin)
```

### User Management (Admin Only)
```
GET    /api/users        - Get all users
PUT    /api/users/:id/role - Update user role
DELETE /api/users/:id    - Delete user
```

## 🗄 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'editor', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Tweet Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  content: String (required, max: 280),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run seed` - Seed database with sample data
- `npm run build` - Build frontend for production

### Backend Scripts
- `npm run dev` - Start backend with nodemon
- `npm run start` - Start backend in production mode
- `npm run seed` - Import sample data
- `npm run seed:destroy` - Clear all data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication with 30-day expiration
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 🎨 UI/UX Features

- **Modern Design**: Clean, Twitter-inspired interface
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: User feedback during async operations
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user actions
- **Dark Mode Ready**: Prepared for theme switching

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting provider

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the backend folder

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web development best practices
- Inspired by Twitter's clean interface design
- Uses industry-standard security practices
- Follows RESTful API conventions

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/twittoo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Happy Tweeting! 🐦**