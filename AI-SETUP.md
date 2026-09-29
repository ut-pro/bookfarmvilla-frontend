# BookFarmVilla AI Frontend — End-to-End Setup

## 1. Install

```bash
npm install
```

## 2. Configure local backend

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://book-farm-villa-be.onrender.com
```

For local backend testing, use your local Spring Boot URL instead, for example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Do **not** put `GEMINI_API_KEY` in the frontend.

## 3. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. AI UI

The floating **Ask AI** launcher is globally mounted from `src/app/layout.tsx`.

It is responsive:
- Desktop: floating chat window at bottom-right.
- Mobile: bottom-sheet/full-width chat window.

## 5. Backend endpoint

The frontend calls:

```text
POST ${NEXT_PUBLIC_API_BASE_URL}/api/ai/chat
```

Request includes:
- message
- recent conversation history
- latitude/longitude when Near Me is requested

The frontend expects the backend response to contain:

```json
{
  "message": "...",
  "properties": [],
  "vendors": [],
  "requirements": {},
  "locationSupported": true,
  "locationMessage": null
}
```

## 6. End-to-end test

Try:

```text
Gurgaon mein 15 people ke liye pool farmhouse 15k ke andar chahiye
```

Then:

```text
Isme BBQ available hai?
```

Then click **Near me** and allow browser location permission.

## 7. If Ask AI is not visible

Make sure you are running this AI-integrated project and not the old frontend folder.

Check that these files exist:

```text
src/components/ai/AIAssistant.tsx
src/components/ai/AIPropertyCard.tsx
```

and that `src/app/layout.tsx` contains:

```tsx
import AIAssistant from "@/components/ai/AIAssistant";
```

and:

```tsx
<AIAssistant />
```

## 8. Production frontend

For Vercel, add:

```env
NEXT_PUBLIC_API_BASE_URL=https://book-farm-villa-be.onrender.com
```

No Gemini key is required on Vercel.
