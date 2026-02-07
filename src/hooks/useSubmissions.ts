import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormSubmission } from "@/types/content";

// Hook for fetching form submissions (admin only)
export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FormSubmission[];
    },
  });
}

// Hook for creating a new submission (public)
export function useCreateSubmission() {
  return useMutation({
    mutationFn: async (submission: {
      name: string;
      phone: string;
      evaluation_type?: string;
      evaluation_type_label?: string;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from('form_submissions')
        .insert(submission)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook for updating submission status (admin only)
export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FormSubmission['status'] }) => {
      const { error } = await supabase
        .from('form_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

// Hook for deleting a submission (admin only)
export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

// Hook for getting submission stats (admin only)
export function useSubmissionStats() {
  return useQuery({
    queryKey: ['submissions', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('status');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        new: data.filter(s => s.status === 'new').length,
        in_progress: data.filter(s => s.status === 'in_progress').length,
        completed: data.filter(s => s.status === 'completed').length,
        cancelled: data.filter(s => s.status === 'cancelled').length,
      };
      
      return stats;
    },
  });
}
