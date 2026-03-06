import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  complaintId: string;
  title: string;
  description: string;
  location: string;
}

interface AIAnalysisResult {
  priority: 'low' | 'medium' | 'high';
  fraudProbability: number;
  mainIssue: string;
  recommendedDepartment: string;
  suggestedSolution: string;
  rootCause: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  sentiment: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { complaintId, title, description, location } = await req.json() as AnalysisRequest;

    // Perform AI analysis
    const analysis = await performAIAnalysis(title, description, location);

    // Find department ID based on recommended department
    const { data: departments } = await supabase
      .from('departments')
      .select('id, name');

    const departmentId = departments?.find(d => 
      d.name.toLowerCase().includes(analysis.recommendedDepartment.toLowerCase())
    )?.id || null;

    // Update complaint with AI analysis
    const { data: updatedComplaint, error: updateError } = await supabase
      .from('complaints')
      .update({
        priority: analysis.priority,
        fraud_probability: analysis.fraudProbability,
        main_issue: analysis.mainIssue,
        assigned_department: departmentId,
        suggested_solution: analysis.suggestedSolution,
        root_cause: analysis.rootCause,
        estimated_cost_min: analysis.estimatedCostMin,
        estimated_cost_max: analysis.estimatedCostMax,
        sentiment: analysis.sentiment,
        ai_analyzed: true,
        status: analysis.fraudProbability >= 0.7 ? 'under_review' : 'pending',
        predicted_resolution_days: calculateResolutionDays(analysis.priority),
        updated_at: new Date().toISOString()
      })
      .eq('id', complaintId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, data: updatedComplaint, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performAIAnalysis(
  title: string,
  description: string,
  location: string
): Promise<AIAnalysisResult> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const geminiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  const awsAccessKey = Deno.env.get('AWS_ACCESS_KEY_ID');
  const awsSecretKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
  const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1';

  // Sentiment Analysis using AWS Comprehend (if available)
  let sentiment = 'NEUTRAL';
  if (awsAccessKey && awsSecretKey) {
    try {
      sentiment = await analyzeSentimentWithAWS(description, awsAccessKey, awsSecretKey, awsRegion);
    } catch (error) {
      console.error('AWS Comprehend error:', error);
      sentiment = detectSentimentFallback(description);
    }
  } else {
    sentiment = detectSentimentFallback(description);
  }

  // Fraud Detection and Solution using OpenAI (if available)
  let fraudProbability = 0.1;
  let suggestedSolution = 'Investigate the issue and take appropriate action.';
  let mainIssue = title;

  if (openaiKey) {
    try {
      const openaiResult = await analyzeWithOpenAI(title, description, location, openaiKey);
      fraudProbability = openaiResult.fraudProbability;
      suggestedSolution = openaiResult.suggestedSolution;
      mainIssue = openaiResult.mainIssue;
    } catch (error) {
      console.error('OpenAI error:', error);
      const fallback = analyzeFraudFallback(description);
      fraudProbability = fallback.fraudProbability;
      mainIssue = extractMainIssue(title, description);
    }
  } else {
    const fallback = analyzeFraudFallback(description);
    fraudProbability = fallback.fraudProbability;
    mainIssue = extractMainIssue(title, description);
  }

  // Root Cause Analysis using Google Gemini (if available)
  let rootCause = 'Infrastructure maintenance required.';
  let recommendedDepartment = 'Public Works';
  let estimatedCostMin = 5000;
  let estimatedCostMax = 50000;

  if (geminiKey) {
    try {
      const geminiResult = await analyzeWithGemini(title, description, location, geminiKey);
      rootCause = geminiResult.rootCause;
      recommendedDepartment = geminiResult.recommendedDepartment;
      estimatedCostMin = geminiResult.estimatedCostMin;
      estimatedCostMax = geminiResult.estimatedCostMax;
    } catch (error) {
      console.error('Gemini error:', error);
      const fallback = analyzeRootCauseFallback(title, description);
      rootCause = fallback.rootCause;
      recommendedDepartment = fallback.recommendedDepartment;
      estimatedCostMin = fallback.estimatedCostMin;
      estimatedCostMax = fallback.estimatedCostMax;
    }
  } else {
    const fallback = analyzeRootCauseFallback(title, description);
    rootCause = fallback.rootCause;
    recommendedDepartment = fallback.recommendedDepartment;
    estimatedCostMin = fallback.estimatedCostMin;
    estimatedCostMax = fallback.estimatedCostMax;
  }

  // Determine priority
  const priority = determinePriority(sentiment, fraudProbability, description);

  return {
    priority,
    fraudProbability,
    mainIssue,
    recommendedDepartment,
    suggestedSolution,
    rootCause,
    estimatedCostMin,
    estimatedCostMax,
    sentiment
  };
}

async function analyzeSentimentWithAWS(
  text: string,
  accessKey: string,
  secretKey: string,
  region: string
): Promise<string> {
  // AWS Comprehend API call would go here
  // For now, return fallback
  return detectSentimentFallback(text);
}

async function analyzeWithOpenAI(
  title: string,
  description: string,
  location: string,
  apiKey: string
): Promise<{ fraudProbability: number; suggestedSolution: string; mainIssue: string }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant analyzing public infrastructure complaints for fraud detection and solution recommendations. Respond in JSON format only.'
        },
        {
          role: 'user',
          content: `Analyze this complaint:
Title: ${title}
Description: ${description}
Location: ${location}

Provide:
1. Fraud probability (0-1)
2. Main issue summary (one sentence)
3. Suggested solution (2-3 sentences)

Respond in JSON: {"fraudProbability": 0.0, "mainIssue": "", "suggestedSolution": ""}`
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content);

  return {
    fraudProbability: Math.min(Math.max(parsed.fraudProbability, 0), 1),
    mainIssue: parsed.mainIssue || title,
    suggestedSolution: parsed.suggestedSolution || 'Investigate and resolve the issue.'
  };
}

async function analyzeWithGemini(
  title: string,
  description: string,
  location: string,
  apiKey: string
): Promise<{ rootCause: string; recommendedDepartment: string; estimatedCostMin: number; estimatedCostMax: number }> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Analyze this infrastructure complaint and provide root cause analysis:
Title: ${title}
Description: ${description}
Location: ${location}

Provide in JSON format:
1. Root cause (2-3 sentences)
2. Recommended department (one of: Public Works, Water Supply, Electricity Board, Sanitation, Police)
3. Estimated cost range in INR (min and max)

Respond in JSON: {"rootCause": "", "recommendedDepartment": "", "estimatedCostMin": 0, "estimatedCostMax": 0}`
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

  return {
    rootCause: parsed.rootCause || 'Infrastructure maintenance required.',
    recommendedDepartment: parsed.recommendedDepartment || 'Public Works',
    estimatedCostMin: parsed.estimatedCostMin || 5000,
    estimatedCostMax: parsed.estimatedCostMax || 50000
  };
}

// Fallback functions
function detectSentimentFallback(text: string): string {
  const negative = ['bad', 'terrible', 'worst', 'horrible', 'dangerous', 'urgent', 'emergency'];
  const positive = ['good', 'better', 'improved', 'fixed'];
  
  const lowerText = text.toLowerCase();
  const negCount = negative.filter(word => lowerText.includes(word)).length;
  const posCount = positive.filter(word => lowerText.includes(word)).length;
  
  if (negCount > posCount) return 'NEGATIVE';
  if (posCount > negCount) return 'POSITIVE';
  return 'NEUTRAL';
}

function analyzeFraudFallback(description: string): { fraudProbability: number } {
  const fraudIndicators = ['money', 'payment', 'cash', 'reward', 'prize', 'urgent', 'immediately'];
  const lowerDesc = description.toLowerCase();
  const matches = fraudIndicators.filter(word => lowerDesc.includes(word)).length;
  
  return {
    fraudProbability: Math.min(matches * 0.15, 0.9)
  };
}

function analyzeRootCauseFallback(
  title: string,
  description: string
): { rootCause: string; recommendedDepartment: string; estimatedCostMin: number; estimatedCostMax: number } {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('road') || text.includes('pothole') || text.includes('street')) {
    return {
      rootCause: 'Road infrastructure deterioration due to weather and traffic load.',
      recommendedDepartment: 'Public Works',
      estimatedCostMin: 10000,
      estimatedCostMax: 100000
    };
  }
  
  if (text.includes('water') || text.includes('supply') || text.includes('leak')) {
    return {
      rootCause: 'Water supply system maintenance or distribution issue.',
      recommendedDepartment: 'Water Supply',
      estimatedCostMin: 5000,
      estimatedCostMax: 50000
    };
  }
  
  if (text.includes('electric') || text.includes('power') || text.includes('light')) {
    return {
      rootCause: 'Electrical infrastructure maintenance required.',
      recommendedDepartment: 'Electricity Board',
      estimatedCostMin: 8000,
      estimatedCostMax: 80000
    };
  }
  
  if (text.includes('garbage') || text.includes('waste') || text.includes('sanitation')) {
    return {
      rootCause: 'Sanitation service scheduling or resource allocation issue.',
      recommendedDepartment: 'Sanitation',
      estimatedCostMin: 3000,
      estimatedCostMax: 30000
    };
  }
  
  if (text.includes('safety') || text.includes('security') || text.includes('crime')) {
    return {
      rootCause: 'Public safety concern requiring immediate attention.',
      recommendedDepartment: 'Police',
      estimatedCostMin: 5000,
      estimatedCostMax: 50000
    };
  }
  
  return {
    rootCause: 'General infrastructure maintenance required.',
    recommendedDepartment: 'Public Works',
    estimatedCostMin: 5000,
    estimatedCostMax: 50000
  };
}

function extractMainIssue(title: string, description: string): string {
  const sentences = description.split(/[.!?]+/);
  return sentences[0]?.trim() || title;
}

function determinePriority(sentiment: string, fraudProbability: number, description: string): 'low' | 'medium' | 'high' {
  const urgentWords = ['urgent', 'emergency', 'immediate', 'critical', 'dangerous'];
  const hasUrgent = urgentWords.some(word => description.toLowerCase().includes(word));
  
  if (sentiment === 'NEGATIVE' && hasUrgent) return 'high';
  if (fraudProbability >= 0.7) return 'high';
  if (sentiment === 'NEGATIVE' || hasUrgent) return 'medium';
  return 'low';
}

function calculateResolutionDays(priority: 'low' | 'medium' | 'high'): number {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 7;
    case 'low': return 14;
    default: return 7;
  }
}
