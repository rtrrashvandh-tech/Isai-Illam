# Development Guide

## Running the Application

### Option 1: Using Netlify Dev (Recommended)
This runs both the frontend and Netlify functions:

```bash
npm run start
# or
npm run netlify:dev
# or (if netlify-cli is installed globally)
netlify dev
```

**Note:** The first time you run this, it will automatically install `netlify-cli` via npx if it's not already installed.

The app will be available at `http://localhost:8888` (or the port shown in terminal).

### Option 2: Using Vite Dev (Frontend Only)
If you only want to run the frontend:

```bash
npm run dev
```

**Note:** When using `vite dev`, Netlify functions are NOT available. API calls to `/api/*` will fail unless you:
- Run the backend server separately on port 3000, OR
- Use `netlify dev` instead

### Option 3: Running Backend Separately
To run the Express backend server:

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:3000` and handle requests to `/api/register`.

## Troubleshooting 404 Errors

If you see "Registration failed with status 404":

1. **Check which dev server you're using:**
   - `npm run dev` (Vite) - Functions NOT available
   - `npm run start` (Netlify Dev) - Functions available ✅

2. **Verify the function is running:**
   - Check terminal for "Functions server is running"
   - Try accessing `http://localhost:8888/.netlify/functions/api` (should show API info)

3. **Check the browser console:**
   - Look for the actual request URL
   - Check if it's being redirected correctly

4. **Check Netlify function logs:**
   - Look in terminal for "=== Request Details ===" logs
   - This shows what path the function received

## Environment Variables

Create a `.env` file in the root directory:

```env
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
EMAIL_FROM=rtrrashavndh@gmail.com
```

For Netlify deployment, set these in Netlify Dashboard → Site settings → Environment variables.

