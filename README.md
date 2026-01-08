# HinglishLearn - Learning Platform

A modern learning platform designed to help students learn in simple Hinglish.

## Features

- 🎓 Multiple courses available
- 📱 Modern, responsive UI
- 🔐 Authentication with Supabase
- 🏆 XP and progress tracking
- 📊 Interactive quizzes and modules

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd hinglish-learning-platform
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` is optional for local development (the app will fall back to the current browser origin), but setting it explicitly can make OAuth/email redirects more predictable.

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Step 1: Push to GitHub

1. Initialize git (if not already done):

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a repository on GitHub and push:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:

   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `NEXT_PUBLIC_APP_URL` (optional) - Your canonical app URL (e.g., `https://your-app.vercel.app`). If not set, the app uses the current origin for OAuth redirects.

5. Click "Deploy"

### Step 3: Configure Supabase OAuth

1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to "Redirect URLs":
   - `https://your-app.vercel.app/dashboard`
   - `https://your-app.vercel.app/**`

Notes:

- If you use Vercel Preview Deployments, their URLs change per-branch/PR. You can either:
  - Add each preview URL to Supabase Redirect URLs, or
  - Use only a fixed `NEXT_PUBLIC_APP_URL` (so redirects always go to your canonical domain), and test OAuth on the production domain.

## Environment Variables

| Variable                        | Description                                                         | Required |
| ------------------------------- | ------------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                                           | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key                                         | Yes      |
| `NEXT_PUBLIC_APP_URL`           | Canonical application URL (used for OAuth/email redirects when set) | Optional |
| `UPSTASH_REDIS_REST_URL`        | Upstash Redis REST URL (enables global rate limiting on Vercel)     | Optional |
| `UPSTASH_REDIS_REST_TOKEN`      | Upstash Redis REST token (enables global rate limiting on Vercel)   | Optional |

## Project Structure

```
app/
  ├── components/       # Reusable React components
  ├── context/         # React context providers
  ├── dashboard/       # Dashboard page
  ├── login/           # Login page
  ├── signup/          # Signup page
  ├── modules/         # Course modules
  └── lib/             # Utility functions and configurations
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
