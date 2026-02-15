# Deployment Guide for Render

This guide outlines the steps to deploy your BellCrop Event Management Application to Render as two separate services: a backend Web Service and a frontend Static Site.

## Prerequisites

-   A GitHub/GitLab/Bitbucket repository with your project code pushed to it.
-   A Render account.

---

## Part 1: Deploying the Backend (Web Service)

1.  **Create a New Web Service**:
    -   Log in to your Render dashboard.
    -   Click the **"New +"** button and select **"Web Service"**.
    -   Connect your repository.

2.  **Configure the Service**:
    -   **Name**: Give it a name (e.g., `bellcrop-backend`).
    -   **Root Directory**: Set this to `server`. **(Crucial Step)**
    -   **Environment**: `Node`
    -   **Region**: Select a region close to you.
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js` (or `npm start`)
    -   **Instance Type**: `Free` (if applicable) or `Starter`.

3.  **Environment Variables**:
    -   Click on the **"Environment"** tab or scroll down to the "Environment Variables" section.
    -   Add the following keys and values (copy from your local `.env` file):
        -   `MONGO_URI`: Your MongoDB connection string.
        -   `JWT_SECRET`: Your JWT secret key.
        -   `NODE_ENV`: `production`
        -   `PORT`: `10000` (Render sets this automatically, but good to know).

4.  **Deploy**:
    -   Click **"Create Web Service"**.
    -   Wait for the deployment to finish.
    -   **Copy the URL**: Once deployed, you will get a URL like `https://bellcrop-backend.onrender.com`.  **Save this URL**, you will need it for the frontend.

---

## Part 2: Deploying the Frontend (Static Site)

1.  **Create a New Static Site**:
    -   In your Render dashboard, click **"New +"** and select **"Static Site"**.
    -   Connect the **same repository** as before.

2.  **Configure the Service**:
    -   **Name**: Give it a name (e.g., `bellcrop-frontend`).
    -   **Root Directory**: Set this to `client`. **(Crucial Step)**
    -   **Build Command**: `npm install && npm run build`
        -   *Note*: Ensure this installs dependencies *inside* the client folder. If Render executes this from the client root, `npm install` works.
    -   **Publish Directory**: `dist`
        -   (Vite builds to `dist` by default).

3.  **Environment Variables**:
    -   Click on the **"Environment"** tab.
    -   Add the following variable:
        -   `VITE_API_BASE_URL`: Paste the **Backend URL** from Part 1 (e.g., `https://bellcrop-backend.onrender.com`).
        -   *Important*: Do **not** add a trailing slash `/` at the end if your code appends `/api/...`.
        -   *Note*: Vite exposes variables starting with `VITE_` to the browser at build time.

4.  **Deploy**:
    -   Click **"Create Static Site"**.
    -   Wait for the build to finish.

---

## Part 3: Final Verification

1.  **Visit your Frontend URL**: (e.g., `https://bellcrop-frontend.onrender.com`).
2.  **Test Functionality**:
    -   Try to **Register/Login**. If it works, your frontend is successfully talking to the backend.
    -   If you see "Network Error" or 404s on API calls:
        -   Check the `VITE_API_BASE_URL` in the frontend service settings.
        -   Check the Render logs for the backend service to ensure it's running without errors.
        -   Check the Browser Console (F12) -> Network tab to see where the requests are going.

## Troubleshooting

-   **CORS Issues**: If you see CORS errors in the browser console:
    -   Your backend `server.js` uses `app.use(cors())`, which allows all origins by default. This is good for testing but check if it's restricted in production code.
-   **White Screen on Frontend**:
    -   Ensure your **Publish Directory** is set to `dist`.
    -   Ensure your **Build Command** ran successfully.
