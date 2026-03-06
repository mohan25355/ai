-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create departments table
CREATE TABLE public.departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES public.categories(id),
  location TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT,
  fraud_probability DECIMAL(3,2),
  predicted_resolution_days INTEGER,
  assigned_department INTEGER REFERENCES public.departments(id),
  root_cause TEXT,
  suggested_solution TEXT,
  estimated_cost_min DECIMAL(12,2),
  estimated_cost_max DECIMAL(12,2),
  sentiment TEXT,
  main_issue TEXT,
  ai_analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hbrysjxtxfdwysonyxhp_complaint_images', 'hbrysjxtxfdwysonyxhp_complaint_images', true);

-- Storage policies for complaint images
CREATE POLICY "Anyone can upload complaint images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'hbrysjxtxfdwysonyxhp_complaint_images');

CREATE POLICY "Anyone can view complaint images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'hbrysjxtxfdwysonyxhp_complaint_images');

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
  ('Road Damage', 'Potholes, cracks, and road infrastructure issues'),
  ('Water Supply', 'Water shortage, contamination, and supply issues'),
  ('Electricity', 'Power outages, faulty connections, and electrical issues'),
  ('Sanitation', 'Garbage collection, drainage, and cleanliness issues'),
  ('Public Safety', 'Street lighting, security, and safety concerns');

-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
  ('Public Works Department', 'Handles road and infrastructure maintenance'),
  ('Water Supply Department', 'Manages water supply and distribution'),
  ('Electricity Board', 'Handles electrical infrastructure and supply'),
  ('Sanitation Department', 'Manages waste collection and cleanliness'),
  ('Police Department', 'Handles public safety and security');

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);

-- Departments policies (public read)
CREATE POLICY "Anyone can view departments" ON departments
  FOR SELECT TO anon, authenticated USING (true);

-- Complaints policies
CREATE POLICY "Anyone can create complaints" ON complaints
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can view complaints" ON complaints
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete complaints" ON complaints
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Create trigger for user sync
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CMA' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;