import { Tarefa } from "../types/Tarefa";

/**
 * Cria uma nova tarefa com ID único baseado no timestamp.
 */
export function criarTarefa(
  titulo: string,
  descricao?: string,
  lembrete?: string | null
): Tarefa {
  return {
    id: Date.now().toString(),
    titulo: titulo.trim(),
    descricao: descricao?.trim() || undefined,
    concluida: false,
    flagged: false,
    lembrete: lembrete ?? null,
  };
}

/**
 * Adiciona uma nova tarefa à lista.
 * Retorna null se o título estiver vazio (após trim).
 */
export function adicionarTarefa(
  tarefas: Tarefa[],
  titulo: string,
  descricao?: string,
  lembrete?: string | null
): Tarefa[] | null {
  if (!titulo.trim()) return null;
  return [...tarefas, criarTarefa(titulo, descricao, lembrete)];
}

/**
 * Alterna o estado de conclusão de uma tarefa pelo ID.
 */
export function toggleConcluida(tarefas: Tarefa[], id: string): Tarefa[] {
  return tarefas.map((t) =>
    t.id === id ? { ...t, concluida: !t.concluida } : t
  );
}

/**
 * Alterna o estado de flag (importante) de uma tarefa pelo ID.
 */
export function toggleFlagged(tarefas: Tarefa[], id: string): Tarefa[] {
  return tarefas.map((t) =>
    t.id === id ? { ...t, flagged: !t.flagged } : t
  );
}

/**
 * Remove uma tarefa da lista pelo ID.
 */
export function removerTarefa(tarefas: Tarefa[], id: string): Tarefa[] {
  return tarefas.filter((t) => t.id !== id);
}
