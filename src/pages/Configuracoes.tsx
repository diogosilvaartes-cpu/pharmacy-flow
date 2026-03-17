import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ConfiguracoesPage() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(localStorage.getItem('n8n_base_url') || '');
  }, []);

  const save = () => {
    localStorage.setItem('n8n_base_url', baseUrl.replace(/\/$/, ''));
    toast.success('URL salva com sucesso');
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-base font-semibold text-foreground mb-6">Configurações</h1>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            URL base do n8n
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://n8n.seudominio.com"
            className="w-full h-10 px-3 rounded-md bg-secondary border border-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Os webhooks serão chamados como: {baseUrl || 'https://...'}/webhook/confirmar-pedido
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={save}
          className="h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Salvar
        </motion.button>
      </div>
    </div>
  );
}
