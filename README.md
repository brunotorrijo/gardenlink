# GardenLink - Connect Homeowners with Local Gardeners

A **lead generation platform** that connects homeowners with local gardeners for garden maintenance and landscaping services. Gardeners pay for exposure on the platform, and clients can contact them directly without any login required.

## 🏢 **Business Model**
- **Gardeners pay for exposure** - Subscription/listing fees to appear on the platform
- **Clients contact gardeners directly** - No login required, direct communication
- **Lead generation focus** - Platform provides the connection, gardeners handle their own business
- **Simple and direct** - No complex booking or payment systems

## 🚀 Current Project Status

### ✅ **Completed Features**
- **User Authentication System**
  - Gardener signup/login with JWT tokens
  - Secure password hashing with bcrypt
  - Protected routes and middleware
  - **Note:** No client authentication needed - that's the beauty of the platform

- **Gardener Profile Management**
  - Complete profile creation and editing
  - Profile photo upload with multer (local storage)
  - Service categories (Lawn Mowing, Planting, Garden Design, Maintenance)
  - Location, pricing, and bio information
  - Profile photo display with default avatar
  - **Profile publishing restriction** - Only active subscribers appear in search

- **Public Search & Discovery**
  - Public search page (no login required)
  - Filter by location, service, and price range
  - Gardener profile cards with ratings and reviews
  - **Contact information displayed** - clients can email gardeners directly
  - Responsive design with Tailwind CSS
  - **Only shows subscribed gardeners** - Quality control through subscription model

- **Review System**
  - Public review submission (email verification)
  - Professional email templates with Ethereal
  - Review verification and publishing
  - Average rating calculations
  - Anonymous reviews supported (userId can be null)
  - Beautiful verification success page

- **Payment & Subscription System** 🆕
  - Complete Stripe integration for subscription management
  - Three subscription tiers: Basic ($29), Premium ($59), Featured ($99)
  - Subscription status tracking and management
  - Payment history and billing information
  - Webhook handling for payment events
  - Profile publishing tied to active subscriptions

- **Database & Backend**
  - PostgreSQL database with Prisma ORM
  - Railway deployment ready
  - RESTful API with Express.js
  - TypeScript for type safety
  - Comprehensive error handling
  - Static file serving for uploads
  - Subscription and payment models

- **Frontend**
  - React 19 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation
  - Responsive design
  - Real-time API integration
  - Payment dashboard with subscription management

### 🎯 **Business Logic Implemented**
- **Lead Generation Model**: Clients browse free, gardeners pay for exposure
- **Profile Publishing Control**: Only active subscribers appear in search results
- **Direct Contact**: Clients contact gardeners directly via email/phone
- **Subscription Tiers**: Different levels of exposure and features
- **Quality Assurance**: Subscription requirement ensures committed gardeners

## 🔧 **Current Technical Stack**

### Backend
- **Runtime:** Node.js with Express.js 5.1.0
- **Language:** TypeScript 5.8.3
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma 6.10.1
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer 2.0.1
- **Email:** Nodemailer 7.0.4 (Ethereal for dev)
- **Validation:** Zod 3.25.67
- **CORS:** cors 2.8.5
- **Payments:** Stripe 16.12.0

### Frontend
- **Framework:** React 19.1.0 with TypeScript
- **Styling:** Tailwind CSS 3.4.3
- **Build Tool:** Vite 7.0.0
- **Routing:** React Router DOM 7.6.2
- **Animations:** Framer Motion 12.19.1
- **Icons:** Lucide React 0.523.0
- **HTTP Client:** Fetch API (no axios dependency)

### Database Schema
- **Users:** Authentication and role management
- **GardenerProfiles:** Gardener information and services
- **ServiceCategories:** Available services
- **Reviews:** User reviews and ratings (supports anonymous)
- **PendingReviews:** Email verification system
- **Subscriptions:** Subscription management and status
- **Payments:** Payment tracking and history

## 🚨 **Critical Issues for Production**

### 🔴 **High Priority (Must Fix Before Deployment)**

1. **Stripe Configuration** 🆕
   - Set up Stripe account and get production API keys
   - Create subscription products and price IDs in Stripe dashboard
   - Configure webhook endpoints for payment events
   - Test payment flows thoroughly

2. **Email Configuration**
   - Replace Ethereal with real SMTP service
   - Configure production email credentials
   - Test email delivery thoroughly

3. **Environment Variables**
   - Set strong JWT_SECRET for production
   - Configure production DATABASE_URL
   - Add Stripe environment variables
   - Add all required environment variables

4. **Security**
   - Enable HTTPS in production
   - Add rate limiting for API endpoints
   - Implement CORS properly for production domain
   - Add input sanitization and validation

5. **File Storage**
   - Replace local file storage with cloud storage (AWS S3, Cloudinary)
   - Implement proper image optimization
   - Add file size and type validation

6. **Lawn Care Worker**
    - change name everywhere, front end

### 🟡 **Medium Priority**

6. **Error Handling**
   - Add comprehensive error logging
   - Implement proper error pages
   - Add user-friendly error messages

7. **Performance**
   - Add database indexing
   - Implement caching strategies
   - Optimize image loading

8. **Monitoring**
   - Add health check endpoints
   - Implement logging (Winston/Morgan)
   - Add performance monitoring

## 📋 **Pre-Deployment Checklist**

### Environment Setup
- [ ] Configure production environment variables
- [ ] Set up production database
- [ ] Configure production email service
- [ ] Set up cloud storage for images
- [ ] Configure domain and SSL certificates
- [ ] **Set up Stripe production account and keys** 🆕

### Security
- [ ] Review and update JWT_SECRET
- [ ] Implement rate limiting
- [ ] Add CORS configuration for production
- [ ] Enable HTTPS
- [ ] Add input validation and sanitization

### Performance
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Implement image optimization
- [ ] Add caching headers
- [ ] Minify and bundle frontend assets

### Testing
- [ ] Test all authentication flows
- [ ] Test review system end-to-end
- [ ] Test file upload functionality
- [ ] Test search and filtering
- [ ] Test responsive design on mobile
- [ ] **Test payment and subscription flows** 🆕

## 🚀 **Deployment Steps**

### Backend Deployment
1. **Railway Deployment**
   ```bash
   # Connect GitHub repository to Railway
   # Configure environment variables in Railway dashboard
   # Deploy automatically on push to main branch
   ```

2. **Environment Variables to Set**
   ```bash
   DATABASE_URL="your-railway-postgresql-url"
   JWT_SECRET="your-super-secure-jwt-secret"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   NODE_ENV="production"
   
   # Stripe Configuration
   STRIPE_SECRET_KEY="sk_live_your_production_key"
   STRIPE_PUBLISHABLE_KEY="pk_live_your_production_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   STRIPE_BASIC_PRICE_ID="price_your_basic_plan_id"
   STRIPE_PREMIUM_PRICE_ID="price_your_premium_plan_id"
   STRIPE_FEATURED_PRICE_ID="price_your_featured_plan_id"
   ```

### Frontend Deployment
1. **Vercel/Netlify Deployment**
   ```bash
   # Connect GitHub repository
   # Configure build settings
   # Set environment variables for API URL
   ```

2. **Update API URL**
   - Change `API_URL` in `src/api.ts` to production backend URL

## 🔮 **Future Features & Roadmap**

### Phase 1 (Next 2-4 weeks)
- [ ] **Analytics Dashboard** for gardeners
- [ ] **Advanced Search Filters** (availability, experience level)
- [ ] **Gardener Verification System** (background checks, insurance)
- [ ] **Mobile App** (React Native)

### Phase 2 (Next 2-3 months)
- [ ] **Multi-language Support**
- [ ] **Advanced Review System** (photo reviews, response system)
- [ ] **Gardener Portfolio** (before/after photos, project galleries)
- [ ] **Automated Lead Scoring**

### Phase 3 (Next 6 months)
- [ ] **AI-powered Matching** (smart gardener recommendations)
- [ ] **Scheduling Integration** (calendar sync)
- [ ] **Insurance & Bonding** partnerships
- [ ] **Franchise Model** for expansion

## 💡 **Key Differentiators**

1. **Lead Generation Focus**: Unlike booking platforms, we focus on connecting clients with gardeners
2. **No Client Accounts**: Clients can browse and contact gardeners without creating accounts
3. **Direct Communication**: Clients and gardeners communicate directly, no platform interference
4. **Subscription Model**: Gardeners pay for exposure, ensuring quality and commitment
5. **Simple & Effective**: Streamlined process from search to contact

## 📊 **Success Metrics**

- **Gardener Retention**: Monthly subscription renewal rates
- **Lead Quality**: Conversion rates from platform leads to actual jobs
- **Client Satisfaction**: Review ratings and repeat usage
- **Platform Growth**: Number of active gardeners and monthly searches

---

**GardenLink** - Where quality gardeners meet homeowners who need them. 