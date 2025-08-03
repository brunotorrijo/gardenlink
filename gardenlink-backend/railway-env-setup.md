# Railway Environment Variables Setup

Add these environment variables in your Railway project dashboard:

## Required Environment Variables

### Database (Railway will provide this)
- `DATABASE_URL` - Railway PostgreSQL connection string

### JWT Security
- `JWT_SECRET` - Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Email Configuration (SendGrid)
- `SMTP_HOST` - `smtp.sendgrid.net`
- `SMTP_PORT` - `587`
- `SMTP_USER` - `apikey` (literal string)
- `SMTP_PASS` - Your SendGrid API key
- `SMTP_FROM` - `noreply@yard-connect.com`

### Stripe Configuration
- `STRIPE_SECRET_KEY` - Your Stripe live secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe live publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `STRIPE_PRICE_ID` - Your Stripe price ID for subscriptions

### Server Configuration
- `NODE_ENV` - `production`
- `PORT` - Railway will set this automatically

## Steps:
1. Deploy to Railway
2. Go to your project dashboard
3. Click "Variables" tab
4. Add each variable above
5. Redeploy the app 