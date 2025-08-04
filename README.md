# Run and deploy your AI Studio app

This is a comprehensive CRM Analytics system for sales management with multi-product packages, lead distribution, and real-time performance analytics.

## Features

- **Multi-role Authentication**: Super Admin, Admin, and Handle Customer roles
- **Lead Management**: Kanban board and table views with stage tracking
- **Real-time Analytics**: Dashboard with performance metrics and charts
- **Customer Follow-up**: Automated customer service management
- **Product & Package Management**: Dynamic product catalog with pricing
- **WhatsApp Integration**: Direct communication with leads and customers
- **Target Tracking**: Daily and monthly performance targets
- **Public Lead Forms**: Customizable forms for lead generation

## Run Locally

**Prerequisites:** Node.js and Supabase account

### Setup Instructions

1. **Clone and Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Setup Database:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL migration from `supabase/migrations/create_crm_schema.sql`
   - This will create all necessary tables, policies, and sample data

4. **Run the Application:**
   ```bash
   npm run dev
   ```

## Login Credentials

Use these usernames to test different roles:
- **Super Admin**: `angger`
- **Admin**: `berliana` or `livia`
- **Handle Customer**: `selly`

## Database Schema

The system uses the following main tables:
- `users` - User management with role-based access
- `products` - Product catalog
- `packages` - Product packages with pricing
- `leads` - Lead management with stages and tracking
- `notes` - Lead communication history
- `targets` - Performance targets for admins
- `handle_customer_data` - Customer follow-up management

## Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure API endpoints with proper authentication
- Data isolation between different user roles

## Performance Optimizations

- Database indexes on frequently queried columns
- Efficient data fetching with proper joins
- Optimized React components with useMemo and useCallback
- Lazy loading and code splitting where appropriate

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any static hosting service. Make sure to set the environment variables in your deployment platform.