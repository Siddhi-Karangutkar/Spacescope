# How to Run SpaceScope

This project consists of two parts: a **Server** (Node.js/Express) and a **Client** (React + Vite). You need to run both for the application to work correctly.

## Prerequisites
- Node.js installed on your machine.
- NPM (Node Package Manager) included with Node.js.

## 1. Start the Server

1. Open a terminal.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node index.js
   ```
   You should see: `Server is running on port 5000`

## 2. Start the Client

1. Open a **new** terminal window (keep the server running in the first one).
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the link shown in the terminal (usually `http://localhost:5173`) in your browser.

## Troubleshoot
- **API Issues**: Ensure the server is running on port 5000. The client expects the API at `http://localhost:5000/api`.
- **CORS Errors**: If you see CORS errors, ensure the server is running and `cors` is enabled (it is by default in `server/index.js`).
