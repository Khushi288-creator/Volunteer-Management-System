# Design Document — Opportunity & Application System (Phase 5A)

## Overview

Phase 5A adds an Opportunity & Application System to the Volunteer Management Platform. Admins can post and manage opportunities; authenticated volunteers can browse open opportunities, submit applications with a cover letter and CV (PDF), and track their application statuses.

The implementation extends the existing MERN stack without introducing new architectural layers. Two new Mongoose models (`Opportunity`, `Application`) are added. New controller files and route handlers are wired into the existing `adminRoutes.js` and `volunteerRoutes.js` files. Five new React page components and two shared UI components are added, following all existing glass-card patterns and CSS conventions. Multer is the only new npm dependency.

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Add routes to existing route files (no new route files) | Matches existing pattern; avoids mounting new prefixes in `server.js` |
| Disk storage via Multer (no cloud) | Explicitly confirmed for this phase; simple, no external dependencies |
| Static file serving at `/uploads` in `server.js` | Standard Express static middleware; CVs immediately accessible via URL |
| Unique compound index `[volunteer, opportunity]` on Application | Database-level enforcement of one-application-per-volunteer-per-opportunity |
| `uploads/` added to `.gitignore` | Prevents committing user-uploaded files to source control |
| Extend `api.js` interceptor (no new Axios instance) | Keeps a single source of truth for token routing |
| Extend `getStats` and `getDashboardStats` controllers | Avoids new endpoints for stats — consistent with existing pattern |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 19 + Vite)                  │
│                                                                   │
│  App.jsx (React Router 7)                                        │
│  ├─ /volunteer/opportunities      → VOpportunities (protected)   │
│  ├─ /volunteer/opportunities/:id  → VOpportunityDetail (protected│
│  ├─ /volunteer/applications       → VMyApplications (protected)  │
│  ├─ /admin/opportunities          → AdminOpportunities (protected│
│  └─ /admin/applications           → AdminApplications (protected │
│                                                                   │
│  utils/api.js  ←── Axios + token interceptor                     │
│  (extended to route volunteerToken for /api/volunteers/opps      │
│   and /api/volunteers/applications)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │  HTTP (JSON / multipart/form-data)
┌────────────────────────▼────────────────────────────────────────┐
│                        SERVER (Express 5 / Node.js)              │
│                                                                   │
│  server.js                                                        │
│  ├─ app.use('/uploads', express.static('uploads'))               │
│  ├─ app.use('/api/admin',      adminRoutes)     ← protect        │
│  └─ app.use('/api/volunteers', volunteerRoutes) ← protectVol.    │
│                                                                   │
│  adminRoutes.js (extended)                                        │
│  ├─ opportunityController  → CRUD /api/admin/opportunities        │
│  └─ applicationController  → review /api/admin/applications       │
│                                                                   │
│  volunteerRoutes.js (extended)                                    │
│  ├─ opportunityController  → browse /api/volunteers/opportunities │
│  └─ applicationController  → apply/list /api/volunteers/apps     │
│                                                                   │
│  middleware/                                                      │
│  ├─ authMiddleware.js  (protect, protectVolunteer — unchanged)    │
│  └─ uploadMiddleware.js  (NEW — Multer config for CV uploads)     │
│                                                                   │
│  controllers/                                                     │
│  ├─ opportunityController.js  (NEW)                               │
│  ├─ applicationController.js  (NEW)                               │
│  ├─ adminController.js        (modified — stats extended)        │
│  └─ volunteerProfileController.js (modified — dashboard stats)   │
└────────────────────────┬────────────────────────────────────────┘
                         │  Mongoose ODM
┌────────────────────────▼────────────────────────────────────────┐
│                     MongoDB Atlas                                  │
│                                                                   │
│  Collections:                                                     │
│  ├─ volunteers   (existing)                                       │
│  ├─ admins       (existing)                                       │
│  ├─ opportunities  (NEW)                                          │
│  └─ applications   (NEW)                                         │
└─────────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│               Server Filesystem (server/uploads/cvs/)            │
│  Multer DiskStorage writes PDFs here on upload.                  │
│  Served statically at /uploads/cvs/<filename>                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Backend — New / Modified Files

```
server/
  middleware/
    uploadMiddleware.js        ← NEW: Multer diskStorage config
  controllers/
    opportunityController.js   ← NEW
    applicationController.js   ← NEW
    adminController.js         ← MODIFIED: getStats extended
    volunteerProfileController.js ← MODIFIED: getDashboardStats extended
  routes/
    adminRoutes.js             ← MODIFIED: new opportunity + application routes
    volunteerRoutes.js         ← MODIFIED: new opportunity + application routes
  models/
    opportunity.js             ← NEW
    application.js             ← NEW
  server.js                    ← MODIFIED: static /uploads, ensure uploads dir
  uploads/
    cvs/                       ← created at runtime by server.js
```

### Frontend — New / Modified Files

```
client/src/
  App.jsx                      ← MODIFIED: 5 new routes
  utils/
    api.js                     ← MODIFIED: interceptor extended
  components/
    volunteer/
      VNavbar.jsx              ← MODIFIED: Opportunities link added
      OpportunityCard.jsx      ← NEW
      ApplicationStatusBadge.jsx ← NEW
    admin/
      StatsCards.jsx           ← MODIFIED: 2 new stat cards (5 total)
  pages/
    volunteer/
      VOpportunities.jsx       ← NEW
      VOpportunityDetail.jsx   ← NEW
      VMyApplications.jsx      ← NEW
    admin/
      AdminOpportunities.jsx   ← NEW
      AdminApplications.jsx    ← NEW
  styles/
    Volunteer.css              ← MODIFIED: new component classes
    Admin.css                  ← MODIFIED: new stat card colours, table additions
```

### Frontend Component Tree

```
App.jsx
├── /volunteer/opportunities
│   └── VProtectedRoute
│       └── VOpportunities
│           ├── VNavbar
│           ├── category filter <select>
│           ├── loading indicator (v-spinner)
│           ├── error banner (admin-alert-error)
│           └── OpportunityCard[]  (one per opportunity)
│
├── /volunteer/opportunities/:id
│   └── VProtectedRoute
│       └── VOpportunityDetail
│           ├── VNavbar
│           ├── opportunity metadata block
│           ├── ApplicationStatusBadge (if already applied)
│           └── application form (cover letter + file input)
│               └── submit button (loading state)
│
├── /volunteer/applications
│   └── VProtectedRoute
│       └── VMyApplications
│           ├── VNavbar
│           ├── loading indicator
│           ├── empty state (link to /volunteer/opportunities)
│           └── application row[]
│               └── ApplicationStatusBadge
│
├── /admin/opportunities
│   └── ProtectedRoute
│       └── AdminOpportunities
│           ├── admin header (existing pattern)
│           ├── StatsCards (stats passed from parent)
│           ├── filter controls (status, category)
│           ├── "New Opportunity" button → modal
│           ├── OpportunityFormModal (create / edit)
│           └── admin-table
│               └── action buttons (edit, delete)
│
└── /admin/applications
    └── ProtectedRoute
        └── AdminApplications
            ├── admin header
            ├── opportunityId filter <select>
            ├── admin-table
            │   ├── ApplicationStatusBadge (per row)
            │   ├── CV download link (if cvUrl present)
            │   └── status update action (inline select + save)
            └── status update confirmation feedback
```

### Shared UI Components

**OpportunityCard** (`components/volunteer/OpportunityCard.jsx`)
- Props: `opportunity` (full document object)
- Renders: title, category badge, location, deadline (formatted), status badge (`open` = green)
- Contains a "View Details" `<Link>` to `/volunteer/opportunities/:id`
- CSS classes: `opp-card`, `opp-card__category`, `opp-card__location`, `opp-card__deadline`, `opp-card__status-badge`, `opp-card__status-badge--open`, `opp-card__status-badge--closed`

**ApplicationStatusBadge** (`components/volunteer/ApplicationStatusBadge.jsx`)
- Props: `status` (string — one of the 6 Application_Status enum values)
- Renders: a `<span>` with label (title-case) and colour-mapped class
- CSS classes: `app-status-badge`, `app-status-badge--pending`, `app-status-badge--under_review`, `app-status-badge--shortlisted`, `app-status-badge--task_assigned`, `app-status-badge--completed`, `app-status-badge--rejected`

---

## Data Models

### Opportunity Schema (`server/models/opportunity.js`)

```js
{
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  category:     {
    type: String,
    required: true,
    enum: ['Internship', 'Volunteer', 'Event', 'Training', 'Job', 'Workshop', 'Other']
  },
  location:     { type: String, required: true },
  deadline:     { type: Date, required: true },
  requirements: { type: String, default: '' },
  status:       { type: String, enum: ['open', 'closed'], default: 'open' },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  // timestamps: createdAt, updatedAt (Mongoose option)
}
```

**Indexes:** default `_id`; `{ status: 1, createdAt: -1 }` compound index for efficient filtered list queries.

### Application Schema (`server/models/application.js`)

```js
{
  volunteer:        { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  opportunity:      { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  coverLetter:      { type: String, default: '' },
  cvUrl:            { type: String, default: null },        // server filesystem path
  cvOriginalName:   { type: String, default: null },        // original filename
  status:           {
    type: String,
    enum: ['pending', 'under_review', 'shortlisted', 'task_assigned', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNote:        { type: String, default: '' },
  certificateIssued:{ type: Boolean, default: false },
  certificateUrl:   { type: String, default: null },
  appliedAt:        { type: Date, default: Date.now },
  reviewedAt:       { type: Date, default: null },
  // timestamps: createdAt, updatedAt (Mongoose option)
}
```

**Indexes:**
- `{ volunteer: 1, opportunity: 1 }` — unique compound index (prevents duplicate applications)
- `{ opportunity: 1, appliedAt: -1 }` — for admin filtered list queries

### Multer Upload Middleware (`server/middleware/uploadMiddleware.js`)

```
Multer DiskStorage config:
  destination : server/uploads/cvs/
  filename    : <Date.now()>-<Math.random().toString(36).slice(2)>-<sanitised_originalname>

fileFilter:
  Accept  : mimetype === 'application/pdf'
  Reject  : cb(new Error('Only PDF files are allowed'))

limits:
  fileSize: 5 * 1024 * 1024  (5 MB)

export: upload.single('cv')   ← field name "cv" used in multipart form
```

---

## API Endpoints

All existing endpoints are unchanged. New endpoints listed below.

| Method | Path | Auth | Controller | Description |
|---|---|---|---|---|
| POST | `/api/admin/opportunities` | `protect` | `createOpportunity` | Create new opportunity |
| GET | `/api/admin/opportunities` | `protect` | `getAdminOpportunities` | Paginated list; optional `?status=&category=` |
| GET | `/api/admin/opportunities/:id` | `protect` | `getAdminOpportunityById` | Single opportunity |
| PUT | `/api/admin/opportunities/:id` | `protect` | `updateOpportunity` | Update opportunity |
| DELETE | `/api/admin/opportunities/:id` | `protect` | `deleteOpportunity` | Delete opportunity |
| GET | `/api/admin/applications` | `protect` | `getAdminApplications` | Paginated list; optional `?opportunityId=` |
| PATCH | `/api/admin/applications/:id/status` | `protect` | `updateApplicationStatus` | Update status + adminNote |
| GET | `/api/volunteers/opportunities` | `protectVolunteer` | `getVolunteerOpportunities` | Open opps; optional `?category=` |
| GET | `/api/volunteers/opportunities/:id` | `protectVolunteer` | `getVolunteerOpportunityById` | Single opportunity detail |
| POST | `/api/volunteers/applications` | `protectVolunteer` + `upload.single('cv')` | `submitApplication` | Submit application (multipart) |
| GET | `/api/volunteers/applications` | `protectVolunteer` | `getMyApplications` | Volunteer's own applications |
| GET | `/api/volunteers/applications/check` | `protectVolunteer` | `checkApplication` | `?opportunityId=:id` → `{ applied: bool }` |

**Modified existing endpoints:**

| Method | Path | Change |
|---|---|---|
| GET | `/api/admin/stats` | Extended: adds `totalOpportunities`, `totalApplications`, `recentApplications` |
| GET | `/api/volunteers/dashboard/stats` | Extended: replaces placeholder `applications: 0` with live count; adds `recentApplications` array |
| GET | `/api/public/stats` | Extended: replaces placeholder `totalApplications: 0` with live count |

### Pagination Convention

List endpoints that support pagination accept `?page=1&limit=10` query parameters. Response shape:

```json
{
  "success": true,
  "count": 42,
  "page": 1,
  "totalPages": 5,
  "data": [ ...documents ]
}
```

Default: `page=1`, `limit=10`.

### Standard Error Response Shape

```json
{ "success": false, "message": "Human-readable description" }
```

---

## Data Flow Diagrams

### Flow 1: Volunteer Submits an Application

```
Volunteer (browser)
  │
  ├─ 1. GET /api/volunteers/opportunities/:id
  │      ← { opportunity }
  │
  ├─ 2. GET /api/volunteers/applications/check?opportunityId=:id
  │      ← { applied: false }
  │
  ├─ 3. Volunteer fills form (coverLetter text + CV PDF file)
  │
  ├─ 4. POST /api/volunteers/applications
  │      Content-Type: multipart/form-data
  │      Body: { opportunityId, coverLetter, cv: <file> }
  │      Authorization: Bearer <volunteerToken>
  │
  │       Server — applicationController.submitApplication
  │         ├─ protectVolunteer middleware validates JWT
  │         ├─ upload.single('cv') middleware (Multer)
  │         │   ├─ validates MIME = application/pdf
  │         │   ├─ validates size ≤ 5 MB
  │         │   └─ writes to server/uploads/cvs/<filename>
  │         ├─ check opportunity exists (404 if not)
  │         ├─ check opportunity.status === 'open' (400 if closed)
  │         ├─ check no existing application (409 if duplicate)
  │         └─ Application.create({ volunteer, opportunity, coverLetter,
  │                                  cvUrl, cvOriginalName, status: 'pending' })
  │
  └─ 5. ← HTTP 201 { success: true, application }
         UI shows "Application Submitted" confirmation
```

### Flow 2: Admin Reviews and Updates Application Status

```
Admin (browser)
  │
  ├─ 1. GET /api/admin/applications?opportunityId=:id
  │      ← { data: [ ...applications with volunteer+opportunity populated ] }
  │
  ├─ 2. Admin selects new status + optional adminNote
  │
  ├─ 3. PATCH /api/admin/applications/:id/status
  │      Body: { status: 'shortlisted', adminNote: '...' }
  │      Authorization: Bearer <adminToken>
  │
  │       Server — applicationController.updateApplicationStatus
  │         ├─ protect middleware validates JWT
  │         ├─ validate status is a known enum value (400 if invalid)
  │         ├─ Application.findByIdAndUpdate(id,
  │         │    { status, adminNote, reviewedAt: new Date() }, { new: true })
  │         └─ populate volunteer + opportunity for response
  │
  └─ 4. ← HTTP 200 { success: true, application }
         Table row updates in-place (no full reload)
```

### Flow 3: Admin Creates an Opportunity

```
Admin (browser)
  │
  ├─ 1. Admin opens "New Opportunity" modal
  │
  ├─ 2. POST /api/admin/opportunities
  │      Body: { title, description, category, location, deadline,
  │              requirements, status }
  │      Authorization: Bearer <adminToken>
  │
  │       Server — opportunityController.createOpportunity
  │         ├─ protect middleware validates JWT
  │         ├─ validate required fields present
  │         └─ Opportunity.create({ ...fields, createdBy: req.admin.id })
  │
  └─ 3. ← HTTP 201 { success: true, opportunity }
         Opportunity list refreshes
```

---

## File Structure (All New and Modified Files)

### New Files

```
server/
  middleware/
    uploadMiddleware.js
  models/
    opportunity.js
    application.js
  controllers/
    opportunityController.js
    applicationController.js
  uploads/
    cvs/                   ← created at runtime; in .gitignore

client/src/
  components/
    volunteer/
      OpportunityCard.jsx
      ApplicationStatusBadge.jsx
  pages/
    volunteer/
      VOpportunities.jsx
      VOpportunityDetail.jsx
      VMyApplications.jsx
    admin/
      AdminOpportunities.jsx
      AdminApplications.jsx
```

### Modified Files

```
server/
  server.js                      — add static /uploads; ensure uploads dir
  routes/adminRoutes.js          — mount opportunity + application routes
  routes/volunteerRoutes.js      — mount opportunity + application routes
  controllers/adminController.js — extend getStats
  controllers/volunteerProfileController.js — extend getDashboardStats
  routes/publicRoutes.js         — extend /stats to use Application.countDocuments()

client/src/
  App.jsx                        — 5 new routes
  utils/api.js                   — interceptor: add /api/volunteers/opportunities
                                   and /api/volunteers/applications to volunteerToken paths
  components/admin/StatsCards.jsx — 2 new stat cards
  components/volunteer/VNavbar.jsx — Opportunities link in navLinks
  styles/Volunteer.css            — new classes for OpportunityCard, StatusBadge, pages
  styles/Admin.css                — grid adjustment for 5 cards, new icon colours

.gitignore                       — add server/uploads/
```

---

## CSS Class Naming Conventions

All new classes follow the existing `prefix--modifier` BEM-like convention.

### Opportunity Card (Volunteer.css)

```css
.opp-card                          /* glass-card extension — opportunity list item */
.opp-card__category                /* category badge — follows admin-domain-badge style */
.opp-card__location                /* location text with icon */
.opp-card__deadline                /* deadline text */
.opp-card__footer                  /* bottom row: status badge + View Details btn */
.opp-card__status-badge            /* base badge */
.opp-card__status-badge--open      /* green teal variant */
.opp-card__status-badge--closed    /* muted/red variant */
```

### Application Status Badge (Volunteer.css)

```css
.app-status-badge                  /* base inline badge */
.app-status-badge--pending         /* grey */
.app-status-badge--under_review    /* blue */
.app-status-badge--shortlisted     /* yellow/gold */
.app-status-badge--task_assigned   /* orange */
.app-status-badge--completed       /* green teal */
.app-status-badge--rejected        /* red */
```

### Volunteer Opportunity Pages (Volunteer.css)

```css
.v-opp-page                        /* page wrapper — extends .v-page */
.v-opp-filters                     /* filter row container */
.v-opp-grid                        /* responsive card grid */
.v-opp-empty                       /* empty-state block */
.v-opp-detail-header               /* detail page header card */
.v-opp-detail-meta                 /* metadata row grid */
.v-apply-form                      /* application form card */
.v-apply-form__file-hint           /* "PDF only, max 5 MB" note */
.v-apply-success                   /* post-submission confirmation block */
.v-my-apps-table                   /* applications list table — extends admin-table pattern */
```

### Admin Pages (Admin.css)

```css
.admin-stat-icon-blue              /* blue icon variant for 5th stat card */
.admin-stat-icon-green             /* green icon variant (if needed) */
.admin-opp-form-modal              /* opportunity create/edit modal */
.admin-opp-form-modal__grid        /* 2-column form field grid */
.admin-apps-filter                 /* application page filter row */
.admin-status-select               /* inline status dropdown in applications table */
```

**Admin stats grid adjustment:** The existing `grid-template-columns: repeat(3, 1fr)` in `.admin-stats-grid` is changed to `repeat(auto-fit, minmax(200px, 1fr))` to accommodate 5 cards gracefully.

---

## Error Handling Patterns

### Server-Side

All controllers follow the existing pattern: `try/catch` around async operations, returning `{ success: false, message }` with the appropriate HTTP status code.

| Scenario | HTTP Status | Message |
|---|---|---|
| Missing required fields (Mongoose validation) | 400 | Mongoose validation message |
| Invalid status enum value | 400 | "Invalid status value" |
| Non-PDF file uploaded | 400 | "Only PDF files are allowed" |
| File exceeds 5 MB | 400 | "File size must not exceed 5 MB" |
| Opportunity not found | 404 | "Opportunity not found" |
| Application not found | 404 | "Application not found" |
| Closed opportunity submission | 400 | "This opportunity is no longer accepting applications" |
| Duplicate application | 409 | "You have already applied to this opportunity" |
| Unauthenticated request | 401 | "Not authorized — no token provided" (from middleware) |
| Wrong token role | 403 | "Access denied — volunteer token required" (from middleware) |
| Internal server error | 500 | `error.message` |

**Multer error handling:** Multer throws `MulterError` for limit violations and passes custom `Error` objects from `fileFilter`. The controller (or a wrapper) checks `err instanceof multer.MulterError` and maps `LIMIT_FILE_SIZE` to the 400 response with the size message. Custom filter errors are also caught and returned as 400.

**Duplicate application (MongoDB error code 11000):** The `applicationController.submitApplication` function catches `error.code === 11000` on the unique index and returns 409 before attempting to create a second document.

### Client-Side

- All API calls are wrapped in `try/catch`; errors extract `err.response?.data?.message` or fall back to a generic string.
- Loading states are managed with a `loading` boolean; buttons are disabled and show a spinner during submission.
- The `api.js` response interceptor already handles 401 redirects; new volunteer routes (`/api/volunteers/opportunities`, `/api/volunteers/applications`) are added to the volunteer-route check so that expired sessions redirect to `/volunteer/login`.
- Client-side file validation (MIME type, size) is performed `onChange` on the file input before any network request, mirroring server-side rules to give instant feedback.

---

## Testing Strategy

This feature combines business logic in controllers, a data transformation layer (status mapping, pagination), and UI rendering. The testing approach uses both unit/example-based tests and property-based tests.

### Unit / Example-Based Tests

- **Model validation**: Test that Mongoose schemas reject documents missing required fields, accept valid documents, and enforce enum constraints.
- **Duplicate application**: Test that a second `Application.create()` with the same `[volunteer, opportunity]` pair throws a duplicate-key error.
- **Multer fileFilter**: Test with mock file objects — PDF accepted, non-PDF rejected with the correct error message.
- **Controller logic**: Test each controller with mocked Mongoose models — verify correct HTTP status codes and response shapes for the happy path and each error condition.
- **`ApplicationStatusBadge`**: Snapshot or render test verifying each of the 6 status values maps to the correct label and CSS class.
- **`OpportunityCard`**: Render test verifying all required fields are present in the output.

### Property-Based Tests

PBT is appropriate here because:
- The application submission validation logic (status mapping, CV upload rules, duplicate detection) is a pure transformation over varying inputs.
- The status badge rendering is a function over a finite but typed domain.
- Pagination arithmetic (total pages, page boundaries) is a pure numeric function.

A property-based testing library appropriate for the Node.js/JavaScript stack is **fast-check** (MIT licensed, well-maintained, works with Jest/Vitest).

Each property test must run a minimum of **100 iterations**.

Tag format: `// Feature: opportunity-application-system, Property N: <property_text>`

