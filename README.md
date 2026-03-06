# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-a2kfq7q072f5

# CivicMind AI - AI-Powered Governance Intelligence Platform

An intelligent platform for India that enables citizens to anonymously report public infrastructure issues while allowing government administrators to analyze, prioritize, and resolve complaints using artificial intelligence.

## Features

### Citizen Portal
- **Anonymous Complaint Submission**: Report issues without revealing identity
- **Photo Upload**: Attach evidence with automatic compression
- **Real-time Tracking**: Track complaint status using unique tracking ID
- **AI-Powered Analysis**: Automatic sentiment analysis, priority detection, and fraud detection

### Admin Portal
- **Dashboard**: Overview of complaints with key statistics
- **Complaints Management**: View, filter, and update complaints
- **AI Analysis Dashboard**: Visualize complaint patterns with charts
- **Audit Verification Queue**: Review suspicious complaints flagged by AI
- **Manual Re-analysis**: Trigger AI analysis on-demand for any complaint

### AI Integration
- **AWS Comprehend**: Sentiment analysis
- **OpenAI GPT**: Fraud detection and solution recommendations
- **Google Gemini**: Root cause analysis and cost estimation

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and pnpm installed
- Supabase account
- API keys for AI services (optional but recommended)

### 2. Environment Variables
The following secrets are already configured in Supabase Edge Functions:
- `AWS_ACCESS_KEY_ID` - AWS Comprehend access key
- `AWS_SECRET_ACCESS_KEY` - AWS Comprehend secret key
- `AWS_REGION` - AWS region (e.g., us-east-1, ap-south-1)
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_GEMINI_API_KEY` - Google Gemini API key

### 3. Database Setup
The database is already initialized with:
- Complaints table with AI analysis fields
- Categories (Road Damage, Water Supply, Electricity, Sanitation, Public Safety)
- Departments (Public Works, Water Supply, Electricity Board, Sanitation, Police)
- Storage bucket for complaint images
- Row Level Security policies

### 4. First Admin User
1. Go to `/login`
2. Click "Sign Up" tab
3. Create an account with username and password
4. The first user is automatically assigned admin role
5. Subsequent users will have regular user role (admins can change roles)

### 5. Using the Platform

#### As a Citizen:
1. Visit the homepage
2. Click "Submit a Complaint"
3. Fill in details (title, description, category, location)
4. Optionally upload a photo (max 1MB, auto-compressed)
5. Submit and receive a tracking ID
6. Use "Track Your Complaint" to check status

#### As an Admin:
1. Login at `/login`
2. Access admin dashboard at `/admin`
3. View all complaints at `/admin/complaints`
4. Click on any complaint to see AI analysis
5. Update status and assign departments
6. Review suspicious complaints at `/admin/audit`
7. View analytics at `/admin/analytics`

## AI Analysis Features

### Automatic Analysis
When a complaint is submitted, the AI automatically:
- Analyzes sentiment (POSITIVE, NEGATIVE, NEUTRAL)
- Detects fraud probability (0-100%)
- Assigns priority (low, medium, high)
- Recommends department
- Suggests solution
- Identifies root cause
- Estimates resolution time and cost

### Fraud Detection
Complaints with fraud probability ≥70% are:
- Automatically flagged
- Sent to audit verification queue
- Marked as "Under Review"
- Require manual admin approval

### Fallback Mechanism
If AI services are unavailable, the system uses intelligent fallback algorithms based on:
- Keyword analysis
- Pattern matching
- Historical data
- Rule-based classification

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth (username/password)
- **Storage**: Supabase Storage
- **AI Services**: AWS Comprehend, OpenAI, Google Gemini
- **Charts**: Recharts

## Color Scheme

The design uses Indian governance-inspired colors:
- **Primary (Blue)**: Trust, technology, professionalism
- **Secondary (Green)**: Growth, sustainability, progress
- **Accent (Saffron)**: Energy, courage, sacrifice

## Security Features

- Anonymous complaint submission (no personal data required)
- Admin authentication with role-based access
- Row Level Security on all database tables
- Secure image upload with validation
- API keys stored as Supabase secrets
- CORS protection on Edge Functions

## Support

For issues or questions:
1. Check the admin dashboard for system status
2. Review complaint tracking for status updates
3. Contact system administrator for access issues

## License

© 2026 CivicMind AI. All rights reserved.
