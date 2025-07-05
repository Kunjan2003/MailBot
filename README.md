# 📧 MailBot

A modern email automation bot with a Vue.js frontend and Node.js backend. MailBot allows you to create email templates, send emails with attachments, and track email status through an intuitive web interface.

## ✨ Features

- **Email Templates**: Create and manage reusable email templates
- **File Attachments**: Support for multiple file attachments per email
- **Email Tracking**: View sent email history and status
- **Modern UI**: Clean, responsive interface built with Vue.js and Tailwind CSS
- **RESTful API**: Well-structured backend API for email operations
- **Database Storage**: MongoDB integration for persistent data storage

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Nodemailer** - Email sending library
- **Multer** - File upload middleware

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (running locally on port 27017)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mailbot
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
```bash
cd backend
touch .env
```

Add the following environment variables to `backend/.env`:
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/mailbot

# Server Configuration
PORT=8000

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# For Gmail, you'll need to:
# 1. Enable 2-factor authentication
# 2. Generate an app-specific password
# 3. Use the app password in EMAIL_PASS
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 5. Run the Application
```bash
# Start both frontend and backend concurrently
npm run dev
```

This will start:
- Backend server on `http://localhost:8000`
- Frontend development server on `http://localhost:5173`

## 📁 Project Structure

```
mailbot/
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   │   └── mailController.js
│   ├── middleware/          # Custom middleware
│   │   └── upload.js
│   ├── models/             # MongoDB models
│   │   ├── Mail.js
│   │   └── Template.js
│   ├── routes/             # API routes
│   │   └── mailRoutes.js
│   ├── public/             # Static files
│   ├── uploads/            # File uploads directory
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   │   ├── AddTemplate.vue
│   │   │   ├── MailStatus.vue
│   │   │   └── SendMail.vue
│   │   ├── assets/         # Static assets
│   │   ├── App.vue         # Main app component
│   │   └── main.js         # App entry point
│   ├── public/             # Public assets
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend development server
- `npm run install:all` - Install dependencies for all packages

### Backend (`cd backend`)
- `npm start` - Start the backend server
- `npm run dev` - Start the backend server (same as start)

### Frontend (`cd frontend`)
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

## 🌐 API Endpoints

### Email Operations
- `POST /send` - Send an email using a template
- `GET /templates` - Get all email templates
- `POST /templates` - Create a new email template
- `GET /status` - Get email sending status/history
- `GET /test` - Test server connectivity

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in your `.env` file

### Other Email Providers
Update the email configuration in your `.env` file according to your provider:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod --version`
   - Check if the service is active: `sudo systemctl status mongod`

2. **Email Sending Fails**
   - Verify email credentials in `.env`
   - Check if 2FA is enabled and app password is used
   - Ensure firewall allows SMTP connections

3. **Frontend Not Loading**
   - Check if both servers are running
   - Verify ports 8000 and 5173 are available
   - Clear browser cache

4. **File Upload Issues**
   - Ensure `uploads` directory exists in backend
   - Check file permissions
   - Verify file size limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all prerequisites are properly installed
4. Verify environment configuration

---

**Happy Emailing! 📧**
