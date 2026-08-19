# Meridian People — Employee Management

A production-style Employee Management frontend for HR operations. The app lets people teams search, filter, paginate, inspect, create, edit, and deactivate employee records, with explicit recovery paths for loading, empty, validation, and API failure states.

This repository is a self-contained assessment demo. There is no backend. A mock API implements the same contract a real HTTP service would use, so the feature can later point at a live server without rewriting the UI.

## Implemented features

- Employee directory with name search, department filter, employment-status filter, and page size
- Debounced search (300ms) with a responsive input
- List state stored in the URL and restored on refresh or back/forward navigation
- Desktop semantic table and mobile employee cards
- Accessible view, create, and edit dialogs
- One reusable, schema-validated form for create and edit
- Deactivation with a confirmation dialog, loading state, and retry
- Loading skeletons, empty directory, no-match, fetch-error, and mutation-error states
- Demo-state toolbar for slow loading, empty data, and operation failures
- Session-persisted mock data so edits survive refresh in the same browser tab
- Teal/navy HR visual treatment with department chips, status badges, and a branded header

## Latest dashboard update

Existing workflows were kept intact. **21 automated tests still pass**, covering search, filters, pagination, URL state, view/edit/create, deactivation, and error recovery.

Bugs fixed:

- Reopening **Add employee** after a successful save no longer keeps the previous values
- Close is disabled while create/edit/deactivate requests are in flight
- Failed mutations reset when the dialog actually closes, so a later open does not show a stale error on a blank form
- Filters wrap on tablet and stack on mobile instead of crowding into four columns
- Email fields ignore spellcheck, and an invalid submit focuses the first failing field

Search, filters, add, view, edit, deactivate, pagination, and demo states are unchanged in behavior.

## Technology choices

| Concern | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript (strict) | Required assessment stack with typed domain models |
| Bundler | Vite 8 | Fast local development and static production builds |
| Routing | React Router | URL search parameters for list state |
| Server state | TanStack Query | Caching, request cancellation, list invalidation |
| Forms | React Hook Form + Zod | Shared schema, field-level errors, no duplicate submit logic |
| Mock API | MSW + in-memory store | HTTP-shaped API that is replaceable later |
| Tests | Vitest + Testing Library + user-event | Behavior tests against roles and accessible names |
| Styling | Design tokens + CSS | Lightweight, no extra component library lock-in |
| Overlays | Radix Dialog and Dropdown Menu | Focus trap, Escape, and keyboard menus |
| Notifications | Sonner + `aria-live` region | Visual success feedback and screen-reader announcements |

No global client store is used. TanStack Query holds server data, the URL holds list filters, and React Hook Form holds draft input.

## Architecture summary

```text
src/
  app/                         # Shell, providers, live announcements
  components/ui/               # Buttons, fields, dialogs, badges
  features/employees/
    api/                       # Repository contract, HTTP client, query keys
    components/                # Table, cards, filters, form, dialogs
    hooks/                     # List params, queries, mutations
    schemas/                   # Shared Zod form schema
    types/                     # Domain model
    utils/                     # Names, dates, errors
    pages/                     # Employees page orchestration
    __tests__/                 # Feature tests
  mocks/                       # Seed data, store, MSW handlers, demo controls
  styles/                      # Design tokens and global CSS
  test/                        # Test setup and render helpers
```

UI components never import seed data. They talk to `employeeApi`, which uses `fetch('/api/employees')`. MSW intercepts those calls in development, tests, and the static demo.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` if you want to change mock behavior. The default is to enable the mock API.

## Commands

| Task | Command |
| --- | --- |
| Development | `npm run dev` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests | `npm run test -- --run` |
| Production build | `npm run build` |
| Preview production build | `npm run preview` |

Storybook is not included. See [Storybook](#storybook).

## Mock API

The employee repository contract lives in `src/features/employees/api/employeeApi.ts`:

- `listEmployees(params)` with search, department, status, page, page size, and abort signal
- `getEmployee(id)`
- `createEmployee(payload)`
- `updateEmployee(id, payload)`
- `deactivateEmployee(id)`

The MSW handlers in `src/mocks/handlers.ts` fulfill that contract:

- Simulated latency
- Case-insensitive name search
- Department and status filtering
- Pagination metadata
- Typed JSON errors
- Session storage so directory edits persist for the browser tab
- 42 seed employees so pagination and filters are visible

To replace the mock with a real backend:

1. Set `VITE_ENABLE_MOCKS=false`
2. Point `createHttpEmployeeApi` at the real origin
3. Remove the MSW worker from the production bundle when the backend is available

## Demo-state instructions

Open the **Demo states** control in the lower-right corner. It is intentionally separate from the HR page.

Supported scenarios:

- Normal populated data
- Slow loading
- Empty directory
- Fetch failure
- Create failure
- Edit failure
- Deactivation failure
- Reset mock data

You can also share a scenario with the `demo` query parameter:

```text
/?demo=empty
/?demo=fetch-error
/?demo=slow
```

The default state remains a realistic populated directory.

## Deployment

This is a static Vite app and can be imported directly into Vercel or Netlify.

A live demo is available at [https://employee-management-eta-one.vercel.app](https://employee-management-eta-one.vercel.app).

Source repository: [https://github.com/AbdullahYaseen01/employee-management](https://github.com/AbdullahYaseen01/employee-management).

### Vercel

1. Import the Git repository in Vercel, or run `npx vercel` from this folder
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. `vercel.json` already rewrites routes to `index.html`

### Netlify

1. Import the repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. `netlify.toml` already includes the SPA fallback

The mock service worker is served from `public/mockServiceWorker.js`, so the demo API works after deploy.

Do not commit secrets. This project has none.

## Accessibility notes

- One page heading: “Employees”
- Semantic table with a caption, column headers, and stable row keys
- Labels, `aria-invalid`, `aria-describedby`, and `aria-errormessage` on form fields
- Dialogs use Radix for focus trapping, Escape, and focus restoration
- Action menus are named “Actions for {full name}”
- Status badges include text labels, not color alone
- Loading and empty states are announced without confusing empty copy during fetch
- Success and failure feedback uses `aria-live`
- Visible `:focus-visible` outlines and 44px-class touch targets
- `prefers-reduced-motion` disables decorative animation

## Known tradeoffs

- Storybook was omitted to keep Vite 8 / TypeScript 6 / React 19 builds stable
- Dark mode is not included; the assessment asked for light mode first
- The mock store is session-scoped, not a multi-user database
- List requests are page-based, which is enough for this directory size
- Department and status options are typed constants rather than TypeScript enums because `erasableSyntaxOnly` is enabled

## Senior Touch

### If the employee API is unavailable

A senior implementation would keep the product usable without pretending a write succeeded.

- Keep the last successful cached directory visible when it is still safe to show
- Show a stale or offline indicator so HR knows the data may be behind
- Use bounded retry with backoff for transient reads, then stop
- Provide an explicit Retry control after automatic retries are exhausted
- Avoid infinite refetch loops that hammer a failing service
- Preserve unsaved form drafts in the form state until the user discards them
- Never show a success toast for a write that did not commit
- Send idempotency keys on create, update, and deactivate when the backend supports them
- Queue offline writes only after product and backend teams define conflict resolution
- Emit structured logs/metrics for failure type, latency, and retry count
- Distinguish network, authorization, validation, conflict, and server errors in the UI
- Apply request timeouts and cancellation when filters change
- Agree recovery behavior with product and backend: read-only mode, cached fallback, or hard stop

This demo follows the same principles at a smaller scale: cached rows stay on screen when a refresh fails, mutation errors stay in the dialog that caused them, and retry is always explicit.

### If the company has 100,000+ employees

The current UI already assumes server-side filtering and pagination. At that scale the backend and query design become the product:

- Keep filtering, search, and pagination on the server
- Index name, department, and status for directory queries
- Debounce search and cancel in-flight list requests
- Prefer cursor/keyset pagination for stable large result sets
- Use a stable sort, typically `lastName, firstName, id`
- Cache pages briefly, with small page sizes (10–25)
- Never download the full employee population to the browser
- Continue storing filters in the URL so views are shareable
- Virtualize the table only if a single page still renders thousands of rows
- Return department and status facet counts from the backend
- Rate-limit search and export endpoints
- Record search latency and empty-result rates for observability
- Run CSV/XLSX export as an asynchronous job, not a browser download of the full set
- Enforce access control and audit logs for view, edit, and deactivate
- Use optimistic updates only where rollback is reliable
- Set performance budgets and watch them in production

The mock API in this repository is the local stand-in for that server contract, not a client-side substitute for a 100k-row database.
