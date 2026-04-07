export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  flagged: boolean;
  lembrete?: string | null; // ISO 8601 date string
};
