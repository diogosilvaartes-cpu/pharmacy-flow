import { useState } from 'react';
import { useEntregadores } from '@/hooks/useOrders';
import { despacharPedido } from '@/services/webhooks';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface DispatchModalProps {
  open: boolean;
  onClose: () => void;
  pedidoId: string;
  onDispatched: () => void;
}

export function DispatchModal({ open, onClose, pedidoId, onDispatched }: DispatchModalProps) {
  const { data: entregadores = [] } = useEntregadores();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDispatch = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await despacharPedido(pedidoId, selectedId);
      toast.success('Pedido despachado!');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onDispatched();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="bg-card border-secondary">
        <DialogHeader>
          <DialogTitle className="text-foreground">Selecionar Entregador</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {entregadores.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum entregador ativo
            </p>
          )}
          {entregadores.map((e) => (
            <motion.button
              key={e.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedId(e.id)}
              className={`w-full p-3 rounded-md text-left text-sm transition-colors border ${
                selectedId === e.id
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-secondary bg-secondary/50 text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <p className="font-medium">{e.nome}</p>
              {e.telefone && <p className="text-xs text-muted-foreground">{e.telefone}</p>}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!selectedId || loading}
          onClick={handleDispatch}
          className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Despachando...' : '🚀 Despachar Motoboy'}
        </motion.button>
      </DialogContent>
    </Dialog>
  );
}
