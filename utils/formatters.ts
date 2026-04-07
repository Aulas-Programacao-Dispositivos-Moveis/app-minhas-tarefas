/**
 * Formata a data de forma amigável.
 * Exemplos: "seg., 12 de abr." | "ter., 1 de jan. de 2027"
 */
export function formatarData(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    ...(date.getFullYear() !== new Date().getFullYear() && { year: "numeric" }),
  });
}

/**
 * Formata apenas a hora. Exemplo: "14:30"
 */
export function formatarHora(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata um objeto Date para exibição amigável do lembrete.
 * Exemplos: "Hoje, 14:30" | "Amanhã, 09:00" | "12 mai., 18:45"
 */
export function formatarLembrete(date: Date): string {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const hora = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === hoje.toDateString()) {
    return `Hoje, ${hora}`;
  }

  if (date.toDateString() === amanha.toDateString()) {
    return `Amanhã, ${hora}`;
  }

  const dataFormatada = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    ...(date.getFullYear() !== hoje.getFullYear() && { year: "numeric" }),
  });

  return `${dataFormatada}, ${hora}`;
}
