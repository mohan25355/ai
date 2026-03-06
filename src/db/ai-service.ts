import { supabase } from './supabase';

export async function triggerAIAnalysis(complaintId: string, title: string, description: string, location: string) {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-complaint', {
      body: {
        complaintId,
        title,
        description,
        location
      }
    });

    if (error) {
      const errorMsg = await error?.context?.text?.();
      console.error('AI analysis error:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'AI analysis failed');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to trigger AI analysis:', error);
    return { success: false, error };
  }
}
