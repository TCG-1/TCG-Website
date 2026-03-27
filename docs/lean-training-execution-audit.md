# Lean Training Execution Audit

Validated on 2026-03-27 after:
- `npm run build`
- `supabase db push`
- `supabase db push --dry-run`

## Gap Audit Table

| Area | Route | Status | Live Tables / Actions | Remaining Gaps |
| --- | --- | --- | --- | --- |
| Admin dashboard | `/admin` | fully working | Reads `training_cohorts`, `training_sessions`, `training_assessments`, `training_assessment_submissions`, `training_progress_snapshots` | Read-only by design. No issue for this tab. |
| Programmes | `/admin/training` | partially working | Creates cohorts in `training_cohorts`, trainer links in `training_cohort_trainers`, client-manager links in `training_cohort_memberships` | No edit/archive/reschedule workflow, no programme authoring UI, no cohort reassignment screen. |
| Sessions | `/admin/sessions` | partially working | Creates `training_sessions` + `training_session_prework_items`; captures attendance in `training_session_attendance`; sends reminders via `notifications` | No reschedule/cancel/edit UI, no prework approval UI, no facilitator reassignment UI, no bulk attendance import. |
| Learners | `/admin/learners` | partially working | Creates/reuses `client_accounts`; assigns `client_account_roles`; enrols into `training_cohort_memberships`; updates membership role; manages `admin_account_roles` and `client_account_roles` | No invite/resend activation flow, no suspend/archive flow, no bulk learner import, no searchable roster filters. |
| Assessments | `/admin/assessments` | partially working | Creates `training_assessments`; grades `training_assessment_submissions`; sends reminders via `notifications` | No edit/close/reopen UI, no rubric builder, no grading history/audit view by submission, no file-based evidence upload UI. |
| Resources | `/admin/resources` | partially working | Creates `training_resources` | No edit/version/archive flow, no document upload binding, no release scheduling, no expiry logic. |
| Progress | `/admin/progress` | partially working | Reads `training_progress_snapshots`; awards/revokes `training_certificates`; updates `training_cohort_memberships.certification_status` | No intervention tasking, no export/reporting, no cohort trend history, no certificate file generation. |
| Client overview | `/client-hub` | partially working | Reads live sessions, modules, assessments, resources, progress snapshots | Overview is live, but some explanatory panels are still static guidance rather than workflow-driven widgets. |
| Session calendar | `/client-hub/schedule` | partially working | Reads `training_sessions`, `training_session_prework_items`, `training_session_attendance` | No learner prework completion UI, no calendar RSVP/check-in, no download-to-calendar action. |
| Syllabus | `/client-hub/syllabus` | partially working | Reads `training_programme_modules`, `training_module_outcomes`, `training_sessions`, `training_assessments` | Module data is live, but the pathway workflow panel still uses static blueprint content and there is no module release gating UI. |
| Exams & tasks | `/client-hub/assessments` | partially working | Learner submits to `training_assessment_submissions`; reads grading result, pass/fail, feedback, attempts, retake state | Learner lifecycle is operational. Client-manager team drilldown is still summary-only rather than learner-by-learner. No attachment upload UI yet. |
| Resources | `/client-hub/resources` | partially working | Reads `training_resources` | No per-resource completion tracking, no filters by module/audience, no download acknowledgement tracking. |
| Progress | `/client-hub/progress` | partially working | Reads `training_progress_snapshots`, `training_certificates` | Certification status is live, but there is no historical trend chart, coach notes feed, or certificate download file. |

## Missing Workflows

- Cohort maintenance after creation: edit, pause, archive, trainer reassignment, sponsor change.
- Session maintenance after creation: reschedule, cancel, facilitator swap, session outcome notes review.
- Learner invite lifecycle: invite email, activation state, resend invite, suspend/reactivate.
- Prework lifecycle: learner marks prework done, trainer approves, manager monitors completion before session.
- Assessment maintenance: reopen closed assessment, override attempt count, change due date after release.
- Client-manager team drilldown for assessments: per-learner queue, pass/fail, overdue, retake visibility.
- Certificate fulfilment: downloadable certificate artifact, revocation history, certificate ledger view.
- Automated reminders: scheduled reminder jobs for upcoming sessions / overdue assessments, not just immediate in-app sends.

## Missing UI

- Session edit / cancel / reschedule controls.
- Prework completion and approval surfaces for both learner and trainer.
- Learner invite management and account-state controls.
- Assessment editor for released assessments.
- File attachment / evidence upload UI for learner submissions.
- Resource editing, version history, archive, and file-upload UI.
- Certificate download / certificate history UI.
- Team drilldown UI for client managers inside `/client-hub/assessments`.

## Missing Backend Logic

- Scheduled reminder automation. Current reminder flow is event-driven or manual, not cron-driven.
- Assessment grading history / multiple grader audit trail.
- Invite token / activation flow for newly created learner accounts.
- Certificate document generation.
- Resource version control and scheduled publish windows.
- Cohort/session update endpoints for edit/reschedule/cancel.

## Missing Database Support

- Submission attachment storage is still not modeled as a first-class training table. Current submission flow stores text plus optional `evidence_link`, not uploaded evidence records.
- Certificate artifacts are represented as `training_certificates` records only; there is no certificate file/document linkage table yet.
- No dedicated training reminder job queue or delivery log table for automated sends.
- No assessment rubric / criteria tables yet.

## Schema-Only Features

- `training_session_prework_status`: table and triggers exist, but there is still no learner/trainer UI to complete or approve prework.
- `training_assessment_submissions.evidence_link`: the field exists, but there is no operational upload flow backing it.
- `training_certificates`: now operational for award/revoke records, but still schema-only for downloadable certificate artifacts.

## Missing Realtime Sync

- Training pages now refresh in realtime for `training_*` tables plus role-assignment tables.
- Notification pages now subscribe live to `notifications`.
- Still missing realtime subscription for support tickets/messages and document updates if those areas are expected to behave like live training ops.
- Because learner invites are not implemented yet, there is no realtime activation flow for newly added learners.

## Priority Order For Next Implementation

1. Build cohort/session edit and reschedule flows so delivery operations are maintainable after creation.
2. Add learner invite + activation workflow so enrolment is a complete operational path, not just database creation.
3. Add prework completion / approval UI backed by `training_session_prework_status`.
4. Add attachment upload support for assessment evidence and expose it in grading.
5. Build assessment maintenance tools: reopen, extend due date, override attempts, change status.
6. Add certificate artifact generation and learner download access.
7. Replace the remaining static syllabus/workflow panels with live module-release states.
8. Add scheduled reminder automation and reminder logs.
