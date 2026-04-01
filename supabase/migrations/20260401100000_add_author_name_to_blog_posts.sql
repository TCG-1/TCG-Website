alter table if exists public.blog_posts
  add column if not exists author_name text;

update public.blog_posts
set author_name = coalesce(author_name, 'Tacklers Consulting Group')
where author_name is null;
