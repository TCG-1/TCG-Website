# Portal Access Schema Notes

This schema covers the account and operations layer that was still missing after the admin/client data and site-content passes.

## Missing Feature Coverage Added

### Accounts And Roles

- `role_definitions`
- `admin_accounts`
- `admin_account_roles`
- `client_accounts`
- `client_account_roles`

These support real admin and client user records instead of relying on:

- environment-variable-only admin login
- no real client-side portal accounts

### Profile And Settings

- `account_preferences`

This supports:

- edit profile settings
- theme/timezone/locale preferences
- future dashboard personalization

### Security And Password Workflows

- `account_security_events`
- `account_sessions`
- `password_change_requests`

This supports:

- sign-in history
- session management
- password change/reset records
- security auditing

### Notifications And Announcements

- `notification_templates`
- `notifications`
- `notification_preferences`
- `announcements`

This supports:

- the existing notification/settings affordances in the portal UI
- unread state
- delivery preferences
- admin-to-client or platform-wide announcements

### Support And Collaboration

- `support_tickets`
- `support_ticket_messages`
- `portal_tasks`
- `task_comments`
- `activity_feed_events`

This supports:

- support inboxes
- threaded issues
- internal and shared task management
- visible activity timelines

### Search, Saved Views, And Documents

- `saved_views`
- `search_history`
- `document_collections`
- `documents`
- `document_access_rules`

This supports:

- saved filters
- search history
- client document rooms
- role-based or user-based document access

### Platform Operations

- `integration_settings`
- `feature_flags`

This supports:

- external integration configuration
- staged feature rollout

## Current App Gap

The current app still does **not** use these tables yet.

Examples:

- admin login still comes from `src/lib/admin-auth.ts`
- the client hub has settings/search/notification UI but no persisted backing state
- there is no client-side authentication flow yet
- there is no ticket inbox, profile editor, or notification center yet

This schema is the foundation for that next implementation layer.
