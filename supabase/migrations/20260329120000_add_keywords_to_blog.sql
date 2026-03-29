-- Add keywords field to blog_posts for SEO
alter table if exists public.blog_posts
  add column if not exists keywords text;

-- Set default keywords from title for existing posts
update public.blog_posts
set keywords = title
where keywords is null and title is not null;
