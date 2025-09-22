# Ocean Notes – Nuxt 3 Frontend

A modern, minimalist notes application with an "Ocean Professional" theme (blue + amber accents). Users can create, edit, delete, and view notes. The app integrates with a backend API and gracefully falls back to local storage (IndexedDB) if the API is unavailable.

## Features
- Single-page experience with notes list, search, and a modal editor
- Create, edit, delete notes
- Smooth transitions, rounded corners, subtle shadows
- Ocean Professional palette:
  - primary: `#2563EB` (blue)
  - secondary: `#F59E0B` (amber)
  - error: `#EF4444`
- API-first with local (IndexedDB) fallback for offline mode

## Getting Started

### Install
```bash
npm install
# or: pnpm install / yarn install / bun install
```

### Run Dev Server
```bash
npm run dev
# http://localhost:3000
```

### Configure API
Set the public API base URL (optional, defaults to `/api`):
- Env var: `NUXT_PUBLIC_API_BASE=https://your-backend.example.com`

### Build and Preview
```bash
npm run build
npm run preview
```

## Project Structure
- `pages/index.vue` – main page with list and modal editor
- `components/` – `AppShell`, `NotesList`, `NoteModal`
- `composables/useNotes.ts` – state + CRUD (API with local fallback)
- `utils/api.ts` – API helper
- `types/note.ts` – TypeScript types
- `assets/css/main.css` – theme and styles

## Backend Contract
Expected endpoints (JSON):
- `GET /notes` -> `Note[]`
- `POST /notes` body: `{ title, content }` -> `Note`
- `PUT /notes/:id` body: `{ title, content }` -> `Note`
- `DELETE /notes/:id` -> `204`

If these are unavailable, the app falls back to IndexedDB.

## Environment Variables
Create `.env` or provide through deployment:
- `NUXT_PUBLIC_API_BASE` – base URL for the notes API (optional; defaults to `/api`)

## License
MIT
