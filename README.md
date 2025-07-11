# YardConnect – Connect Homeowners with Local Lawn Care Workers

A *lead generation platform* that connects homeowners with local lawn care workers for yard maintenance and landscaping services. Yard workers pay a monthly subscription to appear on the platform, and clients can contact them directly—no client login required.

## 🏢 *Business Model*
- *Lawn Care workers pay for exposure* – Subscription fee to appear in search results
- *Clients contact yard workers directly* – No login required, direct communication
- *Lead generation focus* – Platform provides the connection, yard workers handle their own business
- *Simple and direct* – No complex booking or payment systems

## 🚀 Current Project Status

### ✅ *Completed Features*
- *User Authentication System*
  - Yard worker signup/login with JWT tokens
  - Secure password hashing with bcrypt
  - Protected routes and middleware
  - *No client authentication needed*

- *Yard Worker Profile Management*
  - Complete profile creation and editing
  - Profile photo upload with multer (local storage)
  - Service categories (Lawn Mowing, Planting, Garden Design, Maintenance)
  - Location, pricing, and bio information
  - Profile photo display with default avatar
  - *Profile publishing restriction* – Only active subscribers appear in search

- *Public Search & Discovery*
  - Public search page (no login required)
  - Filter by location, service, and price range
  - Yard worker profile cards with ratings and reviews
  - *Contact information displayed* – clients can email yard workers directly
  - Responsive design with Tailwind CSS
  - *Only shows subscribed yard workers* – Quality control through subscription model

- *Review System*
  - Public review submission (email verification)
  - Professional email templates with Ethereal (dev)
  - Review verification and publishing
  - Average rating calculations
  - Anonymous reviews supported (userId can be null)
  - Beautiful verification success page

- *Payment & Subscription System* 🆕
  - Stripe integration for subscription management
  - *Single subscription plan* (e.g., $10/month)
  - Subscription status tracking and management
  - Payment history and billing information
  - (Webhook support ready, but not required for MVP)
  - Profile publishing tied to active subscriptions

- *Database & Backend*
  - PostgreSQL database with Prisma ORM
  - Railway deployment ready
  - RESTful API with Express.js
  - TypeScript for type safety
  - Comprehensive error handling
  - Static file serving for uploads
  - Subscription and payment models

- *Frontend*
  - React 19 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation
  - Responsive design
  - Real-time API integration
  - Payment dashboard with subscription management

### 🎯 *Business Logic Implemented*
- *Lead Generation Model*: Clients browse free, yard workers pay for exposure
- *Profile Publishing Control*: Only active subscribers appear in search results
- *Direct Contact*: Clients contact yard workers directly via email/phone
- *Quality Assurance*: Subscription requirement ensures committed yard workers

## 🔧 *Current Technical Stack*

### Backend
- *Runtime:* Node.js with Express.js 5.1.0
- *Language:* TypeScript 5.8.3
- *Database:* PostgreSQL (Railway)
- *ORM:* Prisma 6.10.1
- *Authentication:* JWT + bcrypt
- *File Upload:* Multer 2.0.1
- *Email:* Nodemailer 7.0.4 (SendGrid for production, Ethereal for dev)
- *Validation:* Zod 3.25.67
- *CORS:* cors 2.8.5
- *Payments:* Stripe 16.12.0

### Frontend
- *Framework:* React 19.1.0 with TypeScript
- *Styling:* Tailwind CSS 3.4.3
- *Build Tool:* Vite 7.0.0
- *Routing:* React Router DOM 7.6.2
- *Animations:* Framer Motion 12.19.1
- *Icons:* Lucide React 0.523.0
- *HTTP Client:* Fetch API

### Database Schema
- *Users:* Authentication and role management
- *YardWorkerProfiles:* Yard worker information and services
- *ServiceCategories:* Available services
- *Reviews:* User reviews and ratings (supports anonymous)
- *PendingReviews:* Email verification system
- *Subscriptions:* Subscription management and status
- *Payments:* Payment tracking and history

## 🚨 *Critical Issues for Production*

### 🔴 *High Priority (Must Fix Before Deployment)*
1. *Stripe Configuration*
   - Configure webhook endpoint for payment events
   - Test payment flows thoroughly

2. *Email Configuration* **(Complete)**
   - Email verification for reviews is now fully set up and working in production using SendGrid
   - Sender address must be verified in SendGrid
   - Note: Emails may initially go to spam; users should be advised to check spam/junk folders

3. *Environment Variables*
   - Set strong JWT_SECRET for production
   - Configure production DATABASE_URL
   - Add Stripe environment variables
   - Add all required environment variables

4. *Security*
   - Enable HTTPS in production
   - Add rate limiting for API endpoints
   - Implement CORS properly for production domain
   - Add input sanitization and validation

5. *File Storage*
   - Replace local file storage with cloud storage (AWS S3, Cloudinary)
   - Implement proper image optimization
   - Add file size and type validation

### 🟡 *Medium Priority*
6. *Error Handling*
   - Add comprehensive error logging
   - Implement proper error pages
   - Add user-friendly error messages

7. *Performance*
   - Add database indexing
   - Implement caching strategies
   - Optimize image loading

8. *Monitoring*
   - Add health check endpoints
   - Implement logging (Winston/Morgan)
   - Add performance monitoring

## 📋 *Pre-Deployment Checklist*

### Environment Setup
- [ ] Configure production environment variables
- [ ] Set up production database
- [x] Configure production email service (SendGrid, verified sender)
- [ ] Set up cloud storage for images
- [ ] Configure domain and SSL certificates
- [ ] Set up Stripe production account and keys

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
- [ ] Test payment and subscription flows

## 🚀 *Deployment Steps*

### Backend Deployment
1. *Railway Deployment*
   bash
   # Connect GitHub repository to Railway
   # Configure environment variables in Railway dashboard
   # Deploy automatically on push to main branch
   

2. *Environment Variables to Set*
   bash
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
   STRIPE_PRICE_ID="price_your_live_price_id"
   

### Frontend Deployment
1. *Vercel/Netlify Deployment*
   bash
   # Connect GitHub repository
   # Configure build settings
   # Set environment variables for API URL
   

2. *Update API URL*
   - Change API_URL in src/api.ts to production backend URL

## 🔮 *Future Features & Roadmap*

### Phase 1 (Next 2-4 weeks)
- [ ] Analytics Dashboard for yard workers
- [ ] Advanced Search Filters (availability, experience level)
- [ ] Yard Worker Verification System (background checks, insurance)
- [ ] Mobile App (React Native)

### Phase 2 (Next 2-3 months)
- [ ] Multi-language Support
- [ ] Advanced Review System (photo reviews, response system)
- [ ] Yard Worker Portfolio (before/after photos, project galleries)
- [ ] Automated Lead Scoring

### Phase 3 (Next 6 months)
- [ ] AI-powered Matching (smart recommendations)
- [ ] Scheduling Integration (calendar sync)
- [ ] Insurance & Bonding partnerships

---

*Current State:*  
YardConnect is fully functional with authentication, profile management, search, reviews, and Stripe-powered subscription payments.  
The platform is ready for production hardening and launch, with webhooks and advanced features as the next steps.

## 🚀 Next Steps for Production

1. **Buy a custom domain and configure DNS**
   - Purchase a domain (e.g., from Namecheap, GoDaddy, Google Domains)
   - Set up DNS for both web hosting and email authentication
   - This is required for domain authentication and professional email sending
2. **Set up domain authentication (SPF/DKIM) in SendGrid** *(Pending domain purchase)*
   - Improves deliverability and reduces chance of emails going to spam
   - Requires access to your domain's DNS settings
   - Recommended for all production email sending
3. **Migrate file uploads from local storage to cloud storage (e.g., AWS S3, Cloudinary)**
   - Ensures scalability and reliability for user-uploaded images
4. **Set up Stripe webhooks for robust subscription/payment management**
   - Enables real-time updates for payment events and subscription status
5. **Enable HTTPS and security hardening**
   - Use SSL certificates, set secure cookies, and review CORS settings
6. **Monitor logs and error reporting**
   - Set up logging and error monitoring (e.g., Sentry, LogRocket)
7. **Test all flows end-to-end**
   - Review, payment, profile, and search flows on both desktop and mobile

---