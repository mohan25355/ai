# CivicMind AI - Quick Start Guide

## 🚀 Getting Started

### 1. First Time Setup

**Create Admin Account:**
1. Open the application
2. Click "Admin Login" in the top navigation
3. Go to "Sign Up" tab
4. Create account with username and password
5. **First user automatically becomes admin!**

### 2. Submit Your First Complaint (As Citizen)

1. Go to homepage
2. Click "Submit a Complaint"
3. Fill in the form:
   - Title: Brief description
   - Description: Detailed explanation (minimum 20 characters)
   - Category: Select from dropdown
   - Location: Address or landmark
   - Photo: Optional (max 1MB, auto-compressed)
4. Click "Submit Complaint"
5. **Save your Tracking ID!**
6. AI will analyze your complaint automatically

### 3. Track Your Complaint

1. Click "Track Complaint" in navigation
2. Enter your tracking ID
3. Click "Search"
4. View:
   - Current status
   - Priority level
   - Assigned department
   - AI analysis results
   - Predicted resolution time

### 4. Admin Dashboard

**Access Admin Portal:**
1. Login at `/login`
2. Dashboard shows:
   - Total complaints
   - Urgent complaints
   - Suspicious complaints
   - Resolved complaints

**Manage Complaints:**
1. Go to "Complaints" in sidebar
2. Use filters to find specific complaints
3. Click any complaint to view details
4. Update status and assign department
5. Click "Re-analyze with AI" to run analysis again

**Review Suspicious Complaints:**
1. Go to "Audit Queue" in sidebar
2. See complaints flagged by AI (fraud probability ≥70%)
3. Review each complaint
4. Actions:
   - ✅ Approve → Moves to "In Progress"
   - ❌ Reject → Marks as fraudulent
   - 🔄 Review → Returns to "Under Review"

**View Analytics:**
1. Go to "Analytics" in sidebar
2. See visualizations:
   - Complaints by category (bar chart)
   - Priority breakdown (pie chart)
   - Category details with percentages

## 🤖 AI Features

### Automatic Analysis
Every complaint is automatically analyzed for:
- **Sentiment**: Positive, Negative, or Neutral
- **Priority**: Low, Medium, or High
- **Fraud Probability**: 0-100%
- **Department**: Best suited to handle the issue
- **Solution**: AI-recommended action plan
- **Root Cause**: Underlying problem
- **Cost**: Estimated resolution cost (min-max)
- **Timeline**: Predicted resolution days

### Fraud Detection
Complaints with high fraud probability (≥70%):
- Automatically flagged
- Sent to Audit Queue
- Status set to "Under Review"
- Require manual admin approval

### Manual Re-analysis
Admins can trigger AI analysis anytime:
1. Open complaint detail page
2. Click "Re-analyze with AI"
3. Wait for analysis to complete
4. View updated insights

## 📊 Understanding AI Results

### Priority Levels
- 🔴 **High**: Urgent issues requiring immediate attention (3 days)
- 🟡 **Medium**: Important issues (7 days)
- 🟢 **Low**: Standard issues (14 days)

### Status Flow
```
Pending → Under Review → In Progress → Resolved
                ↓
            Rejected (if fraudulent)
```

### Fraud Indicators
AI checks for suspicious patterns:
- Requests for money/payment
- Urgent/immediate language
- Prize/reward mentions
- Inconsistent information

## 💡 Tips for Best Results

### For Citizens:
1. **Be Specific**: Provide detailed descriptions
2. **Choose Correct Category**: Helps AI route to right department
3. **Include Location**: Improves cost estimation
4. **Upload Photos**: Visual evidence helps verification
5. **Save Tracking ID**: You'll need it to check status

### For Admins:
1. **Review AI Suggestions**: AI assists, you decide
2. **Check Audit Queue Daily**: Handle suspicious complaints promptly
3. **Use Analytics**: Identify patterns and allocate resources
4. **Re-analyze if Needed**: Trigger AI again for unclear cases
5. **Update Status**: Keep citizens informed

## 🎨 Color Coding

- **Blue (Primary)**: Trust, technology, official actions
- **Green (Secondary)**: Success, resolved, approved
- **Orange (Accent)**: Attention, warnings, pending review
- **Red (Destructive)**: Urgent, high priority, rejected
- **Yellow (Warning)**: Suspicious, under review, caution

## 📱 Mobile Support

The platform is fully responsive:
- Submit complaints from mobile
- Track status on the go
- Admin dashboard accessible on tablets
- All features work across devices

## 🔒 Security & Privacy

- **Anonymous Submission**: No personal info required for citizens
- **Secure Admin Access**: Username/password authentication
- **Data Protection**: Row Level Security on all tables
- **Image Validation**: File type and size checks
- **API Security**: Keys stored as secrets, never exposed

## 🆘 Troubleshooting

**Complaint Not Analyzed:**
- Wait a few minutes (AI runs in background)
- Check back later or use tracking ID
- Admin can manually trigger re-analysis

**Can't Track Complaint:**
- Verify tracking ID is correct (format: CMA20260306XXXX)
- Check for typos
- Contact admin if issue persists

**Image Upload Failed:**
- Check file size (max 1MB)
- Use supported formats: JPEG, PNG, WEBP
- System will auto-compress if too large

**Login Issues:**
- Verify username and password
- First user becomes admin automatically
- Contact existing admin to change your role

## 📞 Support

For technical issues:
1. Check admin dashboard for system status
2. Review complaint tracking for updates
3. Contact system administrator

## 🎯 Quick Actions

| Action | Path | Who |
|--------|------|-----|
| Submit Complaint | `/submit` | Anyone |
| Track Complaint | `/track` | Anyone |
| Admin Login | `/login` | Admin |
| Dashboard | `/admin` | Admin |
| View Complaints | `/admin/complaints` | Admin |
| Analytics | `/admin/analytics` | Admin |
| Audit Queue | `/admin/audit` | Admin |

## ✅ System Status

All systems operational:
- ✅ Complaint submission
- ✅ AI analysis (AWS, OpenAI, Gemini)
- ✅ Image upload
- ✅ Tracking system
- ✅ Admin dashboard
- ✅ Analytics
- ✅ Audit queue

---

**Ready to start?** Go to the homepage and submit your first complaint or login as admin to manage the system!
