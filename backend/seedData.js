const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const User = require('./models/User');
const Blog = require('./models/Blog');

const sampleUsers = [
  {
    name: 'John Developer',
    email: 'john@devnovate.com',
    password: 'password123',
    role: 'user',
    bio: 'Full-stack developer passionate about React and Node.js'
  },
  {
    name: 'Sarah Tech',
    email: 'sarah@devnovate.com',
    password: 'password123',
    role: 'user',
    bio: 'Frontend specialist and UI/UX enthusiast'
  },
  {
    name: 'Mike Data',
    email: 'mike@devnovate.com',
    password: 'password123',
    role: 'user',
    bio: 'Data scientist and machine learning engineer'
  }
];

const sampleBlogs = [
  {
    title: 'Getting Started with React Hooks',
    content: `# Getting Started with React Hooks

React Hooks have revolutionized the way we write React components. They allow us to use state and other React features without writing a class component.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. React provides several built-in hooks like useState, useEffect, and useContext.

## Basic Example

Here's a simple example using the useState hook:

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

## Benefits of Hooks

1. **Easier to understand**: Function components are simpler than class components
2. **Better reusability**: Custom hooks allow you to share stateful logic
3. **Smaller bundle size**: Function components are more tree-shakeable

Hooks have made React development more enjoyable and productive!`,
    excerpt: 'Learn how to get started with React Hooks and transform your component development workflow.',
    category: 'Programming',
    tags: ['react', 'javascript', 'hooks', 'frontend'],
    status: 'approved',
    publishedAt: new Date(),
    views: 45
  },
  {
    title: 'Building REST APIs with Node.js and Express',
    content: `# Building REST APIs with Node.js and Express

Building robust REST APIs is a fundamental skill for backend developers. In this guide, we'll explore how to create a production-ready API using Node.js and Express.

## Setting Up Your Project

First, let's initialize a new Node.js project:

\`\`\`bash
npm init -y
npm install express mongoose cors helmet morgan
\`\`\`

## Basic Express Setup

Here's a minimal Express server:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Best Practices

1. **Use middleware**: Implement CORS, rate limiting, and security headers
2. **Error handling**: Always handle errors gracefully
3. **Validation**: Validate input data before processing
4. **Authentication**: Secure your endpoints with proper auth

This foundation will help you build scalable APIs!`,
    excerpt: 'A comprehensive guide to building production-ready REST APIs using Node.js and Express.',
    category: 'Web Development',
    tags: ['nodejs', 'express', 'api', 'backend'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    views: 78
  },
  {
    title: 'Introduction to TypeScript for JavaScript Developers',
    content: `# Introduction to TypeScript for JavaScript Developers

TypeScript has become increasingly popular in the JavaScript ecosystem. It adds static type checking to JavaScript, helping catch errors early and improve code quality.

## Why TypeScript?

TypeScript offers several advantages:

- **Type Safety**: Catch errors at compile time instead of runtime
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Confident code changes with type checking

## Basic Types

Here are some basic TypeScript types:

\`\`\`typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

## Getting Started

To start using TypeScript in your project:

\`\`\`bash
npm install -g typescript
npm install --save-dev @types/node
tsc --init
\`\`\`

TypeScript is a powerful tool that can significantly improve your development experience!`,
    excerpt: 'Learn the fundamentals of TypeScript and how it can improve your JavaScript development workflow.',
    category: 'Programming',
    tags: ['typescript', 'javascript', 'types', 'development'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    views: 92
  },
  {
    title: 'Mastering Tailwind CSS for Rapid UI Development',
    content: `# Mastering Tailwind CSS for Rapid UI Development

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing any custom CSS. It's a different approach compared to frameworks like Bootstrap or Foundation.

## Why Tailwind?

- **Rapid Prototyping**: Build complex UIs quickly.
- **Highly Customizable**: Configure everything from colors to spacing.
- **No Naming Conventions**: No more \`.btn-primary\` or \`.card-header\`.
- **Small Production Build**: With PurgeCSS, your final CSS file is tiny.

## Example: A Simple Card

\`\`\`html
<div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
  <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
  <p class="text-gray-700 text-base">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
  </p>
  <div class="pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
  </div>
</div>
\`\`\`

Give Tailwind a try on your next project. You might be surprised how productive it makes you!`,
    excerpt: 'A deep dive into Tailwind CSS, the utility-first CSS framework that lets you build modern websites without ever leaving your HTML.',
    category: 'Web Development',
    tags: ['css', 'tailwind', 'frontend', 'ui'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    views: 120
  },
  {
    title: 'Docker for Beginners: A Practical Guide',
    content: `# Docker for Beginners: A Practical Guide

Docker is an open platform for developing, shipping, and running applications. It enables you to separate your applications from your infrastructure so you can deliver software quickly.

## Core Concepts

- **Image**: A lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries and settings.
- **Container**: A runtime instance of an image. It runs completely isolated from the host environment.
- **Dockerfile**: A text document that contains all the commands a user could call on the command line to assemble an image.

## Simple Node.js Dockerfile

\`\`\`dockerfile
# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 3000, so expose it
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "server.js" ]
\`\`\`

Docker simplifies the "it works on my machine" problem and is a crucial tool for modern DevOps practices.`,
    excerpt: 'Get up and running with Docker. This guide provides a practical introduction to containerization for modern application development.',
    category: 'DevOps',
    tags: ['docker', 'devops', 'containers', 'deployment'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    views: 150
  },
  {
    title: 'The Power of Async/Await in JavaScript',
    content: `# The Power of Async/Await in JavaScript

\`async/await\` is syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code. This makes it much easier to read and reason about.

## Before Async/Await (Promises)

\`\`\`javascript
function getJoke() {
  fetch('https://api.jokes.com/random')
    .then(response => response.json())
    .then(data => {
      console.log(data.joke);
    })
    .catch(error => {
      console.error('Error fetching joke:', error);
    });
}
\`\`\`

## With Async/Await

\`\`\`javascript
async function getJoke() {
  try {
    const response = await fetch('https://api.jokes.com/random');
    const data = await response.json();
    console.log(data.joke);
  } catch (error) {
    console.error('Error fetching joke:', error);
  }
}
\`\`\`

As you can see, the \`async/await\` version is much cleaner and avoids the nesting of \`.then()\` blocks. It's a powerful feature for handling asynchronous operations in modern JavaScript.`,
    excerpt: 'Unlock cleaner, more readable asynchronous code in JavaScript with async/await. Say goodbye to callback hell forever.',
    category: 'Programming',
    tags: ['javascript', 'async', 'es6', 'nodejs'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    views: 205
  },
  {
    title: 'MongoDB vs. SQL: Choosing the Right Database',
    content: `# MongoDB vs. SQL: Choosing the Right Database

One of the most critical decisions in application development is choosing the right database. The two main paradigms are SQL (relational) and NoSQL (non-relational).

## SQL (e.g., PostgreSQL, MySQL)

- **Structure**: Data is stored in tables with a predefined schema.
- **Pros**: ACID compliance, strong consistency, great for complex queries and transactions.
- **Cons**: Less flexible, can be difficult to scale horizontally.
- **Best for**: Financial applications, transactional systems, applications requiring complex joins.

## NoSQL (e.g., MongoDB)

- **Structure**: Data is stored in flexible formats like JSON-like documents (BSON in MongoDB).
- **Pros**: High scalability, flexible schema, fast for simple lookups.
- **Cons**: Weaker consistency guarantees, not ideal for complex transactions.
- **Best for**: Big data, content management, IoT, real-time applications.

### Example: User Data

**SQL (Users Table)**
| id | name       | email              |
|----|------------|--------------------|
| 1  | Alice      | alice@example.com  |

**MongoDB (Users Collection)**
\`\`\`json
{
  "_id": ObjectId("..."),
  "name": "Alice",
  "email": "alice@example.com",
  "preferences": { "theme": "dark" }
}
\`\`\`

The choice depends entirely on your application's needs. Analyze your data structure, query patterns, and scalability requirements before making a decision.`,
    excerpt: 'A comprehensive comparison between MongoDB and traditional SQL databases to help you choose the right one for your next project.',
    category: 'Databases',
    tags: ['mongodb', 'sql', 'database', 'backend'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    views: 180
  },
  {
    title: 'The Future of Remote Work',
    content: '# The Future of Remote Work\n\nRemote work is here to stay. What does this mean for the future of business?\n\n## The Benefits\n\n- Increased productivity\n- Better work-life balance\n- Access to a global talent pool',
    excerpt: 'Exploring the future of remote work and its impact on businesses.',
    category: 'Business',
    tags: ['remote work', 'business', 'future'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    views: 200
  },
  {
    title: '5G: The Revolution is Here',
    content: '# 5G: The Revolution is Here\n\n5G is the next generation of wireless technology. It promises to be faster and more reliable than 4G.\n\n## What to Expect\n\n- Faster download and upload speeds\n- Lower latency\n- More connected devices',
    excerpt: '5G is here and it is set to revolutionize the world.',
    category: 'Technology',
    tags: ['5g', 'technology', 'future'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    views: 250
  },
  {
    title: 'The Importance of a Balanced Diet',
    content: '# The Importance of a Balanced Diet\n\nA balanced diet is essential for good health. It provides your body with the nutrients it needs to function correctly.\n\n## Key Components\n\n- Carbohydrates\n- Proteins\n- Fats\n- Vitamins\n- Minerals',
    excerpt: 'A balanced diet is crucial for maintaining good health.',
    category: 'Health',
    tags: ['health', 'diet', 'nutrition'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    views: 300
  },
  {
    title: 'The Rise of E-Sports',
    content: '# The Rise of E-Sports\n\nE-sports have seen a massive surge in popularity in recent years. What was once a niche hobby is now a mainstream phenomenon.\n\n## The Numbers\n\n- Millions of viewers\n- Professional leagues and players\n- Huge prize pools',
    excerpt: 'E-sports are on the rise, and they are here to stay.',
    category: 'Sports',
    tags: ['e-sports', 'gaming', 'sports'],
    status: 'approved',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    views: 350
  }
];

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to create admin user', error.message);
  }
};

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    // Create admin user
    await createAdminUser();

    // Clear existing data
    console.log('Clearing existing data...');
    await Blog.deleteMany({});
    await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admin users
    
    // Create sample users
    console.log('Creating sample users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      try {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`Created user: ${user.name}`);
      } catch (error) {
        console.error(`Failed to create user: ${userData.name}`, error.message);
      }
    }
    console.log(`Created ${createdUsers.length} users`);
    
    // Create sample blogs with user references
    console.log('Creating sample blogs...');
    const createdBlogs = [];
    
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = {
        ...sampleBlogs[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      
      try {
        const blog = await Blog.create(blogData);
        createdBlogs.push(blog);
        console.log(`Created blog: ${blog.title}`);
      } catch (error) {
        console.error(`Failed to create blog: ${blogData.title}`, error.message);
      }
    }
    
    console.log(`Created ${createdBlogs.length} blogs`);
    
    console.log('Sample data seeded successfully!');
    console.log('You can now:');
    console.log('- Register a new account or login with existing users');
    console.log('- View blogs on the homepage');
    console.log('- Create new blog posts');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
