-- Allow NULL user_id for testing without authentication
-- Run this migration to enable testing without creating auth users

-- First, drop the foreign key constraint
alter table applications
  drop constraint if exists applications_user_id_fkey;

-- Make user_id nullable
alter table applications
  alter column user_id drop not null;

-- Re-add the foreign key constraint but make it optional (ON DELETE SET NULL instead of CASCADE)
-- This allows user_id to be null or reference a valid user
alter table applications
  add constraint applications_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete set null;

-- Update RLS policies to allow testing
alter table applications enable row level security;
alter table documents enable row level security;
alter table extracted_fields enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own applications" on applications;
drop policy if exists "Users can create own applications" on applications;
drop policy if exists "Users can update own applications" on applications;
drop policy if exists "Users can view own documents" on documents;
drop policy if exists "Users can create own documents" on documents;
drop policy if exists "Users can view own extracted fields" on extracted_fields;

-- Create permissive policies for testing
create policy "Allow all operations on applications for testing"
  on applications for all
  using (true)
  with check (true);

create policy "Allow all operations on documents for testing"
  on documents for all
  using (true)
  with check (true);

create policy "Allow all operations on extracted_fields for testing"
  on extracted_fields for all
  using (true)
  with check (true);
