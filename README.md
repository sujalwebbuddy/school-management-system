# SchoolHub Platform

<div align="center">

![SchoolHub Logo](./client/public/logo.svg)

**A Comprehensive Enterprise Learning Management System (LMS)**

*Multi-tenant SaaS platform for educational institutions with AI-powered features*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-blue.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

[📚 Documentation](./document/) • [🚀 Live Demo](https://school-management-system-two-mu.vercel.app) • [📖 API Docs](./document/api-documentation.html)

</div>

---

## 🌟 Overview

SchoolHub Platform is a comprehensive enterprise-grade Learning Management System (LMS) designed for educational institutions. Built with modern web technologies and AI-powered features, it provides a complete solution for managing students, teachers, classes, assessments, and communication in a multi-tenant SaaS architecture.

### ✨ Key Features

#### 🏢 Multi-Tenant Architecture
- **Organization Isolation**: Each educational institution gets its own isolated environment
- **Custom Domains**: Unique domain support for each organization
- **Subscription Tiers**: Primary ($29/mo), High School ($79/mo), University ($199/mo)
- **Feature Gating**: Tier-based access to advanced features

#### 🤖 AI-Powered Features
- **Person Detection**: TensorFlow.js-powered AI for automated person detection
- **Content Analysis**: Intelligent content moderation and analysis
- **Smart Assessment**: Automated grading and performance insights

#### 💳 Enterprise Integrations
- **Stripe Payments**: Complete payment processing and subscription management
- **AWS S3 Storage**: Secure cloud file storage with global CDN
- **Email Notifications**: Automated communication via Nodemailer
- **Real-time Chat**: Socket.io-powered instant messaging

#### 📊 Advanced Analytics
- **Interactive Dashboards**: Syncfusion-powered analytics and reporting
- **Performance Metrics**: Comprehensive student and teacher insights
- **Attendance Tracking**: Automated attendance management
- **Progress Monitoring**: Real-time academic progress tracking

#### 🎓 Educational Tools
- **Homework Management**: Create, assign, and grade assignments
- **Exam System**: Multiple-choice exams with automated grading
- **Class Management**: Organize students and subjects efficiently
- **Task Management**: Kanban-style project and task tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Material-UI** - Enterprise-grade component library
- **Syncfusion** - Advanced UI components and charts
- **Redux Toolkit** - State management and async operations
- **Socket.io Client** - Real-time communication
- **Stripe Elements** - Payment processing integration

### Backend
- **Node.js 16+** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication and authorization
- **Socket.io** - Real-time bidirectional communication
- **TensorFlow.js** - AI/ML capabilities

### Cloud & Infrastructure
- **AWS S3** - Object storage and file management
- **Stripe** - Payment processing and subscriptions
- **Vercel** - Frontend deployment (recommended)
- **AWS EC2** - Backend deployment with auto-scaling

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **PM2** - Production process management

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** ([Download](https://nodejs.org/))
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))
- **AWS Account** (for S3 storage)
- **Stripe Account** (for payments)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/WebBuddy-Marketplace/school-management-system.git
   cd schoolhub-platform
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install

   # Return to root directory
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env.local

   # Edit environment variables
   nano server/.env.local
   ```

   Required environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/schoolhub

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # AWS S3 (for file storage)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-s3-bucket-name

   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
   STRIPE_SECRET_KEY=sk_test_your-stripe-key

   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the Application**
   ```bash
   # Start backend server (from server directory)
   cd server
   npm run dev

   # Start frontend (from client directory in new terminal)
   cd ../client
   npm start
   ```

5. **Create Admin Account**
   ```bash
   # Run admin creation script
   cd server
   npm run add-admin
   ```

## 📖 Usage

### For Administrators
1. **Access Admin Panel**: Log in with admin credentials
2. **Create Organization**: Set up your educational institution
3. **Manage Users**: Approve registrations and assign roles
4. **Configure Classes**: Create classes and assign subjects
5. **Monitor Analytics**: View comprehensive dashboards

### For Teachers
1. **Dashboard Access**: Log in to access your teaching dashboard
2. **Create Homework**: Assign assignments to students
3. **Manage Exams**: Create and grade examinations
4. **Track Attendance**: Monitor student attendance
5. **Communicate**: Use real-time chat with students

### For Students
1. **Student Portal**: Access your personalized dashboard
2. **View Assignments**: See homework and deadlines
3. **Submit Work**: Upload completed assignments
4. **Take Exams**: Complete online assessments
5. **Communicate**: Message teachers and classmates

## 📚 Documentation

Comprehensive documentation is available in the [`document/`](./document/) directory:

- **[Welcome Guide](./document/index.html)** - Platform overview and features
- **[User Guide](./document/how-to-use.html)** - Detailed usage instructions
- **[Technical Overview](./document/technical-overview.html)** - Architecture and implementation details
- **[API Documentation](./document/api-documentation.html)** - Complete API reference
- **[Deployment Guides](./document/)** - Installation and deployment instructions

## 🔧 API Reference

The platform provides a comprehensive REST API:

```bash
# Authentication
POST /api/v1/users/login
POST /api/v1/users/register

# User Management
GET /api/v1/users/profile
PUT /api/v1/users/profile

# Organization Management
GET /api/v1/organizations
POST /api/v1/organizations

# Educational Features
GET /api/v1/teacher/homework
POST /api/v1/teacher/exams
GET /api/v1/student/attendance

# Real-time Features
GET /api/v1/chats
POST /api/v1/tasks

# AI Services
POST /api/v1/ai/detect-person

# File Management
POST /api/v1/upload
GET /api/v1/upload/url
```

For complete API documentation, see [API Documentation](./document/api-documentation.html).

## 🚀 Deployment

### Recommended: Vercel + AWS EC2

1. **Frontend (Vercel)**
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

2. **Backend (AWS EC2)**
   ```bash
   # Follow detailed AWS EC2 guide
   # See: document/install-aws-ec2.html
   ```

### Alternative Deployments
- **Heroku**: Backend deployment
- **DigitalOcean**: VPS hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages
- Ensure cross-browser compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Complete Documentation](./document/)
- **Issues**: [GitHub Issues](https://github.com/your-username/schoolhub-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/schoolhub-platform/discussions)

## 🙏 Acknowledgments

- **TensorFlow.js** for AI/ML capabilities
- **Stripe** for payment processing
- **AWS** for cloud infrastructure
- **Material-UI** for UI components
- **Syncfusion** for advanced components

---

<div align="center">

**Built with ❤️ for the education community**

[⭐ Star us on GitHub](https://github.com/your-username/schoolhub-platform) • [🐛 Report Issues](https://github.com/your-username/schoolhub-platform/issues) • [💬 Join Discussions](https://github.com/your-username/schoolhub-platform/discussions)

</div>
