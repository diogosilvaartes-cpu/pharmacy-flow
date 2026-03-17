import type { Order, KanbanColumn as KanbanColumnType } from '@/types/order';
import { OrderCard } from './OrderCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  orders: Order[];
  onCardClick: (order: Order) => void;
  onAction: () => void;
}

export function KanbanColumn({ column, orders, onCardClick, onAction }: KanbanColumnProps) {
  return (
    <div className="kanban-column h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-4 sticky top-0">
        <span>{column.emoji}</span>
        <h2 className="text-sm font-medium text-foreground">{column.title}</h2>
        <span className="column-counter">{orders.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {orders.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Nenhum pedido
          </p>
        )}
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onCardClick(order)}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}
