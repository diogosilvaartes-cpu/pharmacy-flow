import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types/order';

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('painel_pedidos')
        .select('*,itens_pedido(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    },
    refetchInterval: 15000,
  });
}

export function useOrderItems(pedidoId: string) {
  return useQuery({
    queryKey: ['order-items', pedidoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itens_pedido')
        .select('*')
        .eq('pedido_id', pedidoId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!pedidoId,
  });
}

export function useEntregadores() {
  return useQuery({
    queryKey: ['entregadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregadores')
        .select('*')
        .eq('ativo', true);

      if (error) throw error;
      return data || [];
    },
  });
}
