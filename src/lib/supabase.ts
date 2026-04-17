import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// supabase will be null when env vars aren't configured yet.
// Blog pages handle this gracefully with their error/empty states.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as ReturnType<typeof createClient>

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  cover_image_url: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
  read_time_minutes: number | null
}

/*
=== RUN THIS IN SUPABASE SQL EDITOR ===

create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null,
  cover_image_url text,
  category text,
  tags text[],
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  seo_title text,
  seo_description text,
  read_time_minutes integer
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

alter table posts enable row level security;

create policy "Public read published posts"
  on posts for select
  using (published = true);

create policy "Admin full access"
  on posts for all
  using (true)
  with check (true);

-- STORAGE SETUP (run after creating "blog-images" public bucket in dashboard):
-- In Supabase Dashboard → Storage → New Bucket → name: blog-images → Public: ON
-- Then in SQL Editor run:
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admin upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');

create policy "Admin delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images');
*/
