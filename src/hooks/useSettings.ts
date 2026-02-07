import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseSettingsResult<T> {
  settings: T;
  isLoading: boolean;
  error: Error | null;
}

// Hook for fetching site settings
export function useSettings<T>(key: string, fallback: T): UseSettingsResult<T> {
  const { data, isLoading, error } = useQuery({
    queryKey: ['settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      
      if (error) throw error;
      return data?.value;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return {
    settings: (data as T) || fallback,
    isLoading,
    error: error as Error | null,
  };
}

// Hook for fetching all settings (for admin panel)
export function useAllSettings() {
  return useQuery({
    queryKey: ['settings', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook for updating settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: value as never, updated_at: new Date().toISOString() })
        .eq('key', key);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'all'] });
    },
  });
}
