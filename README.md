# What's Up Science

A full-stack science newsletter platform where verified scientists can publish research and insights, while the public can follow, read, and support them.

## 🎯 Mission

**Science, from scientists. Not influencers.**

We believe in democratizing access to cutting-edge research by connecting verified scientists directly with the public. No clickbait, no sensationalism—just real science from real researchers.

## ✨ Features

### For Scientists
- **Verified Accounts**: Only authenticated researchers can publish
- **Rich Content Editor**: Markdown support with live preview
- **Analytics Dashboard**: Track views, subscribers, and engagement
- **Multiple Verification Methods**: University email, ORCID, or manual review

### For Readers
- **Quality Content**: Curated from verified scientists only
- **Advanced Search**: Filter by field, tags, author, or keywords
- **Subscription System**: Follow your favorite researchers
- **Ad-Free Experience**: Premium plans remove advertisements

### Platform Features
- **Role-Based Access**: Guest, Pending Scientist, Verified Scientist
- **Stripe Integration**: Secure payment processing for subscriptions
- **Real-time Comments**: Engage with researchers and other readers
- **Mobile Responsive**: Optimized for all devices
- **SEO Optimized**: Built for discoverability

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with custom design system
- **Backend**: Supabase (Auth, Database, Real-time)
- **Payments**: Stripe (Subscriptions, Checkout, Portal)
- **Content**: Markdown with React Markdown
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <repository-url>
cd whats-up-science
npm install
```

### 2. Environment Setup

Copy the example environment file:
```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Configure Row Level Security (RLS) policies (included in schema)

### 4. Stripe Setup

1. Create a Stripe account
2. Set up your products and pricing:
   - **Supporter Plan**: $5/month
   - **Science Box Plan**: $20/month
3. Configure webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📊 Database Schema

### Core Tables
- **users**: Extended Supabase auth with verification status
- **newsletters**: Published content with metadata
- **comments**: User interactions on newsletters
- **subscriptions**: Reader-following relationships
- **payments**: Stripe payment records

### Key Features
- Row Level Security (RLS) for data protection
- Automatic timestamps and UUIDs
- Full-text search capabilities
- Optimized indexes for performance

## 🔐 Authentication & Authorization

### User Roles
1. **Guest**: Can read public newsletters
2. **Pending Scientist**: Registered but not verified
3. **Verified Scientist**: Can publish newsletters and comment

### Verification Methods
- **University Email**: Automatic verification for .edu domains
- **ORCID**: Integration with researcher profiles
- **Manual Review**: Admin approval process

## 💳 Subscription Plans

### Free Plan
- Read all public newsletters
- Leave comments
- Basic search and filtering
- Ad-supported

### Supporter Plan ($5/month)
- Ad-free experience
- Early access to new features
- Support independent science communication

### Science Box Plan ($20/month)
- All Supporter benefits
- Exclusive content from top scientists
- Monthly curated science digest
- Direct Q&A with featured scientists
- Priority support

## 🎨 Design System

### Colors
- **Primary**: Deep Blue (#0D1B2A)
- **Accent**: Mint Green (#A8E6CF)
- **Neutral**: Gray scale with custom tints

### Typography
- **Headers**: Rubik (Google Fonts)
- **Body**: Inter (Google Fonts)

### Components
- Custom Button variants
- Card layouts
- Form inputs
- Tag system
- Responsive grid

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Responsive navigation
- Touch-friendly interactions
- Optimized reading experience
- Progressive Web App ready

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── billing/           # Subscription management
│   ├── browse/            # Newsletter discovery
│   ├── create/            # Newsletter creation
│   ├── dashboard/         # Scientist dashboard
│   └── newsletter/        # Newsletter detail pages
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── supabase/              # Database schema
└── public/                # Static assets
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 🔒 Security Features

- Row Level Security (RLS) policies
- Input validation and sanitization
- CSRF protection
- Secure authentication with Supabase
- Stripe webhook signature verification
- Environment variable protection

## 📈 Analytics & Monitoring

- View count tracking
- User engagement metrics
- Subscription analytics
- Error monitoring ready
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ User authentication and verification
- ✅ Newsletter creation and publishing
- ✅ Subscription system
- ✅ Payment integration

### Phase 2 (Planned)
- 🔄 Advanced analytics dashboard
- 🔄 Email newsletter functionality
- 🔄 Social sharing features
- 🔄 API for third-party integrations
- 🔄 Mobile app development

### Phase 3 (Future)
- 🔄 AI-powered content recommendations
- 🔄 Collaborative research features
- 🔄 Conference and event integration
- 🔄 Grant and funding opportunities
- 🔄 International localization

---

**Built with ❤️ for the scientific community** 