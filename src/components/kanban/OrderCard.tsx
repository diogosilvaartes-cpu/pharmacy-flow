import { motion } from 'framer-motion';
import type { Order } from '@/types/order';
import { getStatusLabel, getStatusClass } from '@/types/order';
import { formatTime, isOlderThanMinutes, formatPhone } from '@/lib/formatters';
import { OrderActions } from './OrderActions';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onAction: () => void;
}

export function OrderCard({ order, onClick, onAction }: OrderCardProps) {
  const isUrgent = order.status === 'novo' && isOlderThanMinutes(order.created_at, 5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: isUrgent
          ? [
              '0 0 0px 0px rgba(255,191,0,0)',
              '0 0 8px 2px rgba(255,191,0,0.2)',
              '0 0 0px 0px rgba(255,191,0,0)',
            ]
          : undefined,
      }}
      transition={isUrgent ? { repeat: Infinity, duration: 2 } : { duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
      className="order-card"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{order.customer_name}</p>
          {order.customer_phone && (
            <a
              href={`https://wa.me/${formatPhone(order.customer_phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              📱 {order.customer_phone}
            </a>
          )}
        </div>
        <span className="font-mono text-xs text-muted-foreground ml-2 shrink-0">
          {formatTime(order.created_at)}
        </span>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`status-badge ${getStatusClass(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {order.fulfillment_type === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1 mb-3">
        {order.payment_method && (
          <p className="text-xs text-muted-foreground">💳 {order.payment_method}</p>
        )}
        {order.total_value != null && (
          <p className="text-xs font-mono text-foreground">
            R$ {order.total_value.toFixed(2)}
          </p>
        )}
        {order.resumo && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {order.resumo.length > 80 ? order.resumo.slice(0, 80) + '…' : order.resumo}
          </p>
        )}
      </div>

      {/* Actions */}
      <div onClick={(e) => e.stopPropagation()}>
        <OrderActions order={order} onAction={onAction} />
      </div>
    </motion.div>
  );
}
