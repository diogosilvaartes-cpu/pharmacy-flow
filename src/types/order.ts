export type OrderStatus =
  | 'novo'
  | 'confirmado'
  | 'em_separacao'
  | 'aguardando_pagamento'
  | 'pago'
  | 'saiu_para_entrega'
  | 'pronto_para_retirada'
  | 'entregue'
  | 'retirado'
  | 'cancelado';

export type FulfillmentType = 'entrega' | 'retirada';

export interface Order {
  id: string;
  status: OrderStatus;
  tipo_fulfillment: FulfillmentType;
  endereco: string | null;
  pagamento: string | null;
  valor_total: number | null;
  pix_link: string | null;
  pessoa_recebimento: string | null;
  resumo: string | null;
  created_at: string;
  updated_at: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_observacoes: string | null;
  entregador_id: string | null;
  entregador_nome: string | null;
  rota_link: string | null;
  status_entrega: string | null;
}

export interface OrderItem {
  id: string;
  pedido_id: string;
  item: string;
  quantidade: number;
  observacao: string | null;
}

export interface Entregador {
  id: string;
  nome: string;
  telefone: string | null;
  ativo: boolean;
}

export type KanbanColumn = {
  id: string;
  title: string;
  emoji: string;
  statuses: OrderStatus[];
  statusClass: string;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'novos', title: 'Novos', emoji: '🟡', statuses: ['novo', 'confirmado'], statusClass: 'status-new' },
  { id: 'separacao', title: 'Em Separação', emoji: '🔵', statuses: ['em_separacao', 'aguardando_pagamento', 'pago'], statusClass: 'status-process' },
  { id: 'saindo', title: 'Saindo', emoji: '🟠', statuses: ['saiu_para_entrega', 'pronto_para_retirada'], statusClass: 'status-transit' },
  { id: 'concluidos', title: 'Concluídos', emoji: '🟢', statuses: ['entregue', 'retirado'], statusClass: 'status-done' },
  { id: 'cancelados', title: 'Cancelados', emoji: '🔴', statuses: ['cancelado'], statusClass: 'status-cancel' },
];

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    novo: 'Novo',
    confirmado: 'Confirmado',
    em_separacao: 'Em Separação',
    aguardando_pagamento: 'Aguardando Pagamento',
    pago: 'Pago',
    saiu_para_entrega: 'Saiu p/ Entrega',
    pronto_para_retirada: 'Pronto p/ Retirada',
    entregue: 'Entregue',
    retirado: 'Retirado',
    cancelado: 'Cancelado',
  };
  return labels[status];
}

export function getStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    novo: 'status-new',
    confirmado: 'status-new',
    em_separacao: 'status-process',
    aguardando_pagamento: 'status-pay',
    pago: 'status-process',
    saiu_para_entrega: 'status-transit',
    pronto_para_retirada: 'status-transit',
    entregue: 'status-done',
    retirado: 'status-done',
    cancelado: 'status-cancel',
  };
  return map[status];
}
