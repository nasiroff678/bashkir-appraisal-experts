import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseContentResult<T> {
  content: T;
  isVisible: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Hook for fetching section content
export function useContent<T>(sectionId: string, fallback: T): UseContentResult<T> {
  const { data, isLoading, error } = useQuery({
    queryKey: ['content', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content, is_visible')
        .eq('id', sectionId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    content: (data?.content as T) || fallback,
    isVisible: data?.is_visible ?? true,
    isLoading,
    error: error as Error | null,
  };
}

// Hook for fetching all sections (for admin panel)
export function useSections() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook for updating section content
export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      sectionId, 
      content, 
      isVisible 
    }: { 
      sectionId: string; 
      content: Record<string, unknown>; 
      isVisible?: boolean;
    }) => {
      const updateData: Record<string, unknown> = { content };
      if (isVisible !== undefined) {
        updateData.is_visible = isVisible;
      }

      const { error } = await supabase
        .from('site_content')
        .update(updateData)
        .eq('id', sectionId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.sectionId] });
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

// Hook for toggling section visibility
export function useToggleSectionVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sectionId, isVisible }: { sectionId: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('site_content')
        .update({ is_visible: isVisible })
        .eq('id', sectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}
