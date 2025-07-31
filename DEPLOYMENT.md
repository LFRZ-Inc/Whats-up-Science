# Deployment Guide for "What's Up Science"

## 🚀 **Quick Start**

### **1. Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://boagveounetciozkmwyj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvYWd2ZW91bmV0Y2lvemttd3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTg5OTgsImV4cCI6MjA2OTU3NDk5OH0.8OHPnzFK8bD6qHlGgbRo8UbG4oQUsAdTK4mB6aoJIHc
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Configuration (Optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **2. Get Your Service Role Key**

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/boagveounetciozkmwyj
2. Navigate to Settings > API
3. Copy the "service_role" key (not the anon key)
4. Replace `your_service_role_key_here` in your `.env.local` file

### **3. Database Setup**

✅ **COMPLETED** - Your database schema has been applied to Supabase!

The following tables have been created:
- `users` - User profiles and verification status
- `newsletters` - Published articles
- `comments` - User comments on articles
- `subscriptions` - User following relationships
- `payments` - Stripe payment records

All Row Level Security (RLS) policies are in place for data protection.

### **4. GitHub Repository Setup**

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: What's Up Science platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/whats-up-science.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **5. Vercel Deployment**

1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub account
3. Import your `whats-up-science` repository
4. Add environment variables in Vercel dashboard:
   - Copy all variables from your `.env.local` file
5. Deploy!

### **6. Supabase Authentication Setup**

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable the following providers:
   - **Email**: Already enabled
   - **Google**: Add your Google OAuth credentials
   - **ORCID**: Add your ORCID OAuth credentials (for scientist verification)

### **7. Stripe Setup (Optional)**

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Update your environment variables
4. Set up webhook endpoints in Stripe dashboard

## 🔧 **Development Commands**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📊 **Database Schema Overview**

### **Tables Created:**
- **users**: Extended auth.users with verification and profile data
- **newsletters**: Published articles with metadata
- **comments**: User comments and discussions
- **subscriptions**: User following relationships
- **payments**: Stripe payment tracking

### **Key Features:**
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Automatic slug generation for newsletters
- ✅ View count tracking
- ✅ Verification system support
- ✅ Subscription management
- ✅ Payment processing ready

## 🎯 **Next Steps**

1. **Test the Platform**: Run `npm run dev` and test all features
2. **Set up Authentication**: Configure Google and ORCID OAuth
3. **Add Stripe**: Set up payment processing when ready
4. **Deploy to Vercel**: Make it live for testing
5. **Invite Founding Scientists**: Start your beta program

## 🔐 **Security Notes**

- All database tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Verified scientists can only create content
- Public content is readable by everyone
- Private drafts are only visible to authors

## 📞 **Support**

If you encounter any issues:
1. Check the Supabase dashboard for database errors
2. Review Vercel deployment logs
3. Check browser console for client-side errors
4. Verify environment variables are set correctly

Your platform is now ready for development and testing! 🎉 