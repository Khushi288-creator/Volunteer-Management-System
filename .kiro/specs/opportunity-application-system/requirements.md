# Requirements Document

## Introduction

Phase 5A of the Volunteer Management Platform introduces an Opportunity & Application System. This phase adds the ability for admins to post and manage opportunities (internships, volunteer roles, events, training sessions, jobs, workshops, and other engagements), and for authenticated volunteers to browse those opportunities, submit applications with a cover letter and CV (PDF), and track their application status through a dedicated dashboard view.

The system builds on the existing MERN stack (Express 5, Mongoose 9, React 19 + Vite, JWT auth). It integrates with the existing `protect` (admin) and `protectVolunteer` (volunteer) middleware, extends the admin and volunteer dashboards with real statistics, and introduces file storage on the server filesystem under `server/uploads/cvs/`. No cloud storage is used in this phase.

---

## Glossary

- **Opportunity_API**: The Express server layer that handles all opportunity-related HTTP requests.
- **Application_API**: The Express server layer that handles all application-related HTTP requests.
- **Opportunity**: A MongoDB document representing a posted engagement (internship, volunteer role, event, training, job, workshop, or other). Fields: title, description, category, location, deadline, requirements, status, createdBy (Admin ref), timestamps.
- **Application**: A MongoDB document representing a volunteer's submission for a specific Opportunity. Fields: volunteer (Volunteer ref), opportunity (Opportunity ref), coverLetter, cvUrl, cvOriginalName, status, adminNote, certificateIssued, certificateUrl, appliedAt, reviewedAt.
- **CV_Uploader**: The Multer-based server middleware that validates and stores uploaded PDF files on the server filesystem under `server/uploads/cvs/`.
- **Admin**: An authenticated platform administrator identified by a JWT token containing `{ id, email }` and validated by the `protect` middleware.
- **Volunteer**: An authenticated volunteer identified by a JWT token containing `{ id, email, role: "volunteer" }` and validated by the `protectVolunteer` middleware.
- **Opportunity_Portal**: The client-side volunteer section for browsing and applying to opportunities (`/volunteer/opportunities` and `/volunteer/opportunities/:id`).
- **Admin_Opportunity_Manager**: The client-side admin section for creating, editing, deleting, and reviewing opportunities and applications.
- **Application_Status**: One of six enumerated values: `pending`, `under_review`, `shortlisted`, `task_assigned`, `completed`, `rejected`.
- **Opportunity_Status**: One of two enumerated values: `open`, `closed`.
- **Opportunity_Category**: One of seven enumerated values: `Internship`, `Volunteer`, `Event`, `Training`, `Job`, `Workshop`, `Other`.
- **Dashboard_Stats_API**: The Express endpoint at `GET /api/volunteers/dashboard/stats` that returns aggregated stats for the authenticated volunteer.
- **Admin_Stats_API**: The Express endpoint at `GET /api/admin/stats` that returns aggregated stats for the admin dashboard.
- **Public_Stats_API**: The Express endpoint at `GET /api/public/stats` that returns unauthenticated counts for the homepage.

---

## Requirements

### Requirement 1: Opportunity Data Model

**User Story:** As a developer, I want a well-defined Opportunity schema, so that opportunity data is consistently stored and queryable in MongoDB.

#### Acceptance Criteria

1. THE Opportunity_API SHALL store opportunities with the fields: `title` (String, required), `description` (String, required), `category` (enum: `Internship`, `Volunteer`, `Event`, `Training`, `Job`, `Workshop`, `Other`; required), `location` (String, required), `deadline` (Date, required), `requirements` (String, optional), `status` (enum: `open`, `closed`; default `open`), `createdBy` (ObjectId reference to Admin, required), and Mongoose `timestamps` (createdAt, updatedAt).
2. THE Opportunity_API SHALL enforce that `title`, `description`, `category`, `location`, `deadline`, and `createdBy` are present; otherwise THE Opportunity_API SHALL reject the document with a validation error.
3. THE Opportunity_API SHALL default `status` to `open` when no status is provided at creation time.

---

### Requirement 2: Application Data Model

**User Story:** As a developer, I want a well-defined Application schema, so that application data is consistently stored and prevents duplicate submissions.

#### Acceptance Criteria

1. THE Application_API SHALL store applications with the fields: `volunteer` (ObjectId reference to Volunteer, required), `opportunity` (ObjectId reference to Opportunity, required), `coverLetter` (String, optional), `cvUrl` (String, optional — server filesystem path), `cvOriginalName` (String, optional — original filename from the upload), `status` (enum: `pending`, `under_review`, `shortlisted`, `task_assigned`, `completed`, `rejected`; default `pending`), `adminNote` (String, optional), `certificateIssued` (Boolean, default `false`), `certificateUrl` (String, optional), `appliedAt` (Date, default now), `reviewedAt` (Date, optional).
2. THE Application_API SHALL enforce a unique compound index on the `[volunteer, opportunity]` pair so that a single volunteer cannot submit more than one application to the same opportunity.
3. WHEN a duplicate application is attempted, THE Application_API SHALL return HTTP 409 with a descriptive error message.
4. THE Application_API SHALL default `status` to `pending` and `certificateIssued` to `false` when no values are provided at creation time.

---

### Requirement 3: CV File Upload

**User Story:** As a volunteer, I want to attach my CV when applying, so that admins can review my qualifications.

#### Acceptance Criteria

1. WHEN a volunteer submits an application with a file attachment, THE CV_Uploader SHALL accept only files with MIME type `application/pdf`.
2. IF a file with a MIME type other than `application/pdf` is submitted, THEN THE CV_Uploader SHALL reject the upload with HTTP 400 and the message "Only PDF files are allowed".
3. THE CV_Uploader SHALL enforce a maximum file size of 5 MB (5,242,880 bytes).
4. IF a file exceeding 5 MB is submitted, THEN THE CV_Uploader SHALL reject the upload with HTTP 400 and the message "File size must not exceed 5 MB".
5. WHEN a valid PDF is accepted, THE CV_Uploader SHALL save it to the server filesystem at the path `server/uploads/cvs/<timestamp>-<random>-<originalname>`, where `<timestamp>` is the Unix timestamp in milliseconds, `<random>` is a random alphanumeric string, and `<originalname>` is the sanitised original filename.
6. WHEN a valid PDF is accepted, THE CV_Uploader SHALL store the resulting server path in `Application.cvUrl` and the original filename in `Application.cvOriginalName`.
7. THE CV_Uploader SHALL create the `server/uploads/cvs/` directory on startup if it does not already exist.

---

### Requirement 4: Admin — Opportunity CRUD

**User Story:** As an admin, I want to create, read, update, and delete opportunities, so that I can manage the platform's engagement offerings.

#### Acceptance Criteria

1. WHEN an authenticated Admin sends `POST /api/admin/opportunities` with valid fields, THE Opportunity_API SHALL create and persist the Opportunity and return HTTP 201 with the created document.
2. WHEN an authenticated Admin sends `GET /api/admin/opportunities`, THE Opportunity_API SHALL return a paginated list of all opportunities sorted by `createdAt` descending, including total count.
3. WHEN an authenticated Admin sends `GET /api/admin/opportunities` with query parameters `status` or `category`, THE Opportunity_API SHALL filter results to only those matching the provided values.
4. WHEN an authenticated Admin sends `GET /api/admin/opportunities/:id`, THE Opportunity_API SHALL return the matching opportunity document, or HTTP 404 if not found.
5. WHEN an authenticated Admin sends `PUT /api/admin/opportunities/:id` with updated fields, THE Opportunity_API SHALL update and persist the opportunity and return HTTP 200 with the updated document.
6. WHEN an authenticated Admin sends `DELETE /api/admin/opportunities/:id`, THE Opportunity_API SHALL delete the opportunity and return HTTP 200 with a success message.
7. IF an unauthenticated request reaches any admin opportunity endpoint, THEN THE Opportunity_API SHALL return HTTP 401.

---

### Requirement 5: Admin — Application Review

**User Story:** As an admin, I want to view and update application statuses, so that I can manage the volunteer selection process.

#### Acceptance Criteria

1. WHEN an authenticated Admin sends `GET /api/admin/applications`, THE Application_API SHALL return a paginated list of all applications with `volunteer` and `opportunity` fields populated, sorted by `appliedAt` descending.
2. WHEN an authenticated Admin sends `GET /api/admin/applications` with query parameter `opportunityId`, THE Application_API SHALL filter results to only those applications for that opportunity.
3. WHEN an authenticated Admin sends `PATCH /api/admin/applications/:id/status` with a valid `status` value and optional `adminNote`, THE Application_API SHALL update the application status, set `reviewedAt` to the current date, and return HTTP 200 with the updated document.
4. IF an invalid `status` value is provided to `PATCH /api/admin/applications/:id/status`, THEN THE Application_API SHALL return HTTP 400 with a descriptive validation error.
5. IF an unauthenticated request reaches any admin application endpoint, THEN THE Application_API SHALL return HTTP 401.

---

### Requirement 6: Volunteer — Browse Opportunities

**User Story:** As a volunteer, I want to browse open opportunities after logging in, so that I can find engagements that match my interests.

#### Acceptance Criteria

1. WHEN an authenticated Volunteer sends `GET /api/volunteers/opportunities`, THE Opportunity_API SHALL return only opportunities with `status: "open"`, paginated and sorted by `createdAt` descending.
2. WHEN an authenticated Volunteer sends `GET /api/volunteers/opportunities` with query parameter `category`, THE Opportunity_API SHALL filter results to only open opportunities matching that category.
3. WHEN an authenticated Volunteer sends `GET /api/volunteers/opportunities/:id`, THE Opportunity_API SHALL return the full detail of that opportunity regardless of status.
4. IF the opportunity with the requested `id` does not exist, THEN THE Opportunity_API SHALL return HTTP 404 with a descriptive error message.
5. IF an unauthenticated request reaches any volunteer opportunity browsing endpoint, THEN THE Opportunity_API SHALL return HTTP 401.

---

### Requirement 7: Volunteer — Submit Application

**User Story:** As a volunteer, I want to apply to an opportunity with a cover letter and my CV, so that I can be considered for the role.

#### Acceptance Criteria

1. WHEN an authenticated Volunteer sends `POST /api/volunteers/applications` with a valid `opportunityId`, THE Application_API SHALL create an Application document with `status: "pending"` and return HTTP 201 with the created document.
2. WHERE a `coverLetter` field is included in the request, THE Application_API SHALL persist the cover letter text on the Application document.
3. WHERE a PDF file is attached to the request, THE CV_Uploader SHALL process and store it as described in Requirement 3, and THE Application_API SHALL persist the resulting `cvUrl` and `cvOriginalName`.
4. IF a Volunteer attempts to apply to an opportunity to which they have already applied, THEN THE Application_API SHALL return HTTP 409 with the message "You have already applied to this opportunity".
5. IF a Volunteer attempts to apply to a non-existent opportunity, THEN THE Application_API SHALL return HTTP 404 with the message "Opportunity not found".
6. IF the opportunity's `status` is `"closed"`, THEN THE Application_API SHALL return HTTP 400 with the message "This opportunity is no longer accepting applications".

---

### Requirement 8: Volunteer — View Own Applications

**User Story:** As a volunteer, I want to see all my submitted applications and their statuses, so that I can track my progress.

#### Acceptance Criteria

1. WHEN an authenticated Volunteer sends `GET /api/volunteers/applications`, THE Application_API SHALL return all applications submitted by that volunteer, with the `opportunity` field populated, sorted by `appliedAt` descending.
2. WHEN an authenticated Volunteer sends `GET /api/volunteers/applications/check?opportunityId=:id`, THE Application_API SHALL return a Boolean `applied` flag indicating whether the volunteer has an existing application for that opportunity.
3. IF an unauthenticated request reaches any volunteer application endpoint, THEN THE Application_API SHALL return HTTP 401.

---

### Requirement 9: Admin Dashboard Integration

**User Story:** As an admin, I want to see opportunity and application counts on my dashboard, so that I have an overview of platform activity.

#### Acceptance Criteria

1. WHEN an authenticated Admin sends `GET /api/admin/stats`, THE Admin_Stats_API SHALL include `totalOpportunities` (count of all opportunities), `totalApplications` (count of all applications), and `recentApplications` (most recent 5 applications with `volunteer` and `opportunity` fields populated) in the response alongside the existing volunteer stats.
2. THE Admin_Stats_API SHALL compute `totalOpportunities` and `totalApplications` using live MongoDB counts.
3. THE Admin_Stats_API SHALL return `recentApplications` sorted by `appliedAt` descending, limited to 5 entries.

---

### Requirement 10: Volunteer Dashboard Integration

**User Story:** As a volunteer, I want to see my application activity and recent applications on my dashboard, so that I have a quick summary of my engagement.

#### Acceptance Criteria

1. WHEN an authenticated Volunteer sends `GET /api/volunteers/dashboard/stats`, THE Dashboard_Stats_API SHALL include `applications` as the live count of all applications submitted by that volunteer (replacing the placeholder value of `0`).
2. WHEN an authenticated Volunteer sends `GET /api/volunteers/dashboard/stats`, THE Dashboard_Stats_API SHALL include `recentApplications` as a list of the 3 most recent applications submitted by that volunteer, with the `opportunity` field populated, sorted by `appliedAt` descending.

---

### Requirement 11: Public Stats Integration

**User Story:** As a site visitor, I want the homepage to show a real applications count, so that the statistics section reflects actual platform activity.

#### Acceptance Criteria

1. WHEN a request is made to `GET /api/public/stats`, THE Public_Stats_API SHALL return `totalApplications` as the live count of all Application documents in the database (replacing the placeholder value of `0`).

---

### Requirement 12: API Token Routing

**User Story:** As a developer, I want the client-side API interceptor to route the correct JWT token for the new volunteer opportunity and application endpoints, so that requests are authenticated properly.

#### Acceptance Criteria

1. THE api.js interceptor SHALL attach the `volunteerToken` from localStorage to all requests whose URL starts with `/api/volunteers/opportunities`.
2. THE api.js interceptor SHALL attach the `volunteerToken` from localStorage to all requests whose URL starts with `/api/volunteers/applications`.
3. THE api.js interceptor SHALL redirect an unauthenticated volunteer (HTTP 401 response) to `/volunteer/login` when the failing request URL starts with `/api/volunteers/opportunities` or `/api/volunteers/applications`.

---

### Requirement 13: Client-Side Routing

**User Story:** As a developer, I want React Router routes defined for all new volunteer and admin pages, so that users can navigate to them by URL.

#### Acceptance Criteria

1. THE App.jsx SHALL define a protected volunteer route at `/volunteer/opportunities` rendering the `VOpportunities` page component.
2. THE App.jsx SHALL define a protected volunteer route at `/volunteer/opportunities/:id` rendering the `VOpportunityDetail` page component.
3. THE App.jsx SHALL define a protected volunteer route at `/volunteer/applications` rendering the `VMyApplications` page component.
4. THE App.jsx SHALL define a protected admin route at `/admin/opportunities` rendering the `AdminOpportunities` page component.
5. THE App.jsx SHALL define a protected admin route at `/admin/applications` rendering the `AdminApplications` page component.

---

### Requirement 14: Volunteer Navigation

**User Story:** As a volunteer, I want an "Opportunities" link in the navigation bar, so that I can easily reach the opportunity portal.

#### Acceptance Criteria

1. THE VNavbar SHALL render an "Opportunities" navigation link pointing to `/volunteer/opportunities` in both the desktop link list and the mobile menu.
2. WHEN the current route is `/volunteer/opportunities` or `/volunteer/opportunities/:id`, THE VNavbar SHALL apply the active link style to the "Opportunities" link.

---

### Requirement 15: Opportunity Card Component

**User Story:** As a volunteer, I want each opportunity displayed as a card with key details, so that I can quickly evaluate which ones interest me.

#### Acceptance Criteria

1. THE OpportunityCard component SHALL display the opportunity's `title`, `category`, `location`, `deadline` (formatted as a human-readable date), and `status` badge.
2. WHEN `status` is `"open"`, THE OpportunityCard SHALL render a green status badge labelled "Open".
3. THE OpportunityCard SHALL render a "View Details" button that navigates to `/volunteer/opportunities/:id`.

---

### Requirement 16: Application Status Badge Component

**User Story:** As a volunteer, I want application statuses displayed as colour-coded badges, so that I can immediately understand the state of each application.

#### Acceptance Criteria

1. THE ApplicationStatusBadge component SHALL render a badge whose label and colour correspond to the Application_Status value: `pending` → grey, `under_review` → blue, `shortlisted` → yellow, `task_assigned` → orange, `completed` → green, `rejected` → red.
2. THE ApplicationStatusBadge component SHALL accept a `status` prop and render the appropriate label text in title-case (e.g. "Under Review", "Task Assigned").

---

### Requirement 17: Volunteer Opportunity Portal Pages

**User Story:** As a volunteer, I want a browse page and a detail page for opportunities, so that I can explore and apply to engagements.

#### Acceptance Criteria

1. WHEN the `VOpportunities` page mounts, THE Opportunity_Portal SHALL fetch and display all open opportunities from `GET /api/volunteers/opportunities` using the `OpportunityCard` component.
2. WHILE the fetch is in progress, THE Opportunity_Portal SHALL render a loading indicator.
3. IF the fetch fails, THE Opportunity_Portal SHALL display an error message.
4. THE `VOpportunities` page SHALL render a category filter control that, when changed, re-fetches opportunities with the selected category query parameter.
5. WHEN the `VOpportunityDetail` page mounts, THE Opportunity_Portal SHALL fetch the opportunity detail from `GET /api/volunteers/opportunities/:id`.
6. WHEN the opportunity detail is loaded and the volunteer has not previously applied, THE Opportunity_Portal SHALL display an "Apply Now" button that opens the application form.
7. WHEN the opportunity detail is loaded and the volunteer has already applied, THE Opportunity_Portal SHALL display an "Already Applied" indicator instead of the "Apply Now" button, using the result of `GET /api/volunteers/applications/check?opportunityId=:id`.
8. IF the opportunity `status` is `"closed"`, THE Opportunity_Portal SHALL display a "Closed" badge and disable the apply action.

---

### Requirement 18: Application Submission Form

**User Story:** As a volunteer, I want an application form on the opportunity detail page, so that I can submit my cover letter and CV in one step.

#### Acceptance Criteria

1. THE application form on `VOpportunityDetail` SHALL include an optional cover letter textarea and an optional file input restricted to PDF files.
2. IF a volunteer selects a file that is not a PDF, THEN THE Opportunity_Portal SHALL display a client-side validation error and prevent form submission.
3. IF a volunteer selects a file exceeding 5 MB, THEN THE Opportunity_Portal SHALL display a client-side validation error and prevent form submission.
4. WHEN the form is submitted with valid data, THE Opportunity_Portal SHALL send a `multipart/form-data` POST request to `POST /api/volunteers/applications`.
5. WHILE the submission is in progress, THE Opportunity_Portal SHALL disable the submit button and show a loading state.
6. WHEN the submission succeeds, THE Opportunity_Portal SHALL replace the apply form with an "Application Submitted" confirmation and update the UI to the "Already Applied" state.
7. IF the submission fails, THE Opportunity_Portal SHALL display the server error message to the volunteer.

---

### Requirement 19: Volunteer My Applications Page

**User Story:** As a volunteer, I want a dedicated page listing all my applications, so that I can track every submission in one place.

#### Acceptance Criteria

1. WHEN the `VMyApplications` page mounts, THE Opportunity_Portal SHALL fetch the volunteer's applications from `GET /api/volunteers/applications`.
2. THE `VMyApplications` page SHALL display each application's opportunity title, category, location, `appliedAt` date, and current status using the `ApplicationStatusBadge` component.
3. WHILE the fetch is in progress, THE Opportunity_Portal SHALL render a loading indicator.
4. IF the volunteer has no applications, THE Opportunity_Portal SHALL display an empty-state message with a link to `/volunteer/opportunities`.

---

### Requirement 20: Admin Opportunity Management Page

**User Story:** As an admin, I want a dedicated page to create, edit, delete, and view all opportunities, so that I can manage the platform's offerings.

#### Acceptance Criteria

1. WHEN the `AdminOpportunities` page mounts, THE Admin_Opportunity_Manager SHALL fetch all opportunities from `GET /api/admin/opportunities`.
2. THE `AdminOpportunities` page SHALL display opportunities in a table with columns for title, category, location, deadline, status, and actions (edit, delete).
3. THE `AdminOpportunities` page SHALL provide a form or modal for creating a new opportunity via `POST /api/admin/opportunities`.
4. WHEN an admin submits the create form with valid data, THE Admin_Opportunity_Manager SHALL send the request and refresh the opportunity list on success.
5. THE `AdminOpportunities` page SHALL provide an edit action that populates the form with the selected opportunity's data and updates it via `PUT /api/admin/opportunities/:id`.
6. THE `AdminOpportunities` page SHALL provide a delete action that prompts for confirmation before sending `DELETE /api/admin/opportunities/:id`.
7. THE `AdminOpportunities` page SHALL include `status` and `category` filter controls that query the server with the corresponding parameters.

---

### Requirement 21: Admin Application Review Page

**User Story:** As an admin, I want a dedicated page to review all applications and update their statuses, so that I can manage the selection pipeline.

#### Acceptance Criteria

1. WHEN the `AdminApplications` page mounts, THE Admin_Opportunity_Manager SHALL fetch all applications from `GET /api/admin/applications`.
2. THE `AdminApplications` page SHALL display each application's volunteer name, opportunity title, applied date, and current status using the `ApplicationStatusBadge` component.
3. THE `AdminApplications` page SHALL include an `opportunityId` filter that re-fetches applications for the selected opportunity.
4. WHEN an admin selects a status update action for an application, THE Admin_Opportunity_Manager SHALL send `PATCH /api/admin/applications/:id/status` with the new status and optional admin note.
5. WHEN the status update succeeds, THE Admin_Opportunity_Manager SHALL reflect the updated status in the table without a full page reload.
6. WHERE a `cvUrl` exists on an application, THE Admin_Opportunity_Manager SHALL render a link to download the volunteer's CV.

---

### Requirement 22: Server Startup and Static File Serving

**User Story:** As a developer, I want uploaded CVs to be accessible via a URL and the uploads directory to be created automatically, so that the system works correctly after deployment.

#### Acceptance Criteria

1. WHEN the Express server starts, THE Opportunity_API SHALL ensure the `server/uploads/cvs/` directory exists, creating it recursively if it does not.
2. THE server SHALL serve the `server/uploads/` directory as a static endpoint at `/uploads` so that stored CVs are accessible via `GET /uploads/cvs/<filename>`.
