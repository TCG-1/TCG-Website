# Lean Training Delivery Audit

Validated on `2026-03-27` against the current Next.js app, training API routes, and Supabase-backed training system. `npm run build` passed after the latest cohort lifecycle changes.

## Execution Audit

| Feature | Route | User role | UI state | Backend logic | Database tables used | Realtime requirement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Cohort and session edit, reschedule, cancel | `/admin/training`, `/admin/sessions`, reflected on `/client-hub`, `/client-hub/schedule` | `admin_owner`, `trainer`, `client_manager`, `learner` | Admin has cohort lifecycle controls plus session lifecycle, attendance, and readiness controls. Learners see updated cohort/session state in portal notifications and schedule. | `PATCH /api/admin/training/cohorts/[id]`, `PATCH /api/admin/training/sessions/[id]`, `PATCH /api/admin/training/sessions/[id]/attendance`, session reminder route, admin audit writes, client notifications | `training_cohorts`, `training_cohort_trainers`, `training_sessions`, `training_cohort_memberships`, `training_session_attendance`, `notifications`, `admin_audit_log` | Required. Admin/client layouts subscribe to training tables and notifications so updates refresh automatically. | fully working |
| Learner invite, activation, onboarding | `/admin/learners`, `/sign-in`, `/client-hub` | `admin_owner`, `trainer`, `learner`, `client_manager` | Admin can invite learners. Invited users are activated on first portal sign-in and see onboarding completion in the client hub. | `POST /api/admin/training/learners`, portal account bootstrap in `ensureClientPortalContext`, `POST /api/client/training/onboarding`, invite notification + invite email | `client_accounts`, `client_account_roles`, `training_cohort_memberships`, `notifications` | Required. `client_accounts`, memberships, and notifications are subscribed so activation and onboarding changes show quickly. | fully working |
| Prework completion and approval | `/client-hub/schedule`, `/admin/sessions` | `learner`, `admin_owner`, `trainer` | Learners mark prework done. Admin reviews and approves or returns it inside session operations. | `PATCH /api/client/training/prework/[id]`, `PATCH /api/admin/training/prework/[id]`, client notification fanout | `training_session_prework_items`, `training_session_prework_status`, `training_sessions`, `training_cohort_memberships`, `notifications` | Required. Prework tables are in the training realtime bridge. | fully working |
| Assessment evidence upload and review | `/client-hub/assessments`, `/admin/assessments` | `learner`, `admin_owner`, `trainer` | Learner form supports text plus evidence file upload. Admin sees submission text, evidence file link, score, and feedback state. | `POST /api/client/training/assessments/[id]` multipart upload, `PATCH /api/admin/training/assessments/submissions/[id]`, signed evidence URLs | `training_assessments`, `training_assessment_submissions`, `training_assessment_submission_events`, `training_cohort_memberships`, `notifications`, storage bucket `training-evidence` | Required. Assessment tables and submission events are subscribed. | fully working |
| Assessment reopen, override, grading history | `/admin/assessments`, `/client-hub/assessments` | `admin_owner`, `trainer`, `learner` | Admin can grade, return, reopen, override pass, override fail. Learner sees lifecycle, history, feedback, attempts remaining, and retake state. | `PATCH /api/admin/training/assessments/submissions/[id]`, submission event logging, status recalculation, notification fanout | `training_assessment_submissions`, `training_assessment_submission_events`, `training_progress_snapshots`, `notifications` | Required. Submission changes must reflect in learner portal without reload. | fully working |
| Certificate artifact generation, storage, download | `/admin/progress`, `/client-hub/progress` | `admin_owner`, `trainer`, `learner`, `client_manager` | Admin awards/revokes certificates. Learner sees certificate status and can download the generated artifact. | `POST/PATCH /api/admin/training/certificates`, artifact generation and upload, signed download URL generation, certificate email | `training_certificates`, `training_cohort_memberships`, `training_progress_snapshots`, `notifications`, storage bucket `training-certificates` | Required. Certificate state is subscribed in training realtime bridge. | fully working |
| Automated scheduled reminders for sessions, assessments, grading, certificates | `/api/cron/training-reminders`, surfaced in `/admin/notifications`, `/client-hub/notifications`, schedule/assessment/progress pages | system + all portal roles | Reminder effects are visible as notifications in portal UIs, but there is no dedicated reminder ops console yet. | Hourly cron route, dedupe via reminder log, notification fanout for session, assessment, grading queue, certificate-ready, certificate-awarded reminders | `training_reminder_log`, `notifications`, `training_sessions`, `training_assessments`, `training_assessment_submissions`, `training_certificates`, `training_cohort_memberships` | Required. Notification pages already subscribe live. | partially working |
| Support, documents, and resources on realtime standard | `/admin/support`, `/client-hub/support`, `/admin/documents`, `/client-hub/documents`, `/admin/resources`, `/client-hub/resources` | `admin_owner`, `trainer`, `client_manager`, `learner` | Support and documents use live API subscriptions. Resources refresh through the training realtime bridge and show live resource releases in both portals. | Support/document APIs plus resource creation route, live refresh via `useLiveApi` and `TrainingRealtimeBridge` | `support_tickets`, `support_messages`, `documents`, `document_access_rules`, `training_resources`, `notifications` | Required. Support/documents subscribe directly; resources refresh through layout-level training realtime. | fully working |

## Training Tab Audit

| Route | Scope | Status | Validation |
| --- | --- | --- | --- |
| `/admin` | Training operations overview | fully working | Reads live cohort, session, learner, assessment, and progress signals from Supabase-backed training workspaces. |
| `/admin/training` | Cohort and programme operations | partially working | Cohort creation and cohort lifecycle management are operational, but secondary trainer assignment and archive/closeout controls are still missing. |
| `/admin/sessions` | Session delivery operations | fully working | Schedule, edit, reschedule, cancel, attendance capture, prework approval, and reminders are live. |
| `/admin/learners` | Learner operations and access | partially working | Invite, activation visibility, onboarding status, and role assignment work; learner removal/deactivation and invite resend are still missing. |
| `/admin/assessments` | Assessment release and grading | fully working | Assessment release, evidence review, grading, reopen, overrides, history, and reminders are live. |
| `/admin/resources` | Resource publishing | partially working | Resource release is live and realtime-visible, but edit, versioning, retirement, and document rebinding are missing. |
| `/admin/progress` | Certification and risk review | partially working | Live health metrics and certificate award/revoke work; there is no cohort closeout workflow or reminder-log monitoring UI. |
| `/client-hub` | Learner overview | partially working | Live overview, onboarding, next session, resources, assessment summary, and readiness are live, but some explanatory panels still use static blueprint copy. |
| `/client-hub/schedule` | Learner session calendar | fully working | Upcoming sessions, prework status, and session state updates are operational and realtime-refreshed. |
| `/client-hub/syllabus` | Learner syllabus | partially working | Module list/status comes from live training data, but the supporting workflow explainer is still static and module drilldown is missing. |
| `/client-hub/assessments` | Learner assessment lifecycle | fully working | Submit evidence, see status, view feedback/history, and retake after reopen. |
| `/client-hub/resources` | Learner resources | partially working | Live released resources render correctly, but there is no richer filtering/version state or download analytics. |
| `/client-hub/progress` | Learner progress and certification | partially working | Live progress and certificate download work, but no milestone timeline or detailed certification review state is shown. |
| `/admin/support` | Support ops | fully working | Live ticket list, threaded responses, and realtime refresh are operational. |
| `/client-hub/support` | Learner support | fully working | Ticket creation, thread updates, and live sync are operational. |
| `/admin/documents` | Document management | fully working | Publish/edit document metadata and visibility with realtime sync into the client portal. |
| `/client-hub/documents` | Learner documents | fully working | Live document feed reflects admin changes in realtime. |

## A. Pass/Fail Audit By Feature

Pass means `fully working`. Fail means anything `partially working` or `missing`.

| Feature | Result | Reason |
| --- | --- | --- |
| Cohort and session edit, reschedule, cancel | Pass | Admin UI, backend routes, audit writes, notifications, and realtime refresh are operational. |
| Learner invite, activation, onboarding | Pass | Invite, activation on first access, onboarding completion, and portal reflection are operational. |
| Prework completion and approval | Pass | Learner completion and admin approval loop is working end to end. |
| Assessment evidence upload and review | Pass | Upload, storage, review, and signed evidence access are operational. |
| Assessment reopen, override, grading history | Pass | Reopen, override, grading, feedback, and history are operational. |
| Certificate artifact generation, storage, download | Pass | Award, revoke, artifact storage, download, and certificate email are operational. |
| Automated scheduled reminders | Fail | Cron and notification fanout exist, but there is no reminder monitoring UI or operational replay tooling yet. |
| Support/documents/resources realtime standard | Pass | Support, documents, and resources now refresh to portal users without manual reload. |

## B. What Is Still Schema-Only

These are modeled in tables or columns but are not fully exposed as operational UI/backend behavior yet.

1. Multi-trainer cohort assignment beyond the single primary trainer. `training_cohort_trainers` supports it, but the UI only manages the lead trainer.
2. Session-level `virtual_link`, `facilitator_notes`, and `follow_up_actions`. The fields exist on `training_sessions`, but current admin lifecycle UI does not expose them.
3. Assessment `grading_mode` as a real configurable workflow. The column exists, but the UI currently uses one grading path.
4. Rich document binding from training resources through `training_resources.document_id`. Resource release is live, but the training resources page does not yet manage document linkage/version swaps directly.

## C. Top 10 Remaining Blockers Before Production

1. Add reminder operations visibility: last run, next run, per-kind counts, and failure state for `training_reminder_log`.
2. Add invite resend, revoke invite, and deactivate learner flows in `/admin/learners`.
3. Add cohort closeout/archive workflow so completed cohorts can be formally closed without deleting operational history.
4. Add secondary trainer assignment and reassignment UI for `training_cohort_trainers`.
5. Add session-level virtual link, facilitator note, and follow-up action editing to close the gap between onsite and virtual delivery.
6. Add resource edit, version, retire, and replace flows in `/admin/resources`.
7. Add module drilldown and richer syllabus detail on `/client-hub/syllabus`.
8. Add milestone timeline and certification review breakdown on `/client-hub/progress`.
9. Add evidence file validation hardening and ops controls for large/invalid uploads beyond the current form-level handling.
10. Add integration tests for invite, onboarding, assessment submission, grading, certificate award, and realtime refresh paths.

## D. Exact Implementation Order

1. Build a reminder operations console on `/admin/notifications` backed by `training_reminder_log`.
2. Add learner invite resend, revoke, deactivate, and reenrol actions on `/admin/learners`.
3. Add cohort archive/closeout actions on `/admin/training`.
4. Expose secondary trainer assignment and trainer removal in `/admin/training`.
5. Extend `/admin/sessions` to manage virtual links, facilitator notes, and follow-up actions.
6. Extend `/admin/resources` with edit, versioning, retirement, and document rebinding.
7. Expand `/client-hub/syllabus` with live module drilldowns and outcome detail panels.
8. Expand `/client-hub/progress` with certification readiness timeline and milestone history.
9. Harden evidence upload validation and add clearer admin-side file review states.
10. Add end-to-end regression coverage for the training lifecycle before final production release.
