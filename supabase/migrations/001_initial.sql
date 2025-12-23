-- B-OCR Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Applications (loan applications)
create table applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  external_ref varchar(100),
  status varchar(20) default 'pending' check (status in ('pending', 'processing', 'completed', 'error')),
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Documents (uploaded files)
create table documents (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete cascade,
  filename varchar(500) not null,
  file_path varchar(1000) not null,
  file_size integer,
  mime_type varchar(100),
  doc_type varchar(50),
  doc_type_confidence real,
  status varchar(20) default 'pending' check (status in ('pending', 'processing', 'completed', 'error')),
  error_message text,
  ocr_text text,
  created_at timestamptz default now()
);

-- Extracted fields
create table extracted_fields (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  field_key varchar(100) not null,
  field_value text,
  confidence real,
  validation_status varchar(20) default 'pending',
  validation_message text,
  manually_corrected boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index idx_applications_user on applications(user_id);
create index idx_applications_status on applications(status);
create index idx_documents_application on documents(application_id);
create index idx_documents_status on documents(status);
create index idx_fields_document on extracted_fields(document_id);
create index idx_fields_key on extracted_fields(field_key);

-- RLS Policies
alter table applications enable row level security;
alter table documents enable row level security;
alter table extracted_fields enable row level security;

-- Users can only see their own data
create policy "Users see own applications" on applications
  for all using (auth.uid() = user_id);

create policy "Users see own documents" on documents
  for all using (
    application_id in (
      select id from applications where user_id = auth.uid()
    )
  );

create policy "Users see own fields" on extracted_fields
  for all using (
    document_id in (
      select d.id from documents d
      join applications a on d.application_id = a.id
      where a.user_id = auth.uid()
    )
  );

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger applications_updated_at
  before update on applications
  for each row execute function update_updated_at();
