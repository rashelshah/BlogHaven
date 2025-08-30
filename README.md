# BlogHaven Platform

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Features
- User registration and login with JWT authentication
- Create and submit blog articles for admin approval
- User profile to manage submitted and published articles
- View trending blogs based on likes and comments
- Search and filter functionality
- Responsive design for mobile and desktop

### Admin Features
- Admin dashboard to manage blog submissions
- Approve or reject blog submissions
- Hide or delete published articles
- Content moderation tools

### Core Functionality
- Homepage with latest blogs
- Trending blogs section
- Markdown editor for blog creation
- Email notifications (bonus)
- Analytics dashboard (bonus)

## Tech Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Additional**: Nodemailer (emails), React Markdown (editor)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd devnovate-blog-platform
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables (see .env.example files)

5. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Project Structure

```
devnovate-blog-platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── README.md
```

## License

MIT License
