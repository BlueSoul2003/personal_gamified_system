---
description: How to deploy the Quantum Nexus Player Dashboard to production
---

# Deploy Quantum Nexus to Production

This workflow takes you from local dev to a fully live, cloud-synced app. Follow each step in order.

---

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `quantum-nexus` (or any name you like)
3. Set it to **Public** or **Private** (your choice)
4. Do NOT initialize with README (we already have code)
5. Click **Create repository**
6. Copy the remote URL (it looks like `https://github.com/YOUR_USERNAME/quantum-nexus.git`)
7. Run these commands in the `quantum-nexus` folder:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/quantum-nexus.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up / log in (use your GitHub account)
2. Click **New Project**  
3. Name it `quantum-nexus`, choose a database password, select the nearest region (e.g., Singapore)
4. Wait ~2 minutes for the project to provision
5. Go to **Project Settings → API** (left sidebar)
6. Copy these two values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public key** (the long string under `anon key`)
7. Open the file `.env.local` in the `quantum-nexus` folder and paste them:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-key-here
```

---

## Step 3: Create the Database Table in Supabase

1. In the Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query** and paste this SQL:

```sql
CREATE TABLE player_state (
    id TEXT PRIMARY KEY DEFAULT 'default_player',
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    max_xp INTEGER DEFAULT 100,
    gold INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 80,
    max_energy INTEGER DEFAULT 100,
    quests JSONB DEFAULT '[]'::jsonb,
    grimoire JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert a default row
INSERT INTO player_state (id) VALUES ('default_player');

-- Enable real-time sync on this table
ALTER PUBLICATION supabase_realtime ADD TABLE player_state;
```

3. Click **Run** (the green play button)
4. You should see "Success" — your database table is ready!

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in with your **GitHub account**
2. Click **Add New... → Project**
3. Find and select your `quantum-nexus` repository
4. Before clicking Deploy, expand **Environment Variables**
5. Add these two (copy from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
6. Click **Deploy**
7. Wait ~1-2 minutes. Vercel will give you a live URL like `quantum-nexus.vercel.app`

🎉 **Your app is now live and accessible from any device!**

---

## Step 5: Install as PWA on Mobile (Optional)

### iPhone / iPad
1. Open your Vercel URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — it now looks like a native app!

### Android
1. Open your Vercel URL in **Chrome**
2. Tap the **three-dot menu** (⋮)
3. Tap **"Install app"** or **"Add to Home screen"**

---

## Updating Your App

After any code changes, simply run:
```powershell
git add -A
git commit -m "your change description"
git push
```
Vercel automatically deploys every push within ~60 seconds.
