import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavigationItem } from "@/types/content";

// Default navigation items as fallback
const DEFAULT_HEADER_NAV: NavigationItem[] = [
  { id: '1', location: 'header', label: 'Услуги', href: '#services', sort_order: 1, is_visible: true, open_in_new_tab: false },
  { id: '2', location: 'header', label: 'Цели оценки', href: '#purposes', sort_order: 2, is_visible: true, open_in_new_tab: false },
  { id: '3', location: 'header', label: 'Как работаем', href: '#process', sort_order: 3, is_visible: true, open_in_new_tab: false },
  { id: '4', location: 'header', label: 'Примеры', href: '#cases', sort_order: 4, is_visible: true, open_in_new_tab: false },
  { id: '5', location: 'header', label: 'Вопросы', href: '#faq', sort_order: 5, is_visible: true, open_in_new_tab: false },
  { id: '6', location: 'header', label: 'Контакты', href: '#contacts', sort_order: 6, is_visible: true, open_in_new_tab: false },
];

// Hook for fetching navigation items
export function useNavigation(location: 'header' | 'footer' | 'mobile') {
  const { data, isLoading, error } = useQuery({
    queryKey: ['navigation', location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('location', location)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as NavigationItem[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return {
    items: data || (location === 'header' ? DEFAULT_HEADER_NAV : []),
    isLoading,
    error: error as Error | null,
  };
}

// Hook for fetching all navigation items (for admin panel)
export function useAllNavigation() {
  return useQuery({
    queryKey: ['navigation', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('location')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as NavigationItem[];
    },
  });
}

// Hook for managing navigation items
export function useNavigationMutations() {
  const queryClient = useQueryClient();

  const createItem = useMutation({
    mutationFn: async (item: Omit<NavigationItem, 'id'>) => {
      const { data, error } = await supabase
        .from('navigation_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NavigationItem> & { id: string }) => {
      const { error } = await supabase
        .from('navigation_items')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation'] });
    },
  });

  return { createItem, updateItem, deleteItem };
}
