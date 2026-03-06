export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export type ComplaintStatus = 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface Complaint {
  id: string;
  tracking_id: string;
  title: string;
  description: string;
  category_id: number | null;
  location: string;
  photo_url: string | null;
  status: ComplaintStatus;
  priority: ComplaintPriority | null;
  fraud_probability: number | null;
  predicted_resolution_days: number | null;
  assigned_department: number | null;
  root_cause: string | null;
  suggested_solution: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  sentiment: string | null;
  main_issue: string | null;
  ai_analyzed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplaintWithDetails extends Complaint {
  category?: Category;
  department?: Department;
}

export interface AIAnalysisResult {
  priority: ComplaintPriority;
  fraudProbability: number;
  mainIssue: string;
  recommendedDepartment: string;
  suggestedSolution: string;
  rootCause: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  sentiment: string;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  category_id: number;
  location: string;
  photo_url?: string;
}

export interface DashboardStats {
  total: number;
  urgent: number;
  suspicious: number;
  resolved: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

export interface PriorityBreakdown {
  priority: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}
