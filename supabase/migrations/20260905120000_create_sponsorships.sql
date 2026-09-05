create table public.sponsorship_submissions (
  id uuid default gen_random_uuid() primary key,
  org_name text not null,
  contact_person text not null,
  email text not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) but allow anonymous inserts (since it's a public contact form)
alter table public.sponsorship_submissions enable row level security;

create policy "Allow public inserts" 
on public.sponsorship_submissions for insert 
to public 
with check (true);
