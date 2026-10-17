# Admin Panel

An independent admin panel at `/admin`, built on top of the existing public site
without modifying its routes, components, or styling.

## Routes

- `/admin/login` — public login page (email + password against the existing
  `POST /api/auth/login`)
- `/admin` — dashboard (live counts, no mock data)
- `/admin/farmhouses`, `/admin/villas`, `/admin/wedding-lawns` — all three are
  the same `Property` entity filtered by `type`; they share one component
  (`PropertyManager.tsx`) so there's no triplicated CRUD logic
- `/admin/vendors` — vendor management
- `/admin/bookings` — booking transactions (filterable by type/status/payment,
  CSV export)
- `/admin/enquiries` — leads, with status tabs (All/New/Replied/Converted/Closed)
- `/admin/partners` — partner ("list with us") requests — view + delete only,
  per spec (no admin-side create/edit for partner requests)
- `/admin/reviews` — paginated/searchable review management; create, edit and delete
- `/admin/blog` — paginated Blog management; create, edit, delete and change status
  posts, with sanitized HTML content in the rich text editor

## Auth

- JWT from `POST /api/auth/login` is stored in `localStorage` (`bfv_admin_token`),
  alongside basic user info (`bfv_admin_user`) for display in the header.
- There is no refresh token — the existing login API doesn't issue one.
- Every `/admin/*` route except `/admin/login` is wrapped by `AdminAuthGuard`
  (via the `(dashboard)` route group's layout), which checks the token's
  expiry (decoded client-side, no extra library) on mount and redirects to
  `/admin/login` if missing/expired.
- A 401 response from any API call also clears the token and redirects —
  handled once, centrally, in `src/lib/admin-api.ts`.

## Centralized API handling

- `src/lib/admin-api.ts` — every authenticated admin request goes through
  `adminApiFetch()`, which attaches `Authorization: Bearer <token>`
  automatically. No component calls `fetch()` directly.
- `src/lib/public-api.ts` — the two public, unauthenticated submissions
  (`POST /api/leads`, `POST /api/partners`) used by the existing
  `CallbackForm.tsx` and `PartnerEnquiryModal.tsx` components, which were
  previously mocked with `console.log` and are now wired to the real backend.

## Config

Uses the existing `NEXT_PUBLIC_API_BASE_URL` env var (already present in
`.env.local`) — no new environment variable was introduced.

## Explicitly excluded (per spec)

Users, Categories, and Banners & Offers sections are not built.

## Reviews and Blog API

- Reviews use authenticated admin endpoints for paginated/searchable listing,
  create, update, and delete. The create/edit form searches existing properties
  and vendors by name using their keyword-filtered list APIs.
- Blog status can be changed among `DRAFT`, `PUBLISHED`, and `ARCHIVED`; moving
  a published post back to `DRAFT` unpublishes it. Deletion is separate.
- Blog HTML is sanitized in both the frontend and backend before it is saved
  or returned by Blog detail endpoints.
