# PDFNova

PDFNova is a browser-first document tools suite focused on fast, private workflows for PDFs, images, and QR generation.

## Project Description

PDFNova provides practical file tools with a product-style UX:
- Merge, split, rotate, and compress PDFs
- Convert PDF ↔ images
- Generate QR codes
- Compress images

Core principle: for typical usage, processing happens in the browser.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS
- **PDF:** pdf-lib, pdfjs-dist
- **QR:** qrcode
- **Image compression:** browser-image-compression
- **ZIP generation:** jszip
- **Analytics ready:** Google Analytics (via `NEXT_PUBLIC_GA_ID`)

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Run dev server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Lint

```bash
npm run lint
```

## Active Tools

- `/tools/merge-pdf`
- `/tools/compress-pdf`
- `/tools/split-pdf`
- `/tools/rotate-pdf`
- `/tools/pdf-to-jpg`
- `/tools/jpg-to-pdf`
- `/tools/qr-generator`
- `/tools/compress-image`

## Suite / Discovery

- `/` homepage (product landing)
- `/tools` full tools directory

## Environment Variables

- `NEXT_PUBLIC_SITE_URL` (optional, canonical/sitemap base URL)
- `NEXT_PUBLIC_GA_ID` (optional, enables GA tracking)

## GitHub Push (manual)

After creating a GitHub repository, run:

```bash
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```

> This project does not push automatically.
