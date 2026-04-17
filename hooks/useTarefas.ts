import { router } from "expo-router";
import { useEffect, useState } from "react";

import { Tarefa } from "../types/Tarefa";
import { carregarTarefas, salvarTarefas } from "../utils/storage";
import {
  adicionarTarefa,
  toggleConcluida,
  toggleFlagged,
} from "../utils/tarefas";

/**
 * Hook que gerencia o estado da lista de tarefas.
 * Responsável por: carregar, salvar, adicionar, alternar estados e navegar aos detalhes.
 */
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  // ── Carregar ao iniciar ────────────────────────────────────────────────
  useEffect(() => {
    carregarTarefas().then((dados) => {
      setTarefas(dados);
      setCarregando(false);
    });
  }, []);

  // ── Salvar ao alterar ──────────────────────────────────────────────────
  useEffect(() => {
    if (carregando) return;
    salvarTarefas(tarefas);
  }, [tarefas, carregando]);

  // ── Lista ordenada (concluídas vão para o final) ───────────────────────
  const tarefasOrdenadas = [...tarefas].sort(
    (a, b) => Number(a.concluida) - Number(b.concluida)
  );

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleToggleConcluida(id: string) {
    setTarefas((prev) => toggleConcluida(prev, id));
  }

  function handleToggleFlagged(id: string) {
    setTarefas((prev) => toggleFlagged(prev, id));
  }

  function handleAdicionarTarefa(
    titulo: string,
    descricao: string,
    lembrete: Date | null
  ): boolean {
    const novaLista = adicionarTarefa(
      tarefas,
      titulo,
      descricao,
      lembrete?.toISOString() ?? null
    );
    if (!novaLista) return false;
    setTarefas(novaLista);
    return true;
  }

  function handleAbrirDetalhes(tarefa: Tarefa) {
    router.push({
      pathname: "/detalhes",
      params: {
        id: tarefa.id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao ?? "",
        flagged: String(tarefa.flagged),
        concluida: String(tarefa.concluida),
        lembrete: tarefa.lembrete ?? "",
      },
    });
  }

  return {
    tarefas: tarefasOrdenadas,
    carregando,
    handleToggleConcluida,
    handleToggleFlagged,
    handleAdicionarTarefa,
    handleAbrirDetalhes,
  };
}
