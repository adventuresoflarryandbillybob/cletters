# Love Letters

A beautiful full-stack web app for creating and sharing love letters. Readers can browse letters sorted by date, while the author can create and manage letters from a password-protected admin panel.

## Features

### For Readers
- 📖 Browse love letters in a beautiful, romantic interface
- 📅 Filter letters by date using the hamburger menu
- 💕 Responsive design that works on all devices
- ✨ Elegant serif fonts and parchment-inspired styling

### For Author
- 🔐 Password-protected admin panel
- ✍️ Create new letters with custom dates (MM/DD/YYYY format)
- 📝 Add optional titles to letters
- 🗑️ Delete letters

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-secret-session-key
```

3. Start the development server:
```bash
npm run dev
```

4. Visit `http://localhost:3000` to see the reader page
5. Visit `http://localhost:3000/admin` to access the admin panel

## Tech Stack

- **Next.js 14** — Full-stack React framework
- **SQLite** — File-based database
- **Tailwind CSS** — Styling
- **iron-session** — Secure session management
- **date-fns** — Date formatting and parsing
- **better-sqlite3** — SQLite driver

## Deployment

### Render.com (Free & Recommended)

Render has a generous free tier perfect for this app!

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up (free, no credit card needed)
3. Click "New +" → "Web Service"
4. Connect your GitHub account and select your repository

**Step 3: Configure Deployment**
- **Name:** `love-letters` (or any name)
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Step 4: Set Environment Variables**
1. In Render dashboard, go to "Environment"
2. Add two variables:
   - `ADMIN_PASSWORD` = your secure password
   - `SESSION_SECRET` = run this to generate a random string:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

**Step 5: Deploy**
Click "Create Web Service" and wait 2-3 minutes for deployment to complete!

Your app will be live at: `https://your-app-name.onrender.com`

**Free Tier Details:**
- ✅ Always free
- ✅ Persistent storage for SQLite database
- ✅ Auto-deploys on git push
- ✅ HTTPS included
- Note: Service spins down after 15 mins of inactivity, wakes up on first request (takes ~30 seconds)

### Other Options

**Vercel**
⚠️ Not recommended - serverless doesn't support SQLite file writes

**Local + ngrok**
Keep running on your computer and share via `ngrok http 3000` for a public URL

## Project Structure

```
love-letters/
├── app/
│   ├── page.tsx                    # Reader page
│   ├── admin/page.tsx              # Admin dashboard
│   ├── api/letters/                # Letter CRUD endpoints
│   └── api/auth/                   # Authentication endpoints
├── components/
│   ├── HamburgerMenu.tsx           # Sidebar navigation
│   ├── LetterView.tsx              # Letter display
│   └── AdminLetterForm.tsx         # Create/edit form
├── lib/
│   ├── db.ts                       # Database operations
│   └── session.ts                  # Session management
└── data/
    └── letters.db                  # SQLite database (auto-created)
```

## Usage

### Creating a Letter

1. Go to `/admin` and enter your password
2. Fill in the date in `MM/DD/YYYY` format
3. (Optional) Add a title
4. Write your letter content
5. Click "Create"

### Deleting a Letter

1. Go to `/admin`
2. Find the letter in the "Existing Letters" list
3. Click "Delete" and confirm

### Reading Letters

1. Go to `/` (the homepage)
2. Click the hamburger menu in the top-left
3. Select any letter to view it
4. Letters are sorted by date (most recent first)

## Database

The app uses SQLite, which stores data in `data/letters.db`. The database is automatically initialized on first run with the required table structure.

Letters are stored with:
- `id` — Unique identifier
- `date` — Date in MM/DD/YYYY format
- `title` — Optional letter title
- `content` — Full letter text
- `created_at` — Creation timestamp

## Security

- Admin password is checked against the env variable `ADMIN_PASSWORD`
- Sessions are encrypted using `iron-session` with `SESSION_SECRET`
- Read endpoints are public (no auth required)
- Write/delete endpoints require valid admin session
- Password is case-sensitive

⚠️ For production use, ensure:
- `ADMIN_PASSWORD` is a strong, unique password
- `SESSION_SECRET` is a long, random string
- The site is served over HTTPS (especially important for production)
- `.env.local` is never committed to version control

## License

Created with ❤️
