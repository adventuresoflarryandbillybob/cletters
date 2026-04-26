# Love Letters App - Setup & Deployment Guide

## Quick Start

### Local Development

1. **Start the dev server:**
```bash
npm run dev
```

2. **Access the app:**
   - Reader: http://localhost:3000
   - Admin: http://localhost:3000/admin

3. **Admin credentials:**
   - Password: `loveletter` (from `.env.local`)

### Creating Your First Letter

1. Go to http://localhost:3000/admin
2. Enter password: `loveletter`
3. Fill in the form:
   - **Date:** `04/26/2026` (MM/DD/YYYY format)
   - **Title:** (optional) e.g., "My Darling"
   - **Content:** Your love letter text
4. Click "Create"
5. Return to http://localhost:3000 to view the letter

## Environment Variables

Edit `.env.local`:

```env
# The password to access /admin
ADMIN_PASSWORD=loveletter

# Session encryption key (change for production!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

> ⚠️ For production, use strong random values for both variables

## Database

The app automatically creates `data/letters.db` on first run. No setup required!

The database file persists between server restarts, so your letters are safe.

## Deployment to Render.com (Free!)

Render has a free tier that works perfectly for this app - no credit card required!

### 1. Push code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Create Render account and connect GitHub
- Go to [render.com](https://render.com)
- Sign up for free (no credit card needed)
- Authorize your GitHub account

### 3. Create a new Web Service
- Click "New +" → "Web Service"
- Select your `c_letters` repository
- Click "Connect"

### 4. Configure settings
- **Name:** `love-letters` (or your preferred name)
- **Environment:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free

### 5. Add environment variables
Click "Advanced" and add these environment variables:
- `ADMIN_PASSWORD` = your secure password (e.g., `myadminpass123`)
- `SESSION_SECRET` = generate a random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 6. Deploy
Click "Create Web Service" and wait 2-3 minutes for the first deployment!

Your app will be live at: `https://love-letters.onrender.com` (or whatever name you chose)

### Important: Free Tier Details
- ✅ Completely free
- ✅ HTTPS included
- ✅ SQLite database persists across restarts
- ⚠️ Service spins down after 15 minutes of inactivity (wakes up on first request in ~30 seconds)

### Auto-Deploy on Git Push
Once connected, Render automatically redeploys whenever you push to GitHub! Just:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

And your updates will be live in 2-3 minutes.

## Testing

### Test the API
```bash
# Get all letters (public)
curl http://localhost:3000/api/letters

# Login as admin
curl -X POST http://localhost:3000/api/letters \
  -H "Content-Type: application/json" \
  -d '{"password":"loveletter"}' \
  -c cookies.txt

# Create a letter (requires session)
curl -X POST http://localhost:3000/api/letters \
  -H "Content-Type: application/json" \
  -d '{"date":"04/26/2026","title":"Test","content":"Test letter"}' \
  -b cookies.txt
```

## Troubleshooting

### Database locked error
If you see "database is locked", make sure only one process is running the app.

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Changes not showing on Render
Render automatically redeploys on git push. Wait 2-3 minutes for deployment to complete. You can check the deployment status in your Render dashboard.

## File Structure Reference

```
c_letters/
├── app/
│   ├── page.tsx                 # Reader (/)
│   ├── admin/page.tsx           # Admin (/admin)
│   ├── api/
│   │   ├── letters/
│   │   │   ├── route.ts         # POST create, GET list
│   │   │   └── [id]/route.ts    # GET one, DELETE
│   │   └── auth/
│   │       ├── login/           # POST login
│   │       ├── logout/          # POST logout
│   │       └── auth-check/      # GET session check
│   └── globals.css
├── components/
│   ├── HamburgerMenu.tsx        # Sidebar nav
│   ├── LetterView.tsx           # Letter display
│   └── AdminLetterForm.tsx      # Create/edit form
├── lib/
│   ├── db.ts                    # Database layer
│   └── session.ts               # Auth encryption
├── data/
│   └── letters.db               # SQLite database
├── .env.local                   # Config (don't commit!)
├── package.json
└── tailwind.config.js           # Styling
```

## Security Notes

- The app is designed for a single author (you) and multiple readers
- All read endpoints (`GET /api/letters`) are public
- All write endpoints (`POST/DELETE /api/letters`) require valid admin session
- Session cookies are encrypted with `iron-session`
- Date format is validated to MM/DD/YYYY
- Render automatically serves over HTTPS (no configuration needed)

## Next Steps

1. Change `ADMIN_PASSWORD` in `.env.local` to something only you know
2. Deploy to Render.com using the guide above
3. Share the reader link (e.g., `https://love-letters.onrender.com`) with your loved one
4. Start writing love letters! 💕
