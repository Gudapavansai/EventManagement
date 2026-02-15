# Deployment Guide for Vercel

This repository is configured for deployment on Vercel as a full-stack application (React Frontend + Express Backend Serverless Functions).

## Pre-requisites

- A Vercel account.
- `vercel` CLI installed (optional, but recommended).

## Deployment Steps

1.  **Environment Variables**:
    You must set the following environment variables in your Vercel Project Settings:
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: Your JWT secret key.
    - `NODE_ENV`: `production` (optional, default).
    - `VITE_API_BASE_URL`: Set this to an **empty string** (literally leave the value blank or set to `/`). This ensures the frontend uses relative paths to reach the backend on the same domain.

2.  **Deploy using Vercel CLI**:
    Run the following command in the root directory:
    ```bash
    vercel
    ```
    - Follow the prompts.
    - Use the default settings (it should detect `vercel.json`).

3.  **Deploy using Git Integration**:
    - Push this code to GitHub/GitLab/Bitbucket.
    - Import the repository in Vercel.
    - Vercel should automatically detect the `vercel.json` configuration.
    - **Important**: In the "Environment Variables" section during import, add the variables listed above.

## Configuration Details

- **Frontend**: The `client` folder is built using Vite and served as static assets.
- **Backend**: The `server/server.js` file is deployed as a Serverless Function handling all requests to `/api/*`.
- **Routing**: `vercel.json` handles routing. All requests starting with `/api/` are directed to the backend. All other requests are served by the frontend (with SPA fallback to `index.html`).

## Troubleshooting

- **404 on API**: Ensure your `VITE_API_BASE_URL` is empty or `/` in Vercel environment variables.
- **Database Connection**: Ensure your MongoDB Atlas IP Access List includes `0.0.0.0/0` (allow from anywhere) since Vercel IPs are dynamic.
