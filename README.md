# RescuEats AI

A Next.js app that helps reduce food waste by analyzing an uploaded fridge/receipt image, estimating ecological savings, and generating zero-waste cooking recipes.

## Features

- Upload an image (fridge interior or grocery receipt)
- Multi-modal analysis via Google Gemini
- Structured JSON output rendered into:
  - Ecological savings (`carbonSavedKg`, `waterSavedLiters` + headline)
  - Detected items + shelf-life window
  - Exactly **2** recipes
  - Compost / scrap upcycling guidance

## Tech Stack

- Next.js (App Router)
- TailwindCSS
- `@google/generative-ai`

## Prerequisites

- Node.js installed
- A Google Gemini API key

## Setup (Local)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a file named **`.env.local`** in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> The server code reads `process.env.GEMINI_API_KEY`.

### 3) Run the dev server

```bash
npm run dev
```

Open the app in your browser:

- http://localhost:3000

If port 3000 is already in use, Next may fall back to another port (e.g., 3001). Use the URL printed in the terminal.

## API Endpoint

- **POST** `/api/analyze-waste`

Body:

```json
{
  "image": "data:image/png;base64,...."
}
```

The route returns JSON matching the UI schema.

## Notes on Gemini Model IDs

The app uses the Gemini models available in your account for `generateContent()`.

If you previously saw errors like:

- `gemini-1.5-flash is not found for API version v1beta or not supported for generateContent`

…it is handled by using supported fallback model IDs.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — run production server
- `npm run lint` — lint

## Troubleshooting

### Port confusion (3000 vs 3001)

If you have multiple dev servers running, you may see different ports. Stop extra servers, then rerun `npm run dev`.

### Invalid image format

The endpoint expects a **data URI**: `data:image/<type>;base64,<base64>`.

