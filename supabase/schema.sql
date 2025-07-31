-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE verification_method AS ENUM ('email', 'orcid', 'manual');
CREATE TYPE subscription_tier AS ENUM ('free', 'supporter', 'science_box');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    institution TEXT NOT NULL,
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_method verification_method,
    orcid_id TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletters table
CREATE TABLE public.newsletters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    newsletter_id UUID REFERENCES public.newsletters(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (followers)
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subscriber_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subscriber_id, author_id)
);

-- Payments table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status payment_status DEFAULT 'pending',
    subscription_tier subscription_tier NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_newsletters_author_id ON public.newsletters(author_id);
CREATE INDEX idx_newsletters_slug ON public.newsletters(slug);
CREATE INDEX idx_newsletters_created_at ON public.newsletters(created_at DESC);
CREATE INDEX idx_newsletters_tags ON public.newsletters USING GIN(tags);
CREATE INDEX idx_comments_newsletter_id ON public.comments(newsletter_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_subscriptions_subscriber_id ON public.subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_author_id ON public.subscriptions(author_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_verified ON public.users(is_verified);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Verified users can view other verified users" ON public.users
    FOR SELECT USING (is_verified = TRUE);

-- Newsletters policies
CREATE POLICY "Anyone can view public newsletters" ON public.newsletters
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Authors can view their own newsletters" ON public.newsletters
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Verified users can create newsletters" ON public.newsletters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_verified = TRUE
        )
    );

CREATE POLICY "Authors can update their own newsletters" ON public.newsletters
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own newsletters" ON public.newsletters
    FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view comments on public newsletters" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.newsletters 
            WHERE id = newsletter_id AND is_public = TRUE
        )
    );

CREATE POLICY "Authors can view comments on their newsletters" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.newsletters 
            WHERE id = newsletter_id AND author_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Comment authors can update their comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can delete their own subscriptions" ON public.subscriptions
    FOR DELETE USING (auth.uid() = subscriber_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'))
           || '-' || extract(epoch from now())::text;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(newsletter_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.newsletters 
    SET view_count = view_count + 1 
    WHERE id = newsletter_uuid;
END;
$$ LANGUAGE plpgsql; 