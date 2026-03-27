# Lean Training Operational Audit

Validated on March 27, 2026 against the live codebase, successful `npm run build`, and successful `supabase db push`.

## Execution Audit

| Feature | Route | User role | UI state | Backend logic | Database tables used | Realtime requirement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Cohort edit, reschedule, cancel | `/admin/training` | `admin_owner` | Cohort create only. No cohort edit, archive, reschedule, or cancel form yet. | Cohort create exists. Cohort update lifecycle is not implemented. Session lifecycle is implemented separately. | `training_cohorts`, `training_cohort_trainers`, `training_cohort_memberships`, `admin_audit_log` | Needs admin and client refresh when cohort metadata changes. Not wired because the UI is missing. | `partially working` |
| Session edit, reschedule, cancel | `/admin/sessions` | `admin_owner`, `trainer` | Session detail editor, reschedule button, cancel button, attendance capture, prework approval, reminder button. | `updateTrainingSession`, `updateTrainingAttendance`, `sendTrainingSessionReminder` via `/api/admin/training/sessions/[id]`, `/attendance`, `/reminders`. Learner notifications and audit log included. | `training_sessions`, `training_session_prework_items`, `training_session_attendance`, `training_session_prework_status`, `training_cohort_memberships`, `notifications`, `admin_audit_log` | Training realtime bridge refreshes admin and client training views on session and prework changes. | `fully working` |
| Learner invite, activation, onboarding | `/admin/learners`, `/client-hub` | `admin_owner` for invite, `learner` for activation/onboarding | Admin learner invite form and role panel show invite, activation, and onboarding state. Client dashboard shows onboarding card with complete action. | `createTrainingLearner` sends invite email and creates invited account/membership. `ensureClientPortalContext` activates on first sign-in. `/api/client/training/onboarding` completes onboarding. | `client_accounts`, `training_cohort_memberships`, `client_account_roles`, `account_preferences`, `notifications`, `admin_audit_log`, `activity_feed_events` | `client_accounts` and training tables are on realtime so admin learner state and client dashboard refresh correctly. | `fully working` |
| Prework completion and approval | `/client-hub/schedule`, `/admin/sessions` | `learner`, `trainer`, `admin_owner` | Learner can mark prework done. Admin can set `todo`, `done`, or `approved` per learner per item. | `/api/client/training/prework/[id]` updates learner completion. `/api/admin/training/prework/[id]` reviews/approves. Certification refresh runs after changes. | `training_session_prework_items`, `training_session_prework_status`, `training_sessions`, `training_cohort_memberships`, `notifications`, `activity_feed_events` | Training realtime bridge covers session prework tables and refreshes both sides. | `fully working` |
| Assessment evidence upload and review | `/client-hub/assessments`, `/admin/assessments` | `learner`, `trainer`, `admin_owner` | Learner submit form now supports text plus file upload. Admin sees evidence file link in grading queue. | `submitTrainingAssessment` accepts multipart submission, uploads evidence to Supabase Storage, records events, and queues grading notifications. | `training_assessments`, `training_assessment_submissions`, `training_assessment_submission_events`, `training_cohort_memberships`, `notifications`, storage bucket `training-evidence` | Training realtime bridge covers submissions and submission events; admin grading queue and learner lifecycle refresh. | `fully working` |
| Assessment reopen, override, grading history | `/admin/assessments`, `/client-hub/assessments` | `trainer`, `admin_owner`, `learner` | Admin can grade, return, reopen, override pass, and override fail. Learner sees feedback and full submission history. | `gradeTrainingAssessmentSubmission` now handles grading, reopen, override, feedback, pass/fail, retake reopening, and event logging. | `training_assessment_submissions`, `training_assessment_submission_events`, `training_assessments`, `training_cohort_memberships`, `notifications`, `admin_audit_log` | Submission and submission-event realtime refresh is enabled. | `fully working` |
| Certificate artifact generation, storage, download | `/admin/progress`, `/client-hub/progress` | `admin_owner`, `learner`, `client_manager` | Admin can award/revoke and download certificate. Client progress page shows certificate number and download link. | `awardTrainingCertificate` now generates branded certificate HTML, uploads it to storage, stores artifact metadata, sends notification and email. Revoke flow remains live. | `training_certificates`, `training_cohort_memberships`, `training_progress_snapshots`, `notifications`, storage bucket `training-certificates` | Training realtime bridge includes certificates and progress tables so award/revoke states propagate. | `fully working` |
| Automated scheduled reminders | Background route `/api/cron/training-reminders` | system | No direct admin UI yet. Runs as background automation via Vercel cron. | `runScheduledTrainingReminders` scans upcoming sessions, due assessments, grading queue, certification-ready learners, and recently awarded certificates. Dedupe uses reminder log. | `training_sessions`, `training_assessments`, `training_assessment_submissions`, `training_certificates`, `training_cohort_memberships`, `training_reminder_log`, `notifications` | Realtime not needed for the cron worker itself; resulting notifications surface through existing notification live views and training refresh. | `partially working` |
| Support, documents, and resource realtime parity | `/admin/support`, `/client-hub/support`, `/admin/documents`, `/client-hub/documents`, `/admin/resources`, `/client-hub/resources` | admin, client, learner | Support and documents now use live Supabase subscriptions. Training resources already refresh through the training realtime bridge. | Support and documents already had CRUD APIs; this pass added `realtimeTables` subscriptions on the UI. | `support_tickets`, `support_ticket_messages`, `document_collections`, `documents`, `training_resources` | All three areas now refresh without manual polling-only behavior. | `fully working` |

## A. Pass/Fail Audit By Feature

| Feature | Result | Reason |
| --- | --- | --- |
| Session edit, reschedule, cancel | `PASS` | Admin session workspace now performs the actual lifecycle actions and notifies learners. |
| Learner invite, activation, onboarding | `PASS` | Invite is sent, activation is automatic on matching sign-in, onboarding is completable from the client dashboard. |
| Prework completion and approval | `PASS` | Learner and admin states are both operational with realtime refresh. |
| Assessment evidence upload and review | `PASS` | File upload, storage metadata, admin review links, and submission events are live. |
| Assessment reopen, override, grading history | `PASS` | Admin lifecycle controls and learner-visible history are both live. |
| Certificate generation, storage, download | `PASS` | Award flow now creates and stores an artifact and exposes signed downloads. |
| Automated scheduled reminders | `FAIL` | Backend automation route and cron config exist, but there is still no operations UI or observed production run history in this pass. |
| Cohort edit/reschedule/cancel | `FAIL` | Cohort creation exists, but cohort lifecycle management UI and API are still missing. |
| Support/documents realtime parity | `PASS` | Support and document areas now subscribe to realtime changes. |
| Training resource management depth | `FAIL` | Resource release is live, but edit/version/retire flows are still missing. |

## B. Still Schema-Only Or Backend-Only

- `training_reminder_log` is backend-only. The table is active and populated by cron logic, but there is no admin UI to inspect reminder health, duplicates, or failures.
- Cohort lifecycle fields on `training_cohorts` are still mostly backend/schema support. There is no admin editor to change sponsor, date range, or cancel/archive a cohort.
- Certificate artifacts are operational, but only as stored HTML. There is no richer certificate registry UI or downloadable PDF rendering pipeline.
- `training_cohort_trainers` supports multi-trainer assignment in schema, but the admin UI still only sets the lead trainer at cohort creation time.

## C. Top 10 Remaining Blockers Before Production

1. Cohort edit, archive, and cancel workflow is still missing from the admin programmes page.
2. Reminder automation has no admin operations console, retry tool, or visible health state.
3. Invite flow is email-driven, not a true Supabase invite-token acceptance journey with explicit invitation states in auth.
4. Training resources can be created, but there is no edit, retire, or version-management UI for existing resource records.
5. Cohort trainer assignment is still shallow. There is no editor for adding/removing multiple trainers after cohort creation.
6. Certificate generation produces stored HTML only; there is no PDF pipeline, signature asset, or public verification link.
7. Assessment grading has event history, but there is no rubric model or criterion-by-criterion scoring.
8. Prework review captures only the current note and state; there is no historical audit trail for repeated prework review changes.
9. Automated reminder flow currently generates in-app notifications only. Scheduled email reminders are not implemented.
10. There is still no automated end-to-end test coverage for the full learner journey from invite to certification.

## D. Exact Implementation Order

1. Build cohort lifecycle management on `/admin/training` with edit, reschedule, archive, and cancel actions.
2. Add an admin reminder operations view backed by `training_reminder_log` so the cron layer is observable.
3. Upgrade invite flow from email-only onboarding to a true auth invitation/acceptance workflow.
4. Add full training resource management: edit existing resource, retire resource, and manage version labels.
5. Add multi-trainer assignment management for each cohort.
6. Add rubric tables and rubric-based grading UI for assessments.
7. Add prework review history so each review change is auditable.
8. Add scheduled SMTP reminder emails for sessions, assessments, grading queue alerts, and certificate-ready notices.
9. Add PDF certificate rendering and a formal certificate registry view.
10. Add automated test coverage for invite, onboarding, prework, assessment submission, grading, and certification.

## Training Tabs Audit

| Tab | Route | Status | Validation note |
| --- | --- | --- | --- |
| Admin dashboard | `/admin` | `fully working` | Live training metrics and links are generated from Supabase-backed training data. |
| Programmes | `/admin/training` | `partially working` | Cohort create is live, but cohort lifecycle editing is still missing. |
| Sessions | `/admin/sessions` | `fully working` | Session editing, rescheduling, cancelling, attendance, prework review, and reminders are live. |
| Learners | `/admin/learners` | `fully working` | Learner invite, membership role updates, portal role assignment, activation visibility, and onboarding visibility are live. |
| Assessments | `/admin/assessments` | `fully working` | Release, grading, return, reopen, override, evidence review, and grading history are live. |
| Resources | `/admin/resources` | `partially working` | Release is live, but editing and version-management are missing. |
| Progress | `/admin/progress` | `fully working` | Certificate review, award, revoke, and artifact download are live. |
| Client overview | `/client-hub` | `fully working` | Dashboard now includes onboarding state plus live training metrics. |
| Session calendar | `/client-hub/schedule` | `fully working` | Learners can see sessions and mark prework done. |
| Syllabus | `/client-hub/syllabus` | `partially working` | Module breakdown is live, but the pathway overview still uses static blueprint content. |
| Exams & tasks | `/client-hub/assessments` | `fully working` | Submission, file upload, feedback, status, retake, and history are live. |
| Resources | `/client-hub/resources` | `fully working` | Live resource visibility is operational and refreshes through the training realtime bridge. |
| Progress | `/client-hub/progress` | `fully working` | Progress metrics, certification state, and certificate download are live. |
| Support | `/client-hub/support` | `fully working` | Live support queue with realtime updates. |
| Documents | `/client-hub/documents` | `fully working` | Live shared document view with realtime updates. |
