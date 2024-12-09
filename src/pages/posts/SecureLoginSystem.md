---
title: Building a Secure Login System with Astro
author: Astro Learner
description: "Learn how to create a secure and scalable authentication system in Astro."
image:
    url: "/assets/security.webp"
    alt: "A lock symbol representing security in web development."
pubDate: 2022-07-29
tags: ["astro", "security", "authentication", "web development"]
---

Authentication is a critical aspect of any web application, and it can be challenging to implement it securely. In this post, I’ll guide you through building a secure login system in Astro using JSON Web Tokens (JWT) and best practices for protecting user data.

## Setting Up the Project

1. **Initialize the Astro Project**  
   Create a new Astro project:  
   ```bash
   npx create-astro@latest secure-login
   cd secure-login
   npm install
   ```

2. **Add Dependencies**  
   Install the required packages for authentication:  
   ```bash
   npm install bcrypt jsonwebtoken dotenv
   ```

3. **Configure Environment Variables**  
   Create a `.env` file for sensitive data like your JWT secret:  
   ```plaintext
   JWT_SECRET=your-strong-secret
   ```

## Building the Backend

Astro allows you to create server-side API routes for handling authentication logic. Here’s how:

1. **Hashing User Passwords**  
   Use `bcrypt` to securely hash passwords before storing them in the database.  

   Example function in `src/utils/auth.js`:
   ```javascript
   import bcrypt from 'bcrypt';

   export async function hashPassword(password) {
       const saltRounds = 10;
       return bcrypt.hash(password, saltRounds);
   }

   export async function comparePasswords(password, hash) {
       return bcrypt.compare(password, hash);
   }
   ```

2. **Generating JWT Tokens**  
   Use `jsonwebtoken` to generate tokens for authenticated users:  
   ```javascript
   import jwt from 'jsonwebtoken';

   export function generateToken(user) {
       return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
   }
   ```

3. **API Route for Login**  
   Create a new API route to handle login requests in `src/pages/api/login.js`:
   ```javascript
   import { comparePasswords } from '../../utils/auth';
   import { generateToken } from '../../utils/auth';

   const mockUser = {
       id: 1,
       username: 'testuser',
       passwordHash: '$2b$10$examplehash1234' // Example hash for "password123"
   };

   export async function post({ request }) {
       const { username, password } = await request.json();

       if (username === mockUser.username && await comparePasswords(password, mockUser.passwordHash)) {
           const token = generateToken(mockUser);
           return new Response(JSON.stringify({ token }), { headers: { 'Content-Type': 'application/json' } });
       }

       return new Response('Invalid credentials', { status: 401 });
   }
   ```

## Creating the Frontend

Now that the backend is set up, let’s build a simple login form in Astro:

1. **Login Page**  
   Create a new file `src/pages/login.astro`:  
   ```astro
   ---
   import { useState } from 'react';

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');

   async function handleSubmit(event) {
       event.preventDefault();
       const response = await fetch('/api/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ username, password })
       });

       if (response.ok) {
           const { token } = await response.json();
           localStorage.setItem('authToken', token);
           setMessage('Login successful!');
       } else {
           setMessage('Invalid username or password.');
       }
   }
   ---
   <form onSubmit={handleSubmit}>
       <label>
           Username:
           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
       </label>
       <label>
           Password:
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
       </label>
       <button type="submit">Login</button>
   </form>
   <p>{message}</p>
   ```

2. **Securing Routes**  
   Add a middleware or logic to check JWT tokens on protected routes to prevent unauthorized access.

## Best Practices

- **Use HTTPS**: Always secure your site with HTTPS to encrypt data in transit.
- **Implement Rate Limiting**: Protect your login API against brute force attacks.
- **Use a Secure Database**: Store user data in a secure database and ensure proper encryption.

## Conclusion

With these steps, you’ve built a secure login system in Astro. While this tutorial uses mock data for simplicity, integrating a real database like PostgreSQL or MongoDB is the next logical step. Security is an ongoing process, so stay updated on best practices to protect your users and application.

This guide not only explains how to build a secure login system but also incorporates real-world best practices to make the application robust and reliable. Let me know if you'd like more tutorials like this one!