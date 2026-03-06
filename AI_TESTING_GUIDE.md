# AI Integration Testing Guide

## Overview
CivicMind AI integrates three AI services for comprehensive complaint analysis:
1. **AWS Comprehend** - Sentiment Analysis
2. **OpenAI GPT** - Fraud Detection & Solution Recommendations
3. **Google Gemini** - Root Cause Analysis & Cost Estimation

## API Keys Configuration

All API keys have been configured as Supabase Edge Function secrets. The system will:
- Use AI services when keys are available
- Fall back to intelligent rule-based analysis if services are unavailable
- Continue functioning even if some services fail

## Testing the AI Integration

### 1. Test Complaint Submission with AI Analysis

**Steps:**
1. Go to `/submit`
2. Fill in the form:
   - **Title**: "Large pothole on Main Street causing accidents"
   - **Description**: "There is a dangerous pothole on Main Street near the market. It's very deep and has already caused two accidents. This is an urgent issue that needs immediate attention."
   - **Category**: Road Damage
   - **Location**: "Main Street, near Central Market"
   - Upload a photo (optional)
3. Submit the complaint
4. Note the tracking ID
5. You should see "AI is analyzing your complaint in the background..."

**Expected AI Results:**
- **Sentiment**: NEGATIVE (due to words like "dangerous", "accidents", "urgent")
- **Priority**: HIGH (urgent keywords detected)
- **Fraud Probability**: Low (0.1-0.3)
- **Recommended Department**: Public Works Department
- **Predicted Resolution**: 3 days (high priority)
- **Estimated Cost**: ₹10,000 - ₹100,000

### 2. Test Fraud Detection

**Steps:**
1. Submit a complaint with suspicious content:
   - **Title**: "Urgent cash reward needed immediately"
   - **Description**: "I need immediate payment for this issue. Send money urgently. Prize money required."
   - **Category**: Any
   - **Location**: "Anywhere"
2. Submit and track

**Expected AI Results:**
- **Fraud Probability**: HIGH (≥70%)
- **Status**: Automatically set to "Under Review"
- **Appears in**: Admin Audit Queue
- **Banner**: Shows warning about verification needed

### 3. Test Different Categories

Try submitting complaints for each category to see AI recommendations:

**Water Supply Issue:**
- Title: "No water supply for 3 days"
- Expected Department: Water Supply Department
- Expected Cost: ₹5,000 - ₹50,000

**Electricity Issue:**
- Title: "Street lights not working for a week"
- Expected Department: Electricity Board
- Expected Cost: ₹8,000 - ₹80,000

**Sanitation Issue:**
- Title: "Garbage not collected for 2 weeks"
- Expected Department: Sanitation Department
- Expected Cost: ₹3,000 - ₹30,000

**Public Safety Issue:**
- Title: "No street lighting causing safety concerns"
- Expected Department: Police Department
- Expected Cost: ₹5,000 - ₹50,000

### 4. Test Admin AI Features

**View AI Analysis:**
1. Login as admin at `/login`
2. Go to `/admin/complaints`
3. Click on any complaint
4. View AI analysis section showing:
   - Main Issue
   - Root Cause
   - Suggested Solution
   - Sentiment
   - Fraud Probability
   - Cost Estimates

**Manual Re-analysis:**
1. On complaint detail page
2. Click "Re-analyze with AI" button
3. Wait for analysis to complete
4. Page will refresh with updated AI insights

**Audit Queue:**
1. Go to `/admin/audit`
2. See complaints with fraud probability ≥70%
3. Review and approve/reject/return for review

**Analytics Dashboard:**
1. Go to `/admin/analytics`
2. View charts showing:
   - Complaints by Category (Bar Chart)
   - Priority Breakdown (Pie Chart)
   - Category Details with percentages

## AI Analysis Flow

```
Complaint Submitted
    ↓
Edge Function Triggered
    ↓
┌─────────────────────────────────────┐
│  Parallel AI Service Calls          │
├─────────────────────────────────────┤
│  1. AWS Comprehend                  │
│     → Sentiment Analysis            │
│                                     │
│  2. OpenAI GPT                      │
│     → Fraud Detection               │
│     → Main Issue Extraction         │
│     → Solution Recommendation       │
│                                     │
│  3. Google Gemini                   │
│     → Root Cause Analysis           │
│     → Department Recommendation     │
│     → Cost Estimation               │
└─────────────────────────────────────┘
    ↓
Combine Results
    ↓
Calculate Priority
    ↓
Update Database
    ↓
Display in UI
```

## Fallback Mechanism

If AI services are unavailable, the system uses:

**Sentiment Analysis Fallback:**
- Keyword matching for negative/positive words
- Returns: POSITIVE, NEGATIVE, or NEUTRAL

**Fraud Detection Fallback:**
- Checks for fraud indicators: "money", "payment", "cash", "urgent", "prize"
- Calculates probability based on matches

**Root Cause Fallback:**
- Category-based analysis
- Keyword matching for specific issues
- Default recommendations per category

## Monitoring AI Performance

**Check AI Status:**
1. Admin Dashboard shows total complaints analyzed
2. Each complaint shows "AI Analysis Complete" or "AI Analysis Pending"
3. Fraud probability visible in complaint details

**Verify AI Results:**
1. Check if priority matches urgency in description
2. Verify department assignment is logical
3. Confirm cost estimates are reasonable
4. Review suggested solutions for relevance

## Troubleshooting

**AI Analysis Not Running:**
- Check Edge Function logs in Supabase dashboard
- Verify API keys are correctly configured
- Check network connectivity
- System will use fallback if services fail

**Incorrect Analysis:**
- Use "Re-analyze with AI" button
- Check if description provides enough context
- Verify category selection is correct

**Fraud Detection Too Sensitive:**
- Review fraud indicators in Edge Function
- Adjust threshold if needed (currently 70%)
- Check audit queue regularly

## Best Practices

1. **Provide Detailed Descriptions**: More context = better AI analysis
2. **Select Correct Category**: Helps AI recommend right department
3. **Include Location Details**: Improves cost estimation
4. **Upload Photos**: Visual evidence helps verification
5. **Review AI Suggestions**: AI assists but admin makes final decisions

## API Rate Limits

Be aware of rate limits for each service:
- **AWS Comprehend**: Check your AWS quota
- **OpenAI**: Depends on your plan
- **Google Gemini**: Check API limits

The system handles rate limit errors gracefully and falls back to rule-based analysis.

## Security Notes

- All API keys are stored as Supabase secrets (not in code)
- Edge Functions run server-side (keys never exposed to client)
- CORS protection prevents unauthorized access
- Rate limiting prevents abuse

## Next Steps

1. Submit test complaints with various scenarios
2. Review AI analysis results in admin portal
3. Test audit queue workflow
4. Verify analytics dashboard displays correctly
5. Monitor system performance over time
