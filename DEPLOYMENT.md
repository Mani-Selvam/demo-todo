# Deployment Guide for Render

## Environment Variables Required

Set these environment variables in your Render dashboard:

```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## Render Configuration

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Root Directory**: Leave empty (deploy from root)

## Build Process

The build process will:

1. Install all dependencies
2. Build the React client
3. Start the Express server

## Common Issues Fixed

✅ Added proper start script in server/package.json
✅ Fixed duplicate static file serving
✅ Added MongoDB connection error handling
✅ Corrected React build path
✅ Updated Node.js version to 18.x (more stable for Render)

## Testing Your Deployment

1. Visit your Render URL + `/health` to test the API
2. Visit your Render URL to see the React app
3. Check Render logs for any errors

## API Endpoints

-   `GET /health` - Health check
-   `GET /api/todos` - Get all todos
-   `POST /api/todos` - Create todo
-   `PUT /api/todos/:id` - Update todo
-   `DELETE /api/todos/:id` - Delete todo
