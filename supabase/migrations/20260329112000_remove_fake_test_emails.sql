delete from public.lead_submissions
where lower(email) similar to '(e2e-%|probe-%|qa-%|test-%|test[0-9]%)@%'
   or lower(email) like '%.example';

delete from public.client_accounts
where lower(email) similar to '(e2e-%|probe-%|qa-%|test-%|test[0-9]%)@%'
   or lower(email) like '%.example';

delete from public.newsletter_subscriptions
where lower(email) similar to '(e2e-%|probe-%|qa-%|test-%|test[0-9]%)@%'
   or lower(email) like '%.example';
