alter table if exists public.blog_posts
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists canonical_url text,
  add column if not exists og_image_url text,
  add column if not exists noindex boolean not null default false;

update public.blog_posts
set
  seo_description = coalesce(seo_description, excerpt),
  seo_title = coalesce(seo_title, title),
  og_image_url = coalesce(og_image_url, cover_url)
where true;
