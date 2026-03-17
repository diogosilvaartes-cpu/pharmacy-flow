import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Entregador } from '@/types/order';

export default function EntregadoresPage() {
  const { data: entregadores = [], isLoading } = useQuery<Entregador[]>({
    queryKey: ['all-entregadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entregadores')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-base font-semibold text-foreground mb-6">Entregadores</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : entregadores.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum entregador cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {entregadores.map((e) => (
            <div key={e.id} className="order-card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{e.nome}</p>
                {e.telefone && <p className="text-xs text-muted-foreground">{e.telefone}</p>}
              </div>
              <span className={`status-badge ${e.ativo ? 'status-done' : 'status-cancel'}`}>
                {e.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
