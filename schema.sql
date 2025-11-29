-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('super_admin', 'business_admin', 'staff')) default 'business_admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'business_admin');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Customers Table
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  first_name text,
  last_name text,
  phone text,
  email text,
  date_of_birth date,
  gender text,
  interests text[],
  
  -- AI/Computed Fields
  rfm_score jsonb,
  clv numeric,
  segmentation_status text,
  
  -- Aggregated Fields
  last_purchase_date timestamp with time zone,
  total_transactions integer default 0,
  total_spend numeric default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  selling_price numeric not null,
  cost_price numeric,
  unit text,
  usage_duration_days integer, -- For proactive alerts
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions Table
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete set null,
  total_amount numeric not null,
  status text default 'completed',
  payment_method text,
  transaction_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transaction Items Table
create table if not exists transaction_items (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks Table
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text check (type in ('Call', 'SMS', 'LINE', 'Other')) default 'Other',
  status text check (status in ('Pending', 'Completed', 'Overdue')) default 'Pending',
  due_date timestamp with time zone not null,
  customer_id uuid references customers(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table customers enable row level security;
alter table products enable row level security;
alter table transactions enable row level security;
alter table transaction_items enable row level security;
alter table tasks enable row level security;

-- Simple policies (allow all authenticated users to read/write for now)

-- Customers Policies
drop policy if exists "Enable read access for authenticated users" on customers;
create policy "Enable read access for authenticated users" on customers for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on customers;
create policy "Enable insert access for authenticated users" on customers for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on customers;
create policy "Enable update access for authenticated users" on customers for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete access for authenticated users" on customers;
create policy "Enable delete access for authenticated users" on customers for delete using (auth.role() = 'authenticated');

-- Products Policies
drop policy if exists "Enable read access for authenticated users" on products;
create policy "Enable read access for authenticated users" on products for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on products;
create policy "Enable insert access for authenticated users" on products for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on products;
create policy "Enable update access for authenticated users" on products for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete access for authenticated users" on products;
create policy "Enable delete access for authenticated users" on products for delete using (auth.role() = 'authenticated');

-- Transactions Policies
drop policy if exists "Enable read access for authenticated users" on transactions;
create policy "Enable read access for authenticated users" on transactions for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on transactions;
create policy "Enable insert access for authenticated users" on transactions for insert with check (auth.role() = 'authenticated');

-- Transaction Items Policies
drop policy if exists "Enable read access for authenticated users" on transaction_items;
create policy "Enable read access for authenticated users" on transaction_items for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on transaction_items;
create policy "Enable insert access for authenticated users" on transaction_items for insert with check (auth.role() = 'authenticated');

-- Tasks Policies
drop policy if exists "Enable read access for authenticated users" on tasks;
create policy "Enable read access for authenticated users" on tasks for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on tasks;
create policy "Enable insert access for authenticated users" on tasks for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on tasks;
create policy "Enable update access for authenticated users" on tasks for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete access for authenticated users" on tasks;
create policy "Enable delete access for authenticated users" on tasks for delete using (auth.role() = 'authenticated');

-- Tenants Table (Shop Settings)
create table if not exists tenants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add tenant_id to profiles if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'tenant_id') then
    alter table profiles add column tenant_id uuid references tenants(id);
  end if;
end $$;

-- Enable RLS for tenants
alter table tenants enable row level security;

-- Tenants Policies
drop policy if exists "Enable read access for authenticated users" on tenants;
create policy "Enable read access for authenticated users" on tenants for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on tenants;
create policy "Enable insert access for authenticated users" on tenants for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on tenants;
create policy "Enable update access for authenticated users" on tenants for update using (auth.role() = 'authenticated');

-- Automation Journeys Table
create table if not exists automation_journeys (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text check (status in ('draft', 'active', 'paused', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Journey Versions Table (Stores the actual flow definition)
create table if not exists journey_versions (
  id uuid default gen_random_uuid() primary key,
  journey_id uuid references automation_journeys(id) on delete cascade,
  version_number integer not null,
  definition jsonb not null, -- Stores the React Flow nodes and edges
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Automation Journeys
alter table automation_journeys enable row level security;
alter table journey_versions enable row level security;

-- Automation Journeys Policies
drop policy if exists "Enable read access for authenticated users" on automation_journeys;
create policy "Enable read access for authenticated users" on automation_journeys for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on automation_journeys;
create policy "Enable insert access for authenticated users" on automation_journeys for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on automation_journeys;
create policy "Enable update access for authenticated users" on automation_journeys for update using (auth.role() = 'authenticated');

drop policy if exists "Enable delete access for authenticated users" on automation_journeys;
create policy "Enable delete access for authenticated users" on automation_journeys for delete using (auth.role() = 'authenticated');

-- Journey Versions Policies
drop policy if exists "Enable read access for authenticated users" on journey_versions;
create policy "Enable read access for authenticated users" on journey_versions for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on journey_versions;
create policy "Enable insert access for authenticated users" on journey_versions for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on journey_versions;
create policy "Enable update access for authenticated users" on journey_versions for update using (auth.role() = 'authenticated');

-- Journey Enrollments Table (Tracks user progress)
create table if not exists journey_enrollments (
  id uuid default gen_random_uuid() primary key,
  journey_id uuid references automation_journeys(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  current_node_id text, -- ID of the node in the JSON definition
  status text check (status in ('active', 'completed', 'failed', 'cancelled')) default 'active',
  context jsonb default '{}'::jsonb, -- Store temporary data for the journey
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Journey Logs Table (Execution history)
create table if not exists journey_logs (
  id uuid default gen_random_uuid() primary key,
  enrollment_id uuid references journey_enrollments(id) on delete cascade,
  node_id text,
  action text, -- 'enter', 'exit', 'process', 'error'
  message text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table journey_enrollments enable row level security;
alter table journey_logs enable row level security;

-- Policies for Enrollments
drop policy if exists "Enable read access for authenticated users" on journey_enrollments;
create policy "Enable read access for authenticated users" on journey_enrollments for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on journey_enrollments;
create policy "Enable insert access for authenticated users" on journey_enrollments for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on journey_enrollments;
create policy "Enable update access for authenticated users" on journey_enrollments for update using (auth.role() = 'authenticated');

-- Policies for Logs
drop policy if exists "Enable read access for authenticated users" on journey_logs;
create policy "Enable read access for authenticated users" on journey_logs for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on journey_logs;
create policy "Enable insert access for authenticated users" on journey_logs for insert with check (auth.role() = 'authenticated');
