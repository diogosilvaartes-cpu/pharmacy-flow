import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Order } from '@/types/order';
import { getStatusLabel, getStatusClass } from '@/types/order';
import { useOrderItems } from '@/hooks/useOrders';
import { formatDateTime, formatPhone } from '@/lib/formatters';
import { OrderActions } from '@/components/kanban/OrderActions';

interface OrderDetailSheetProps {
  order: Order | null;
  onClose: () => void;
  onAction: () => void;
}

export function OrderDetailSheet({ order, onClose, onAction }: OrderDetailSheetProps) {
  // Use embedded items from join if available, otherwise fetch separately
  const { data: fetchedItems = [] } = useOrderItems(order?.id || '');
  const items = order?.itens_pedido ?? fetchedItems;

  if (!order) return null;

  return (
    <Sheet open={!!order} onOpenChange={() => onClose()}>
      <SheetContent className="bg-card border-secondary w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            Pedido
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Actions */}
          <OrderActions order={order} onAction={onAction} />

          {/* Cliente */}
          <Section title="Cliente">
            <InfoRow label="Nome" value={order.customer_name} />
            {order.customer_phone && (
              <InfoRow
                label="Telefone"
                value={
                  <a
                    href={`https://wa.me/${formatPhone(order.customer_phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    📱 {order.customer_phone}
                  </a>
                }
              />
            )}
            {order.customer_notes && (
              <InfoRow label="Observações" value={order.customer_notes} />
            )}
          </Section>

          {/* Itens */}
          <Section title="Itens do Pedido">
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem itens</p>
            ) : (
              <div className="space-y-2">
                {items.map((item: { id: string; item: string; quantidade: number; observacao: string | null }) => (
                  <div key={item.id} className="bg-secondary/50 p-2 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{item.item}</span>
                      <span className="font-mono text-muted-foreground">x{item.quantidade}</span>
                    </div>
                    {item.observacao && (
                      <p className="text-xs text-muted-foreground mt-1">{item.observacao}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Entrega */}
          <Section title="Entrega">
            <InfoRow label="Tipo" value={order.fulfillment_type === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'} />
            {order.address && <InfoRow label="Endereço" value={order.address} />}
            {order.recipient_name && <InfoRow label="Recebimento" value={order.recipient_name} />}
          </Section>

          {/* Pagamento */}
          <Section title="Pagamento">
            {order.payment_method && <InfoRow label="Forma" value={order.payment_method} />}
            {order.total_value != null && (
              <InfoRow label="Valor" value={`R$ ${order.total_value.toFixed(2)}`} mono />
            )}
            {order.pix_link && (
              <InfoRow
                label="PIX"
                value={
                  <a href={order.pix_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs break-all">
                    {order.pix_link}
                  </a>
                }
              />
            )}
          </Section>

          {/* Motoboy */}
          {order.entregador_nome && (
            <Section title="Motoboy">
              <InfoRow label="Nome" value={order.entregador_nome} />
              {order.status_entrega && <InfoRow label="Status" value={order.status_entrega} />}
              {order.rota_link && (
                <InfoRow
                  label="Rota"
                  value={
                    <a href={order.rota_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                      📍 Abrir no Maps
                    </a>
                  }
                />
              )}
            </Section>
          )}

          {/* Timeline */}
          <Section title="Histórico">
            <InfoRow label="Criado" value={formatDateTime(order.created_at)} mono />
            {order.updated_at && <InfoRow label="Atualizado" value={formatDateTime(order.updated_at)} mono />}
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm text-foreground text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
