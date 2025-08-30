const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');
const Blog = require('./models/Blog');

const sampleBlogs = [
  {
    title: "Getting Started with React Hooks: A Complete Guide",
    content: `# Getting Started with React Hooks

React Hooks revolutionized how we write React components. Let's explore the most commonly used hooks and how they can improve your code.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## useState Hook

The useState hook lets you add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
\`\`\`

## Best Practices

1. Always include dependencies in useEffect
2. Use custom hooks for reusable logic
3. Keep hooks at the top level of components

Hooks make React code more readable and reusable. Start using them today!`,
    excerpt: "Learn the fundamentals of React Hooks and how they can transform your React development workflow.",
    category: "Programming",
    tags: ["react", "javascript", "hooks", "frontend"],
    status: "approved"
  },
  {
    title: "Building Scalable Node.js APIs with Express",
    content: `# Building Scalable Node.js APIs with Express

Creating robust and scalable APIs is crucial for modern web applications. Here's how to build them with Node.js and Express.

## Setting Up Your Express Server

Start with a basic Express setup:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Middleware for Scalability

Use middleware for common functionality:

\`\`\`javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
\`\`\`

## Database Integration

Connect to MongoDB using Mongoose:

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
\`\`\`

## API Structure

Organize your routes and controllers:

\`\`\`javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;
\`\`\`

## Authentication & Security

Implement JWT authentication and security best practices for production-ready APIs.`,
    excerpt: "Learn how to build scalable and secure REST APIs using Node.js and Express framework.",
    category: "Web Development",
    tags: ["nodejs", "express", "api", "backend", "mongodb"],
    status: "approved"
  },
  {
    title: "Introduction to Machine Learning with Python",
    content: `# Introduction to Machine Learning with Python

Machine Learning is transforming industries. Let's explore how to get started with Python.

## What is Machine Learning?

Machine Learning is a subset of AI that enables computers to learn and make decisions from data without explicit programming.

## Types of Machine Learning

### 1. Supervised Learning
- Classification
- Regression

### 2. Unsupervised Learning
- Clustering
- Dimensionality Reduction

### 3. Reinforcement Learning
- Agent-based learning
- Reward systems

## Getting Started with Python

Install essential libraries:

\`\`\`bash
pip install numpy pandas scikit-learn matplotlib seaborn
\`\`\`

## Your First ML Model

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Load data
data = pd.read_csv('housing_data.csv')

# Prepare features and target
X = data[['size', 'bedrooms', 'age']]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')
\`\`\`

## Next Steps

1. Learn data preprocessing
2. Explore different algorithms
3. Practice with real datasets
4. Study model evaluation metrics

Machine Learning opens endless possibilities. Start your journey today!`,
    excerpt: "Discover the fundamentals of machine learning and how to implement your first ML model using Python.",
    category: "AI/ML",
    tags: ["python", "machine-learning", "data-science", "ai"],
    status: "approved"
  },
  {
    title: "Docker Containerization Best Practices",
    content: `# Docker Containerization Best Practices

Docker has revolutionized application deployment. Here are the best practices for containerizing your applications.

## Why Docker?

- Consistent environments
- Easy scaling
- Simplified deployment
- Resource efficiency

## Writing Efficient Dockerfiles

\`\`\`dockerfile
# Use official base images
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
\`\`\`

## Multi-stage Builds

Reduce image size with multi-stage builds:

\`\`\`dockerfile
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Docker Compose

Orchestrate multiple services:

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database
      
  database:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
\`\`\`

## Security Best Practices

1. Use official base images
2. Run as non-root user
3. Keep images updated
4. Scan for vulnerabilities
5. Use secrets management

Docker makes deployment consistent and reliable across environments.`,
    excerpt: "Master Docker containerization with these essential best practices for building efficient and secure containers.",
    category: "DevOps",
    tags: ["docker", "containers", "devops", "deployment"],
    status: "approved"
  },
  {
    title: "Understanding Database Design Principles",
    content: `# Understanding Database Design Principles

Good database design is fundamental to building efficient applications. Let's explore key principles and best practices.

## Database Design Fundamentals

### 1. Normalization
Organize data to reduce redundancy:
- First Normal Form (1NF)
- Second Normal Form (2NF)
- Third Normal Form (3NF)

### 2. Primary Keys
Every table should have a primary key that uniquely identifies each record.

### 3. Foreign Keys
Establish relationships between tables using foreign keys.

## Entity-Relationship Modeling

Design your database structure:

\`\`\`sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Indexing Strategies

Improve query performance with proper indexing:

\`\`\`sql
-- Index frequently searched columns
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Composite indexes for multiple column searches
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
\`\`\`

## Query Optimization

Write efficient queries:

\`\`\`sql
-- Good: Using indexes
SELECT * FROM posts WHERE user_id = 123 ORDER BY created_at DESC;

-- Bad: Unnecessary joins
SELECT p.*, u.* FROM posts p 
JOIN users u ON p.user_id = u.id 
WHERE p.id = 1;
\`\`\`

## NoSQL Considerations

When to choose NoSQL:
- Flexible schema requirements
- Horizontal scaling needs
- Complex data relationships
- High read/write throughput

Good database design sets the foundation for scalable applications.`,
    excerpt: "Learn essential database design principles and best practices for building efficient and scalable data storage solutions.",
    category: "Databases",
    tags: ["database", "sql", "mongodb", "design", "optimization"],
    status: "approved"
  },
  {
    title: "Career Growth Tips for Developers in 2024",
    content: `# Career Growth Tips for Developers in 2024

The tech industry is evolving rapidly. Here's how to accelerate your career growth as a developer.

## Technical Skills to Focus On

### 1. Cloud Computing
- AWS, Azure, or Google Cloud
- Containerization (Docker, Kubernetes)
- Serverless architectures

### 2. Modern Frameworks
- React, Vue.js, or Angular
- Next.js or Nuxt.js
- Backend frameworks like Express, FastAPI

### 3. DevOps Skills
- CI/CD pipelines
- Infrastructure as Code
- Monitoring and logging

## Soft Skills Matter

### Communication
- Write clear documentation
- Present technical concepts to non-technical stakeholders
- Collaborate effectively in teams

### Problem-Solving
- Break down complex problems
- Think critically about solutions
- Debug systematically

## Building Your Personal Brand

### 1. Open Source Contributions
Contribute to projects on GitHub to demonstrate your skills.

### 2. Technical Writing
- Start a blog
- Write tutorials
- Share your learning journey

### 3. Speaking and Networking
- Attend meetups and conferences
- Give talks about your projects
- Build professional relationships

## Continuous Learning

### Stay Updated
- Follow tech news and trends
- Take online courses
- Experiment with new technologies

### Practice Regularly
- Code challenges on LeetCode
- Build side projects
- Participate in hackathons

## Career Progression Paths

### Individual Contributor
- Junior → Mid → Senior → Staff → Principal

### Management Track
- Tech Lead → Engineering Manager → Director

### Specialization
- DevOps Engineer
- Data Engineer
- Security Engineer
- Solutions Architect

## Salary Negotiation Tips

1. Research market rates
2. Document your achievements
3. Highlight unique skills
4. Consider total compensation
5. Practice your pitch

Remember: Career growth is a marathon, not a sprint. Focus on continuous improvement and building meaningful relationships.

The most successful developers are those who never stop learning and adapting to change.`,
    excerpt: "Essential strategies for advancing your developer career in 2024, from technical skills to personal branding.",
    category: "Career",
    tags: ["career", "development", "growth", "skills", "programming"],
    status: "approved"
  },
  {
    title: "Modern CSS Grid Layout Techniques",
    content: `# Modern CSS Grid Layout Techniques

CSS Grid is a powerful layout system that has transformed web design. Let's explore advanced techniques for modern layouts.

## CSS Grid Basics

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Advanced Grid Techniques

### Named Grid Lines
\`\`\`css
.layout {
  display: grid;
  grid-template-columns: [sidebar-start] 250px [sidebar-end main-start] 1fr [main-end];
  grid-template-rows: [header-start] 60px [header-end content-start] 1fr [content-end];
}
\`\`\`

### Grid Areas
\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
\`\`\`

## Responsive Grid Design

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## Practical Examples

### Card Layout
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
\`\`\`

### Dashboard Layout
\`\`\`css
.dashboard {
  display: grid;
  grid-template-areas:
    "nav nav nav"
    "sidebar main main"
    "sidebar footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr auto;
  min-height: 100vh;
}
\`\`\`

CSS Grid provides unprecedented control over layout design. Master these techniques to create modern, responsive web layouts.`,
    excerpt: "Master advanced CSS Grid techniques for creating modern, responsive web layouts with practical examples.",
    category: "Web Development",
    tags: ["css", "grid", "layout", "responsive", "frontend"],
    status: "approved"
  },
  {
    title: "Microservices Architecture Patterns",
    content: `# Microservices Architecture Patterns

Microservices architecture breaks down applications into smaller, manageable services. Here are key patterns and best practices.

## What are Microservices?

Microservices are small, independent services that communicate over well-defined APIs.

## Key Benefits

- Independent deployment
- Technology diversity
- Fault isolation
- Scalability

## Communication Patterns

### Synchronous Communication
\`\`\`javascript
// HTTP/REST API calls
const userService = await fetch('/api/users/123');
const user = await userService.json();
\`\`\`

### Asynchronous Communication
\`\`\`javascript
// Message queues with RabbitMQ
const amqp = require('amqplib');

async function publishMessage(queue, message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}
\`\`\`

## Service Discovery

Use service registries for dynamic service discovery:

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
  
  user-service:
    build: ./user-service
    environment:
      - CONSUL_HOST=consul
\`\`\`

## Data Management

### Database per Service
Each microservice should have its own database.

### Event Sourcing
Store events rather than current state:

\`\`\`javascript
const events = [
  { type: 'UserCreated', data: { id: 1, name: 'John' } },
  { type: 'UserUpdated', data: { id: 1, email: 'john@example.com' } }
];
\`\`\`

## Monitoring and Observability

Implement comprehensive monitoring:
- Distributed tracing
- Centralized logging
- Health checks
- Metrics collection

Microservices offer great flexibility but require careful planning and robust infrastructure.`,
    excerpt: "Explore microservices architecture patterns and learn how to design scalable distributed systems.",
    category: "Technology",
    tags: ["microservices", "architecture", "distributed-systems", "scalability"],
    status: "pending"
  },
  {
    title: "Mobile App Development with React Native",
    content: `# Mobile App Development with React Native

Build native mobile apps using JavaScript and React. Here's your complete guide to React Native development.

## Why React Native?

- Write once, run on iOS and Android
- Native performance
- Hot reloading
- Large community support

## Setting Up Development Environment

\`\`\`bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new project
npx react-native init MyApp

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
\`\`\`

## Core Components

### View and Text
\`\`\`javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
\`\`\`

### Navigation
\`\`\`javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

## State Management

Use Redux for complex state:

\`\`\`javascript
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
\`\`\`

## Native Modules

Access device features:

\`\`\`javascript
import { Camera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data locally
await AsyncStorage.setItem('user', JSON.stringify(userData));
\`\`\`

## Performance Optimization

1. Use FlatList for large lists
2. Optimize images
3. Minimize bridge communication
4. Use Hermes engine

React Native enables rapid mobile development with near-native performance.`,
    excerpt: "Learn React Native development and build cross-platform mobile apps with JavaScript and React.",
    category: "Mobile Development",
    tags: ["react-native", "mobile", "ios", "android", "javascript"],
    status: "draft"
  },
  {
    title: "The Future of Web Development: Trends to Watch",
    content: `# The Future of Web Development: Trends to Watch

Web development is constantly evolving. Here are the key trends shaping the future of the web.

## 1. Web Assembly (WASM)

WebAssembly brings near-native performance to web applications:

\`\`\`javascript
// Loading WASM module
WebAssembly.instantiateStreaming(fetch('module.wasm'))
  .then(wasmModule => {
    const result = wasmModule.instance.exports.calculate(10, 20);
    console.log(result);
  });
\`\`\`

## 2. Progressive Web Apps (PWAs)

PWAs combine the best of web and mobile apps:

\`\`\`javascript
// Service Worker for offline functionality
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
\`\`\`

## 3. JAMstack Architecture

JavaScript, APIs, and Markup for better performance:

\`\`\`javascript
// Static site generation with Next.js
export async function getStaticProps() {
  const posts = await fetchPosts();
  
  return {
    props: { posts },
    revalidate: 60 // Regenerate every minute
  };
}
\`\`\`

## 4. Edge Computing

Bring computation closer to users:

\`\`\`javascript
// Cloudflare Workers example
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/geolocation') {
    return new Response(JSON.stringify({
      country: request.cf.country,
      city: request.cf.city
    }));
  }
}
\`\`\`

## 5. AI-Powered Development

AI tools transforming development:

- GitHub Copilot for code completion
- Automated testing with AI
- Design-to-code tools
- Intelligent debugging

## 6. Web3 and Blockchain Integration

\`\`\`javascript
// Web3 wallet integration
import { ethers } from 'ethers';

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return signer.getAddress();
  }
}
\`\`\`

## 7. Component-Driven Development

- Design systems
- Micro frontends
- Component libraries
- Atomic design principles

## Preparing for the Future

1. **Stay Updated**: Follow tech blogs and conferences
2. **Experiment**: Try new technologies in side projects
3. **Community**: Join developer communities
4. **Continuous Learning**: Never stop learning

The future of web development is exciting with endless possibilities for innovation.`,
    excerpt: "Explore emerging trends in web development and prepare for the future of digital experiences.",
    category: "Opinion",
    tags: ["trends", "future", "web-development", "technology", "innovation"],
    status: "rejected",
    rejectionReason: "Content needs more technical depth and practical examples. Please expand on implementation details."
  }
];

const seedBlogs = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find or create sample users
    let users = await User.find({});
    
    if (users.length === 0) {
      users = await User.insertMany([
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
          bio: 'Platform administrator'
        },
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'password123',
          role: 'user',
          bio: 'Full-stack developer passionate about React and Node.js'
        },
        {
          name: 'Bob Smith',
          email: 'bob@example.com', 
          password: 'password123',
          role: 'user',
          bio: 'DevOps engineer focused on cloud infrastructure and automation'
        },
        {
          name: 'Carol Davis',
          email: 'carol@example.com',
          password: 'password123', 
          role: 'user',
          bio: 'Data scientist and machine learning enthusiast'
        }
      ]);
      console.log('Sample users created');
    }

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Create blogs individually to trigger slug generation middleware
    const createdBlogs = [];
    
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i];
      const author = users[i % users.length]._id;
      
      const blog = new Blog({
        ...blogData,
        author,
        publishedAt: blogData.status === 'approved' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        views: blogData.status === 'approved' ? Math.floor(Math.random() * 1000) + 50 : 0,
        likes: blogData.status === 'approved' ? 
          Array.from({ length: Math.floor(Math.random() * 20) }, () => ({
            user: users[Math.floor(Math.random() * users.length)]._id,
            createdAt: new Date()
          })) : [],
        comments: blogData.status === 'approved' ?
          Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => ({
            user: users[Math.floor(Math.random() * users.length)]._id,
            content: [
              "Great article! Very helpful.",
              "Thanks for sharing this knowledge.",
              "I learned something new today.",
              "Well explained with good examples.",
              "This helped me solve my problem."
            ][j % 5],
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          })) : []
      });
      
      const savedBlog = await blog.save();
      createdBlogs.push(savedBlog);
      console.log(`Created blog: ${savedBlog.title}`);
    }
    
    console.log(`Created ${createdBlogs.length} sample blogs`);

    console.log('Blog seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

// Run the seeder
seedBlogs();
