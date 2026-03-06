import { supabase } from './supabase';
import type {
  Complaint,
  ComplaintWithDetails,
  ComplaintFormData,
  Category,
  Department,
  DashboardStats,
  CategoryDistribution,
  PriorityBreakdown,
  Profile
} from '@/types';

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Departments
export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Complaints
export async function createComplaint(formData: ComplaintFormData): Promise<Complaint> {
  const trackingId = await generateTrackingId();
  
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      tracking_id: trackingId,
      title: formData.title,
      description: formData.description,
      category_id: formData.category_id,
      location: formData.location,
      photo_url: formData.photo_url || null,
      status: 'pending'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getComplaintByTrackingId(trackingId: string): Promise<ComplaintWithDetails | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:categories(id, name, description),
      department:departments(id, name, description)
    `)
    .eq('tracking_id', trackingId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function getComplaintById(id: string): Promise<ComplaintWithDetails | null> {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      category:categories(id, name, description),
      department:departments(id, name, description)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function getComplaints(
  page = 1,
  limit = 20,
  filters?: {
    status?: string;
    priority?: string;
    category_id?: number;
  }
): Promise<{ data: ComplaintWithDetails[]; count: number }> {
  let query = supabase
    .from('complaints')
    .select(`
      *,
      category:categories(id, name, description),
      department:departments(id, name, description)
    `, { count: 'exact' });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  return { data: Array.isArray(data) ? data : [], count: count || 0 };
}

export async function getAuditQueue(page = 1, limit = 20): Promise<{ data: ComplaintWithDetails[]; count: number }> {
  const { data, error, count } = await supabase
    .from('complaints')
    .select(`
      *,
      category:categories(id, name, description),
      department:departments(id, name, description)
    `, { count: 'exact' })
    .gte('fraud_probability', 0.7)
    .eq('status', 'pending')
    .order('fraud_probability', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  return { data: Array.isArray(data) ? data : [], count: count || 0 };
}

export async function updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
  const { data, error } = await supabase
    .from('complaints')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteComplaint(id: string): Promise<void> {
  const { error } = await supabase
    .from('complaints')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalResult, urgentResult, suspiciousResult, resolvedResult] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('priority', 'high'),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).gte('fraud_probability', 0.7),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('status', 'resolved')
  ]);
  
  return {
    total: totalResult.count || 0,
    urgent: urgentResult.count || 0,
    suspicious: suspiciousResult.count || 0,
    resolved: resolvedResult.count || 0
  };
}

export async function getCategoryDistribution(): Promise<CategoryDistribution[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select('category_id, categories(name)')
    .not('category_id', 'is', null);
  
  if (error) throw error;
  
  const distribution: Record<string, number> = {};
  data?.forEach((item: any) => {
    const categoryName = item.categories?.name || 'Unknown';
    distribution[categoryName] = (distribution[categoryName] || 0) + 1;
  });
  
  return Object.entries(distribution).map(([category, count]) => ({
    category,
    count
  }));
}

export async function getPriorityBreakdown(): Promise<PriorityBreakdown[]> {
  const { data, error } = await supabase
    .from('complaints')
    .select('priority')
    .not('priority', 'is', null);
  
  if (error) throw error;
  
  const breakdown: Record<string, number> = {};
  data?.forEach((item) => {
    const priority = item.priority || 'Unknown';
    breakdown[priority] = (breakdown[priority] || 0) + 1;
  });
  
  return Object.entries(breakdown).map(([priority, count]) => ({
    priority,
    count
  }));
}

// Profiles
export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Helper functions
async function generateTrackingId(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_tracking_id');
  if (error) throw error;
  return data;
}
