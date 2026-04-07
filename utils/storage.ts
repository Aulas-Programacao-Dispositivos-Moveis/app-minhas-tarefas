import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants";
import { Tarefa } from "../types/Tarefa";

/**
 * Carrega a lista de tarefas salva no AsyncStorage.
 * Retorna um array vazio se não houver dados ou em caso de erro.
 */
export async function carregarTarefas(): Promise<Tarefa[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as Tarefa[]) : [];
  } catch (e) {
    console.error("Erro ao carregar tarefas:", e);
    return [];
  }
}

/**
 * Persiste a lista de tarefas no AsyncStorage.
 */
export async function salvarTarefas(tarefas: Tarefa[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
  } catch (e) {
    console.error("Erro ao salvar tarefas:", e);
  }
}
