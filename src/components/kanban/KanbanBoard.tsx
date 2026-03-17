import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrders } from '@/hooks/useOrders';
import { KANBAN_COLUMNS, type Order } from '@/types/order';
import { KanbanColumn } from './KanbanColumn';
import { OrderDetailSheet } from '@/components/orders/OrderDetailSheet';

export function KanbanBoard() {
  const { data: orders = [], isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const queryClient = useQueryClient();

  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  const getColumnOrders = (statuses: string[]) => {
    return orders.filter((o) => {
      if (!statuses.includes(o.status)) return false;
      // For completed/cancelled, only show last 24h
      if (['entregue', 'retirado', 'cancelado'].includes(o.status)) {
        return now - new Date(o.updated_at || o.created_at).getTime() < twentyFourHours;
      }
      return true;
    });
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['orders'] });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex overflow-x-auto h-[calc(100vh-64px)]">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            orders={getColumnOrders(col.statuses)}
            onCardClick={setSelectedOrder}
            onAction={refresh}
          />
        ))}
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAction={refresh}
      />
    </>
  );
}
