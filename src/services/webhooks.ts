const DEFAULT_N8N_URL = 'https://n8n.faturemais.shop';

function getBaseUrl(): string {
  return localStorage.getItem('n8n_base_url') || DEFAULT_N8N_URL;
}

async function callWebhook(path: string, body: Record<string, unknown>): Promise<void> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook falhou (${res.status}): ${text}`);
  }
}

export async function confirmarPedido(pedidoId: string) {
  return callWebhook('/webhook/confirmar-pedido', { pedido_id: pedidoId });
}

export async function atualizarStatus(pedidoId: string, novoStatus: string) {
  return callWebhook('/webhook/atualizar-status', {
    pedido_id: pedidoId,
    novo_status: novoStatus,
    fonte: 'painel',
  });
}

export async function despacharPedido(pedidoId: string, entregadorId: string) {
  return callWebhook('/webhook/despachar-pedido', {
    pedido_id: pedidoId,
    entregador_id: entregadorId,
  });
}

export async function gerarPix(pedidoId: string, valor: number) {
  return callWebhook('/webhook/wf3-gerar-pagamento', {
    pedido_id: pedidoId,
    valor,
  });
}
