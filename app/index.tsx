import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Tarefa = {
  id: string;
  titulo: string;
  concluida: boolean;
  flagged: boolean;
};

const tarefasIniciais: Tarefa[] = [
  { id: "1", titulo: "Lavar a louça", concluida: true, flagged: false },
  { id: "2", titulo: "Estudar JS", concluida: true, flagged: false },
  { id: "3", titulo: "Ir no mercado", concluida: true, flagged: false },
  { id: "4", titulo: "Organizar armário", concluida: true, flagged: false },
  { id: "5", titulo: "Lorem Ipsum", concluida: true, flagged: false },
];

export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);

  function toggleConcluida(id: string) {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
    );
  }

  function toggleFlagged(id: string) {
    setTarefas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, flagged: !t.flagged } : t))
    );
  }

  function renderItem({ item }: { item: Tarefa }) {
    return (
      <View style={styles.card}>
        {/* Checkbox */}
        <Pressable
          onPress={() => toggleConcluida(item.id)}
          style={[styles.checkbox, item.concluida && styles.checkboxChecked]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.concluida }}
        >
          {item.concluida && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </Pressable>

        {/* Título */}
        <Text
          style={[styles.taskTitle, item.concluida && styles.taskTitleDone]}
          numberOfLines={1}
        >
          {item.titulo}
        </Text>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => toggleFlagged(item.id)}
            accessibilityLabel="Marcar como importante"
            style={styles.actionBtn}
          >
            <Ionicons
              name={item.flagged ? "flag" : "flag-outline"}
              size={22}
              color={item.flagged ? "#6B3FA0" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Ver detalhes"
            style={styles.actionBtn}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MINHAS TAREFAS</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        accessibilityLabel="Adicionar tarefa"
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const PRIMARY = "#6B3FA0";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCDCDC",
  },

  /* ── Header ── */
  header: {
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
  },

  /* ── Lista ── */
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    gap: 12,
  },

  /* ── Card ── */
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
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  /* ── Título da tarefa ── */
  taskTitle: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  taskTitleDone: {
    textDecorationLine: "none", // mantenha sem risco conforme o design
  },

  /* ── Ícones de ação ── */
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    padding: 4,
  },

  /* ── FAB ── */
  fab: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
