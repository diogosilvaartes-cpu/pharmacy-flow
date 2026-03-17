import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import type { Order } from '@/types/order';
import { confirmarPedido, atualizarStatus, gerarPix } from '@/services/webhooks';
import { toast } from 'sonner';
import { DispatchModal } from '@/components/orders/DispatchModal';

interface OrderActionsProps {
  order: Order;
  onAction: () => void;
}

export function OrderActions({ order, onAction }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showDispatch, setShowDispatch] = useState(false);
  const queryClient = useQueryClient();

  const handleAction = async (action: () => Promise<void>, label: string) => {
    setLoading(true);
    try {
      await action();
      toast.success(`${label} realizado com sucesso`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onAction();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isPix = order.pagamento?.toLowerCase().includes('pix');

  const ActionButton = ({ label, onClick, variant = 'default' }: { label: string; onClick: () => void; variant?: string }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      onClick={onClick}
      className={`w-full h-9 rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      }`}
    >
      {loading ? '...' : label}
    </motion.button>
  );

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {order.status === 'novo' && (
          <ActionButton
            label="✅ Confirmar Pedido"
            variant="primary"
            onClick={() => handleAction(() => confirmarPedido(order.id), 'Confirmação')}
          />
        )}

        {order.status === 'confirmado' && (
          <>
            <ActionButton
              label="🔧 Separar"
              onClick={() => handleAction(() => atualizarStatus(order.id, 'em_separacao'), 'Separação')}
            />
            {isPix && (
              <ActionButton
                label="💰 Gerar PIX"
                onClick={() => handleAction(() => gerarPix(order.id, order.valor_total || 0), 'PIX')}
              />
            )}
          </>
        )}

        {order.status === 'pago' && (
          <ActionButton
            label="🔧 Separar"
            onClick={() => handleAction(() => atualizarStatus(order.id, 'em_separacao'), 'Separação')}
          />
        )}

        {order.status === 'em_separacao' && (
          order.tipo_fulfillment === 'retirada' ? (
            <ActionButton
              label="✅ Pronto p/ Retirada"
              variant="primary"
              onClick={() => handleAction(() => atualizarStatus(order.id, 'pronto_para_retirada'), 'Pronto p/ Retirada')}
            />
          ) : (
            <ActionButton
              label="🚀 Despachar"
              variant="primary"
              onClick={() => setShowDispatch(true)}
            />
          )
        )}

        {order.status === 'saiu_para_entrega' && (
          <ActionButton
            label="✅ Marcar Entregue"
            variant="primary"
            onClick={() => handleAction(() => atualizarStatus(order.id, 'entregue'), 'Entrega')}
          />
        )}

        {order.status === 'pronto_para_retirada' && (
          <ActionButton
            label="✅ Marcar Retirado"
            variant="primary"
            onClick={() => handleAction(() => atualizarStatus(order.id, 'retirado'), 'Retirada')}
          />
        )}
      </div>

      <DispatchModal
        open={showDispatch}
        onClose={() => setShowDispatch(false)}
        pedidoId={order.id}
        onDispatched={onAction}
      />
    </>
  );
}
