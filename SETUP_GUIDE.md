# B-OCR Setup Guide

Follow these steps to get B-OCR running locally and deployed to production.

## 📋 Prerequisites

- Node.js 18+ installed
- GitHub account
- Vercel account (free tier)
- Supabase account (free tier)
- OpenAI API key

---

## Step 1: Setup Supabase (Database & Storage)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization (or create one)
4. Fill in:
   - **Name**: `b-ocr`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

### 1.2 Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `/supabase/migrations/001_initial.sql`
4. Paste into the SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see "Success. No rows returned" ✅

### 1.3 Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Fill in:
   - **Name**: `documents`
   - **Public**: ❌ Keep it PRIVATE (unchecked)
4. Click "Create bucket"

### 1.4 Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://xxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - ⚠️ Keep this secret!

---

## Step 2: Setup OpenAI

### 2.1 Get API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Log in or create account
3. Click "Create new secret key"
4. Name it `b-ocr-key`
5. Copy the key (starts with `sk-...`) - ⚠️ You won't see it again!

### 2.2 Add Credits (if needed)

- Free trial: $5 credit (usually enough for testing)
- Add payment method for production use
- Cost: ~$0.01 per document

---

## Step 3: Configure Local Environment

### 3.1 Create `.env.local`

In your project root (`/Users/szilbendi/b-ocr/`), create a file named `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI
OPENAI_API_KEY=sk-xxx...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the `xxx` values with your actual keys from Steps 1 and 2.

---

## Step 4: Run Locally

### 4.1 Install Dependencies

```bash
cd /Users/szilbendi/b-ocr
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

### 4.3 Test the App

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the B-OCR homepage
3. For now, the app is ready but needs authentication setup

---

## Step 5: Setup Authentication (Supabase Auth)

### 5.1 Enable Email Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find "Email" provider
3. Make sure it's **enabled** ✅
4. Under **Email Templates**, you can customize the emails

### 5.2 Create Test User

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: test123456 (or whatever you want)
   - **Auto Confirm User**: ✅ Check this (for testing)
4. Click "Create user"

---

## Step 6: Deploy to GitHub

### 6.1 Initialize Git (if not done)

```bash
cd /Users/szilbendi/b-ocr
git init
git add .
git commit -m "Initial B-OCR commit"
```

### 6.2 Create GitHub Repository

```bash
# Using GitHub CLI (recommended)
gh repo create b-ocr --public --push

# OR manually:
# 1. Go to github.com/new
# 2. Name: b-ocr
# 3. Public
# 4. Don't initialize with README
# 5. Copy the commands shown
```

---

## Step 7: Deploy to Vercel

### 7.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your `b-ocr` repository from GitHub
4. Click "Import"

### 7.2 Configure Project

- **Framework Preset**: Next.js (auto-detected) ✅
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 7.3 Add Environment Variables

Click "Environment Variables" and add these:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
OPENAI_API_KEY = sk-xxx...
NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
```

⚠️ **Important**: Add these to **all environments** (Production, Preview, Development)

### 7.4 Deploy

1. Click "Deploy"
2. Wait ~2-3 minutes
3. You'll get a URL like `https://b-ocr-xxx.vercel.app`
4. Click "Visit" to see your live app! 🎉

---

## Step 8: Test the Full Flow

### 8.1 Create an Application

1. Make a POST request to `/api/applications`:

```bash
curl -X POST https://your-url.vercel.app/api/applications \
  -H "Content-Type: application/json" \
  -d '{"externalRef": "TEST-001"}'
```

2. Save the `id` from the response

### 8.2 Upload a Document

1. Use the application ID to upload a file
2. For now, you can test with curl or build a simple upload UI

---

## Step 9: Build Upload UI (Optional)

Create a simple upload page at `app/upload/page.tsx`:

```typescript
'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [appId, setAppId] = useState('')
  const [status, setStatus] = useState('')

  const handleUpload = async () => {
    if (!file || !appId) return

    setStatus('Uploading...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('applicationId', appId)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('Uploaded! Extracting...')

      // Trigger extraction
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: data.document.id }),
      })

      const extractData = await extractRes.json()
      setStatus(JSON.stringify(extractData, null, 2))
    } else {
      setStatus('Error: ' + data.error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Test</h1>

      <input
        type="text"
        placeholder="Application ID"
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload & Extract
      </button>

      <pre className="mt-4 p-4 bg-gray-100 rounded text-xs">
        {status}
      </pre>
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Ran database migration
- [ ] Created storage bucket
- [ ] Got Supabase API keys
- [ ] Got OpenAI API key
- [ ] Created `.env.local`
- [ ] Ran `npm install`
- [ ] Tested locally with `npm run dev`
- [ ] Created test user in Supabase
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Added environment variables in Vercel
- [ ] Tested production deployment

---

## 🐛 Troubleshooting

### "Unauthorized" error
- Check if you added the correct Supabase keys
- Verify the user is authenticated

### "No file provided" error
- Check the FormData is correctly formatted
- Verify the file input has a file selected

### OCR takes too long
- Try with smaller images (<5MB)
- Check Vercel function timeout (10s on hobby plan)

### OpenAI API error
- Verify your API key is correct
- Check you have credits remaining
- Look at the error message in console

---

## 🎯 Next Steps

1. Build a proper authentication UI
2. Create a dashboard to view applications
3. Add real-time progress for OCR
4. Implement field validation
5. Add export to CSV/PDF
6. Create webhook notifications

---

**Need help?** Check the README.md or create an issue on GitHub.
