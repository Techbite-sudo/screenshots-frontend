# Website Screenshot Tool Frontend

This is the frontend for the Website Screenshot Tool, built with Next.js 15 and shadcn/ui. It allows users to enter a website URL, capture screenshots of all internal pages, and download them as a ZIP file. The frontend communicates with a FastAPI backend.

## Features
- Beautiful UI with shadcn components
- URL input and screenshot capture
- Displays screenshots as cards
- Download all screenshots as a ZIP
- Toast notifications for user feedback

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```
Replace with your actual backend URL (no trailing slash).

### 3. Configure image domains
Edit `next.config.js` and add your backend domain to the `images.domains` array:
```js
images: {
  domains: ['your-backend-domain.com'],
},
```

### 4. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

### 6. Deploy
Deploy to Vercel, Netlify, or your preferred host. Set the `NEXT_PUBLIC_BACKEND_URL` environment variable in your deployment settings.

## Notes
- The backend must be deployed and accessible from the frontend.
- Update the backend URL and image domain as needed for your deployment.
