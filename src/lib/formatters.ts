export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOlderThanMinutes(dateStr: string, minutes: number): boolean {
  return Date.now() - new Date(dateStr).getTime() > minutes * 60 * 1000;
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
