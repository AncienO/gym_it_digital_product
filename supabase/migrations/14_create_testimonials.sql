create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  username text not null,
  text text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table testimonials enable row level security;

create policy "Enable read access for all users"
  on testimonials for select
  using (true);

create policy "Enable insert for admins only"
  on testimonials for insert
  with check (auth.role() = 'service_role' OR exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

create policy "Enable update for admins only"
  on testimonials for update
  using (auth.role() = 'service_role' OR exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));

create policy "Enable delete for admins only"
  on testimonials for delete
  using (auth.role() = 'service_role' OR exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  ));
