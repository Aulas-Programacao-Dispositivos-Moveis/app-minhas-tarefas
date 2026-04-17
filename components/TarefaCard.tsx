import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PRIMARY } from "../constants";
import { Tarefa } from "../types/Tarefa";

type TarefaCardProps = {
  tarefa: Tarefa;
  onToggleConcluida: (id: string) => void;
  onToggleFlagged: (id: string) => void;
  onAbrirDetalhes: (tarefa: Tarefa) => void;
};

/**
 * Card de uma tarefa na lista principal.
 * Exibe checkbox, título, flag e botão de detalhes.
 */
export function TarefaCard({
  tarefa,
  onToggleConcluida,
  onToggleFlagged,
  onAbrirDetalhes,
}: TarefaCardProps) {
  return (
    <Pressable style={styles.card}>
      <Pressable
        onPress={() => onToggleConcluida(tarefa.id)}
        style={[styles.checkbox, tarefa.concluida && styles.checkboxChecked]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tarefa.concluida }}
      >
        {tarefa.concluida && <Ionicons name="checkmark" size={16} color="#fff" />}
      </Pressable>

      <Text
        style={[styles.taskTitle, tarefa.concluida && styles.taskTitleDone]}
        numberOfLines={1}
      >
        {tarefa.titulo}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onToggleFlagged(tarefa.id)}
          accessibilityLabel="Marcar como importante"
          style={styles.actionBtn}
        >
          <Ionicons
            name={tarefa.flagged ? "flag" : "flag-outline"}
            size={22}
            color={tarefa.flagged ? PRIMARY : "#555"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAbrirDetalhes(tarefa)}
          accessibilityLabel="Ver detalhes"
          style={styles.actionBtn}
        >
          <Ionicons name="information-circle-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    gap: 12,
  },

  /* ── Checkbox ── */
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },

  /* ── Título ── */
  taskTitle: { flex: 1, fontSize: 16, color: "#1a1a1a", fontWeight: "500" },
  taskTitleDone: { textDecorationLine: "none" },

  /* ── Ações ── */
  actions: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionBtn: { padding: 4 },
});
