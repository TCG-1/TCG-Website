# Lean Training System Map

This portal is now organized around the real delivery problem: managing Lean training from cohort design through certification readiness.

## Roles

### `admin_owner`
- Scope: `admin_accounts`
- Use: full training operations, governance, reporting, and portal control
- Main permissions:
  - manage programmes, cohorts, sessions, learners, assessments, resources
  - view all progress, risk, and certification signals
  - manage training notifications and supporting operational tools

### `trainer`
- Scope: `admin_accounts`
- Use: delivery and grading
- Main permissions:
  - view assigned cohorts
  - manage assigned sessions
  - view learners in assigned cohorts
  - grade assessments and manage assigned resources

### `client_manager`
- Scope: `client_accounts`
- Use: sponsor or operational owner for a client cohort
- Main permissions:
  - view team-level dashboard, schedule, assessments, progress
  - monitor team readiness and outstanding work
  - access manager-specific packs

### `learner`
- Scope: `client_accounts`
- Use: individual participant
- Main permissions:
  - view own dashboard, sessions, syllabus, resources, and progress
  - submit own assessment evidence
  - raise support

## Core Tables

### Identity and permissions
- `admin_accounts.auth_user_id`
- `client_accounts.auth_user_id`
- `role_definitions`
- `admin_account_roles`
- `client_account_roles`

### Training design
- `training_programmes`
- `training_programme_modules`
- `training_module_outcomes`

### Delivery
- `training_cohorts`
- `training_cohort_trainers`
- `training_cohort_memberships`
- `training_sessions`
- `training_session_prework_items`
- `training_session_prework_status`
- `training_session_attendance`

### Assessment and resources
- `training_assessments`
- `training_assessment_submissions`
- `training_resources`

### Analytics
- `training_progress_snapshots`

## Realtime Flows

The primary training layouts now include a realtime bridge:
- [src/app/admin/layout.tsx](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/src/app/admin/layout.tsx#L1)
- [src/app/client-hub/layout.tsx](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/src/app/client-hub/layout.tsx#L1)
- [src/components/training-portal/training-realtime-bridge.tsx](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/src/components/training-portal/training-realtime-bridge.tsx#L1)

Realtime subscriptions listen to:
- `training_cohorts`
- `training_cohort_memberships`
- `training_sessions`
- `training_session_prework_items`
- `training_session_prework_status`
- `training_session_attendance`
- `training_assessments`
- `training_assessment_submissions`
- `training_resources`
- `training_progress_snapshots`

Frontend behavior:
- any change on those tables triggers `router.refresh()`
- admin updates flow into client pages automatically if the current viewer has access
- learner submissions flow into admin grading and progress pages automatically

## Workflow by Role

### Admin owner
1. Create or activate a cohort.
2. Assign trainer and client manager.
3. Schedule sessions and attach prework.
4. Enrol learners.
5. Publish assessments and resources.
6. Monitor progress and intervene on red signals.

### Trainer
1. Review upcoming session readiness.
2. Deliver session.
3. Check attendance and prework completion.
4. Review submitted evidence.
5. Grade and release feedback.

### Client manager
1. See upcoming sessions for the team.
2. Track who is overdue or at risk.
3. Review manager packs and sponsor context.
4. Coordinate support or escalation before the next milestone.

### Learner
1. Check the next session and prework.
2. Follow the syllabus.
3. Open the right resource pack.
4. Submit assessment evidence.
5. Track readiness and progress.

## Page-to-Table Map

### `/admin`
- Reads: `training_cohorts`, `training_sessions`, `training_assessments`, `training_assessment_submissions`, `training_progress_snapshots`
- Frontend states:
  - cohort health
  - upcoming delivery
  - assessment queue
  - progress indicators

### `/admin/training`
- Reads: `training_cohorts`, `training_programmes`
- Writes: `training_cohorts`, `training_cohort_trainers`, `training_cohort_memberships`
- Actions:
  - create cohort
  - assign trainer
  - assign client manager

### `/admin/sessions`
- Reads: `training_sessions`, `training_session_prework_items`
- Writes: `training_sessions`, `training_session_prework_items`
- Actions:
  - schedule session
  - publish prework checklist

### `/admin/learners`
- Reads: `training_cohort_memberships`, `client_accounts`, `training_progress_snapshots`
- Writes: `client_accounts`, `client_account_roles`, `training_cohort_memberships`
- Actions:
  - create or reuse learner account
  - enrol learner into cohort
  - set cohort role to learner or client manager

### `/admin/assessments`
- Reads: `training_assessments`, `training_assessment_submissions`
- Writes: `training_assessments`
- Actions:
  - create quiz, practical, exam, or reflection
  - open assessment window

### `/admin/resources`
- Reads: `training_resources`, `training_programme_modules`, `training_sessions`
- Writes: `training_resources`
- Actions:
  - release learner, manager, or trainer resources
  - link resource to programme, cohort, and module

### `/admin/progress`
- Reads: `training_progress_snapshots`, `training_cohort_memberships`
- Frontend states:
  - attendance
  - completion
  - certification readiness
  - at-risk learner list

### `/client-hub`
- Reads: `training_sessions`, `training_session_prework_items`, `training_programme_modules`, `training_module_outcomes`, `training_assessments`, `training_resources`, `training_progress_snapshots`
- Frontend states:
  - next session
  - metrics
  - syllabus
  - assessments
  - resources
  - readiness

### `/client-hub/schedule`
- Reads: `training_sessions`, `training_session_prework_items`
- Frontend states:
  - upcoming delivery
  - prework checklist

### `/client-hub/syllabus`
- Reads: `training_programme_modules`, `training_module_outcomes`, `training_sessions`, `training_assessments`
- Frontend states:
  - module status
  - learning outcomes

### `/client-hub/assessments`
- Reads: `training_assessments`, `training_assessment_submissions`
- Writes: `training_assessment_submissions`
- Actions:
  - learner submits assessment evidence
  - client manager monitors outstanding submissions

### `/client-hub/resources`
- Reads: `training_resources`
- Frontend states:
  - role-filtered resources
  - module-linked learning packs

### `/client-hub/progress`
- Reads: `training_progress_snapshots`
- Frontend states:
  - completion
  - attendance
  - assessment average
  - readiness signals

## What Was Redesigned vs Retained

### Redesigned into training-first workspaces
- admin dashboard
- programmes
- sessions
- learners
- assessments
- resources
- progress
- client overview
- client schedule
- client syllabus
- client assessments
- client resources
- client progress

### Retained because they still have real workflows
- notifications
- support
- documents
- profile
- settings

These remain secondary tools rather than the core learning journey.

## Source of Truth

Live training data now comes from:
- [src/lib/training-system.ts](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/src/lib/training-system.ts#L1)
- [supabase/migrations/20260327101500_create_training_delivery_system.sql](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/supabase/migrations/20260327101500_create_training_delivery_system.sql#L1)

The old shared mock file:
- [src/lib/training-portal.ts](/Users/focus/Desktop/App-FullStack/Codex/tackler-clone-napervillenextjs/src/lib/training-portal.ts#L1)

is now only useful for static blueprint copy and should no longer be treated as the live training dataset.
