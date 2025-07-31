# Technical Implementation Guide

## 🔧 **Enhanced Editor Implementation**

### **LaTeX Support with KaTeX**
```typescript
// Enhanced markdown rendering with LaTeX
<ReactMarkdown 
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[
    rehypeKatex,
    rehypeHighlight,
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
  ]}
>
  {content}
</ReactMarkdown>
```

### **Code Block Syntax Highlighting**
```typescript
// Custom code block component
const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={github}
      customStyle={{
        backgroundColor: '#f6f8fa',
        borderRadius: '6px',
        padding: '16px'
      }}
    >
      {value}
    </SyntaxHighlighter>
  )
}
```

### **Image Upload with Dropzone**
```typescript
// File upload component
const ImageUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => onUpload(file))
    }
  })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input {...getInputProps()} />
      <p>Drag & drop images here, or click to select files</p>
    </div>
  )
}
```

## 🔐 **Verification System Architecture**

### **Database Schema Extensions**
```sql
-- Enhanced verification table
CREATE TABLE verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  method verification_method NOT NULL,
  status verification_status DEFAULT 'pending',
  data JSONB, -- Store verification-specific data
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peer invitations table
CREATE TABLE peer_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  message TEXT,
  status invitation_status DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic domains whitelist
CREATE TABLE academic_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT UNIQUE NOT NULL,
  institution_name TEXT NOT NULL,
  country TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **ORCID OAuth Integration**
```typescript
// ORCID authentication handler
const handleORCIDLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'orcid',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'openid email profile'
    }
  })
  
  if (error) {
    console.error('ORCID login error:', error)
  }
}
```

### **Academic Email Verification**
```typescript
// Email domain verification
const verifyAcademicEmail = async (email: string) => {
  const domain = email.split('@')[1]
  
  // Check against whitelist
  const { data: domainData } = await supabase
    .from('academic_domains')
    .select('*')
    .eq('domain', domain)
    .eq('verified', true)
    .single()
  
  if (domainData) {
    // Send verification email
    await sendVerificationEmail(email)
    return { verified: true, method: 'academic_email' }
  }
  
  return { verified: false, method: 'manual_review' }
}
```

## 📊 **Analytics Implementation**

### **View Tracking**
```typescript
// Enhanced view tracking with analytics
const trackNewsletterView = async (newsletterId: string, userId?: string) => {
  // Increment view count
  await supabase.rpc('increment_view_count', { newsletter_id: newsletterId })
  
  // Track detailed analytics
  await supabase.from('analytics_events').insert({
    event_type: 'newsletter_view',
    newsletter_id: newsletterId,
    user_id: userId,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  })
}
```

### **Read Time Calculation**
```typescript
// Calculate reading time
const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Track actual read time
const trackReadTime = (newsletterId: string, startTime: number) => {
  const endTime = Date.now()
  const readTime = Math.round((endTime - startTime) / 1000) // seconds
  
  // Store read time data
  supabase.from('read_time_analytics').insert({
    newsletter_id: newsletterId,
    read_time_seconds: readTime,
    timestamp: new Date().toISOString()
  })
}
```

## 🚀 **Performance Optimizations**

### **Static Generation for Public Content**
```typescript
// Next.js static generation
export async function generateStaticParams() {
  const { data: newsletters } = await supabase
    .from('newsletters')
    .select('slug')
    .eq('is_public', true)
    .eq('is_verified', true)
  
  return newsletters?.map((newsletter) => ({
    slug: newsletter.slug,
  })) || []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: newsletter } = await supabase
    .from('newsletters')
    .select(`
      title,
      content,
      tags,
      author:users(full_name, institution)
    `)
    .eq('slug', params.slug)
    .single()
  
  return {
    title: newsletter?.title,
    description: truncateText(newsletter?.content, 160),
    keywords: newsletter?.tags?.join(', '),
    openGraph: {
      title: newsletter?.title,
      description: truncateText(newsletter?.content, 160),
      type: 'article',
      authors: [newsletter?.author?.full_name]
    }
  }
}
```

### **Image Optimization**
```typescript
// Next.js image optimization
import Image from 'next/image'

const OptimizedImage = ({ src, alt, ...props }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      {...props}
    />
  )
}
```

## 🔒 **Security Enhancements**

### **Row Level Security Policies**
```sql
-- Enhanced RLS policies
CREATE POLICY "Users can only edit their own content" ON newsletters
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can only see their own drafts" ON newsletters
  FOR SELECT USING (
    auth.uid() = author_id OR 
    (is_public = true AND is_verified = true)
  );

CREATE POLICY "Only verified scientists can publish" ON newsletters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_verified = true
    )
  );
```

### **Rate Limiting**
```typescript
// API rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Apply to specific routes
app.use('/api/newsletters', limiter)
```

## 📱 **Mobile Optimization**

### **Responsive Design Patterns**
```css
/* Mobile-first responsive design */
.newsletter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .newsletter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .newsletter-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### **Touch-Friendly Interactions**
```typescript
// Touch-optimized components
const TouchFriendlyButton = ({ children, ...props }) => {
  return (
    <button
      className="min-h-[44px] min-w-[44px] touch-manipulation"
      {...props}
    >
      {children}
    </button>
  )
}
```

## 🔄 **Real-time Features**

### **Live Comments**
```typescript
// Real-time comment updates
const useLiveComments = (newsletterId: string) => {
  const [comments, setComments] = useState([])
  
  useEffect(() => {
    const channel = supabase
      .channel(`comments:${newsletterId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `newsletter_id=eq.${newsletterId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [...prev, payload.new])
        }
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [newsletterId])
  
  return comments
}
```

This technical implementation guide provides the foundation for building a robust, scalable, and user-friendly science communication platform. 