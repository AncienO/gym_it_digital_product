-- Users table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  phone_number text,
  role text default 'user',
  created_at timestamptz default now()
);

-- Products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  price_usd decimal(10, 2), -- Optional USD price for international customers
  image_url text, -- Public URL for product image
  file_url text not null, -- Secure URL or path in Storage for the digital product
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- Nullable for guest checkout
  customer_email text not null, -- Required for product delivery
  customer_phone text, -- Optional, for MoMo payment reference if needed
  total_amount decimal(10, 2) not null,
  currency text default 'GHS',
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  payment_provider text default 'mtn_momo',
  payment_reference text, -- External transaction ID
  created_at timestamptz default now()
);

-- Order Items (for multiple products in one order)
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders not null,
  product_id uuid references public.products not null,
  price_at_purchase decimal(10, 2) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies (Basic examples, refine as needed)
-- Products are viewable by everyone
create policy "Products are viewable by everyone" on public.products for select using (true);

-- Orders are viewable by the user who created them (if authenticated) or via secure token (future impl)
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id);

-- Profiles are viewable by the user who owns them
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
