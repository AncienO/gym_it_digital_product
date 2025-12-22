-- Create notices table
create table public.notices (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.notices enable row level security;

-- Policies
-- Everyone can view active notices
create policy "Active notices are viewable by everyone" 
  on public.notices for select 
  using (is_active = true);

-- Admins can do everything (assuming admin check via role or separate admin table/auth claim)
-- Since the current schema.sql showed `profiles` table with `role`, we'll check that.
-- Policy for admins to view all (including inactive)
create policy "Admins can view all notices" 
  on public.notices for select 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policy for admins to insert
create policy "Admins can insert notices" 
  on public.notices for insert 
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policy for admins to update
create policy "Admins can update notices" 
  on public.notices for update 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policy for admins to delete
create policy "Admins can delete notices" 
  on public.notices for delete 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
