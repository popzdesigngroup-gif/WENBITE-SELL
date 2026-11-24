-- ==============================================================================
-- VIPER AI STUDIO: Complete PostgreSQL Database Schema for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'creator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'Video',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Videos (AI Assets)
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  prompt TEXT, -- AI Prompt used to generate
  model_used TEXT DEFAULT 'Sora / Runway Gen-3 / Kling',
  duration INTEGER NOT NULL DEFAULT 5, -- in seconds
  resolution TEXT NOT NULL DEFAULT '4K', -- 4K, 1080p, 8K
  fps INTEGER DEFAULT 60,
  aspect_ratio TEXT DEFAULT '16:9',
  preview_url TEXT NOT NULL, -- Watermarked/compressed web preview
  thumbnail_url TEXT NOT NULL,
  r2_master_key TEXT NOT NULL, -- Secure S3/R2 object key for high-res master file
  r2_master_file_size_mb NUMERIC(10,2) DEFAULT 85.5,
  price NUMERIC(10, 2) NOT NULL DEFAULT 499.00,
  sale_price NUMERIC(10, 2),
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bundles
CREATE TABLE IF NOT EXISTS public.bundles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  regular_price NUMERIC(10, 2) NOT NULL,
  badge TEXT DEFAULT 'BEST VALUE',
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bundle Items
CREATE TABLE IF NOT EXISTS public.bundle_videos (
  bundle_id UUID REFERENCES public.bundles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, video_id)
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('video', 'bundle')),
  item_id UUID NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  license_type TEXT DEFAULT 'commercial' CHECK (license_type IN ('personal', 'commercial', 'extended'))
);

-- 9. User Purchased Licenses (Entitlements for Instant Download)
CREATE TABLE IF NOT EXISTS public.user_licenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  license_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  license_type TEXT DEFAULT 'commercial',
  downloads_remaining INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, video_id)
);

-- 10. Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public Read for Catalog
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Public read bundle_videos" ON public.bundle_videos FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

-- User Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- User Licenses (Entitlements)
CREATE POLICY "Users can view their licenses" ON public.user_licenses FOR SELECT USING (auth.uid() = user_id);

-- Admin Full Access (Check profile role = 'admin')
CREATE POLICY "Admin full manage videos" ON public.videos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full manage bundles" ON public.bundles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
