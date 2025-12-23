# B-OCR - Loan Document Extractor

AI-powered document extraction system for loan applications using Next.js, Supabase, and OpenAI.

## Features

- 📄 Upload PDF/Image documents
- 🔍 Automatic OCR with Tesseract.js
- 🤖 AI-powered field extraction with GPT-4
- 📊 Multi-document support per application
- 🔒 Secure user authentication
- 💾 Free tier deployment (Vercel + Supabase)

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (Postgres + Storage)
- **Authentication**: Supabase Auth
- **OCR**: Tesseract.js (client-side)
- **AI**: OpenAI GPT-4o/GPT-4o-mini
- **Deployment**: Vercel

## Quick Start

### 1. Prerequisites

- Node.js 18+
- npm/pnpm
- Supabase account (free)
- OpenAI API key

### 2. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `/supabase/migrations/001_initial.sql`
3. Create storage bucket named `documents` (Settings → Storage → New Bucket → Make Private)
4. Copy your project URL and anon key

### 3. Install Dependencies

```bash
cd b-ocr
npm install
```

### 4. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
b-ocr/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx             # Applications list
│   └── api/
│       ├── upload/route.ts      # File upload
│       ├── extract/route.ts     # OCR + AI extraction
│       └── applications/route.ts # CRUD
├── components/
│   ├── upload-zone.tsx          # Drag & drop upload
│   └── extracted-data.tsx       # Display results
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   ├── ocr/tesseract.ts         # OCR logic
│   └── extraction/
│       ├── openai.ts            # GPT extraction
│       └── prompts.ts           # Extraction prompts
└── supabase/migrations/
    └── 001_initial.sql          # Database schema
```

## Document Types Supported

- Driver's License / ID Card
- Bank Statements
- Pay Stubs
- Tax Returns (W2, 1099, 1040)
- Utility Bills
- Employment Letters

## Key Files to Implement

See the `docs/` folder for complete implementation of:

1. **Supabase Clients** (`lib/supabase/`)
2. **OCR Logic** (`lib/ocr/tesseract.ts`)
3. **OpenAI Extraction** (`lib/extraction/`)
4. **API Routes** (`app/api/`)
5. **UI Components** (`components/`)
6. **Main Pages** (`app/`)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create b-ocr --public --push
```

Then connect to Vercel dashboard.

## Cost Estimation

| Service | Free Tier | Usage Cost |
|---------|-----------|------------|
| Vercel | 100GB bandwidth | $0 |
| Supabase | 500MB DB + 1GB storage | $0 |
| Tesseract.js | Unlimited | $0 |
| OpenAI GPT-4o-mini | - | ~$0.0001/doc |
| OpenAI GPT-4o | - | ~$0.01/doc |

**Estimated: $1/100 documents**

## Development Workflow

1. **Create Application**: POST `/api/applications`
2. **Upload Document**: POST `/api/upload` with multipart/form-data
3. **Extract Data**: POST `/api/extract` with document ID
4. **View Results**: GET `/api/applications/:id`

## Security

- Row Level Security (RLS) enabled in Supabase
- Users can only access their own data
- File uploads stored in private Supabase bucket
- API routes protected with authentication

## Limitations (Free Tier)

- Vercel: 10s serverless timeout
- Supabase: 500MB database, 1GB storage
- File size: Recommended <10MB per file

## Troubleshooting

**"Unauthorized" error**: Check Supabase auth is working
**OCR timeout**: Try smaller images or reduce quality
**Build fails**: Run `npm install` and check Node version

## Next Steps

1. Add user registration/login UI
2. Implement validation rules for extracted fields
3. Add export to CSV/Excel
4. Create webhook for status updates
5. Add batch processing

## License

MIT

## Support

For issues, open a GitHub issue or contact support.

---

**Made with ❤️ using Next.js, Supabase, and OpenAI**
