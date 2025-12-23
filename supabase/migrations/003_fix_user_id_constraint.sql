-- Fix user_id constraint to allow NULL values
-- This allows testing without authentication

-- Drop the existing foreign key constraint
alter table applications
  drop constraint applications_user_id_fkey;

-- Re-add the foreign key constraint but allow NULL values
alter table applications
  add constraint applications_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete set null;
