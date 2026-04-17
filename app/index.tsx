import { Ionicons } from "@expo/vector-icons";
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { ModalNovaTarefa } from "../components/ModalNovaTarefa";
import { TarefaCard } from "../components/TarefaCard";
import { PRIMARY } from "../constants";
import { useModalTarefa } from "../hooks/useModalTarefa";
import { useTarefas } from "../hooks/useTarefas";
import { Tarefa } from "../types/Tarefa";

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Index() {
  const {
    tarefas,
    carregando,
    handleToggleConcluida,
    handleToggleFlagged,
    handleAdicionarTarefa,
    handleAbrirDetalhes,
  } = useTarefas();

  const modal = useModalTarefa();

  // ── Submeter nova tarefa ────────────────────────────────────────────────

  function handleSubmit() {
    const ok = handleAdicionarTarefa(
      modal.novoTitulo,
      modal.novaDescricao,
      modal.novoLembrete
    );
    if (!ok) return;
    modal.resetModal();
    modal.handleFecharModal();
  }

  // ── Render de item ───────────────────────────────────────────────────────

  function renderItem({ item }: { item: Tarefa }) {
    return (
      <TarefaCard
        tarefa={item}
        onToggleConcluida={handleToggleConcluida}
        onToggleFlagged={handleToggleFlagged}
        onAbrirDetalhes={handleAbrirDetalhes}
      />
    );
  }

  // ── Render principal ─────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header />

      <View style={styles.content}>
        {!carregando && tarefas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color="#bbb" />
            <Text style={styles.emptyText}>Nenhuma tarefa ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no "+" para adicionar sua primeira tarefa
            </Text>
          </View>
        ) : (
          <FlatList
            data={tarefas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FAB */}
      <Animated.View style={[styles.fab, { transform: [{ scale: modal.fabScale }] }]}>
        <TouchableOpacity
          onPress={modal.handleAbrirModal}
          accessibilityLabel="Adicionar tarefa"
          activeOpacity={0.85}
          style={styles.fabInner}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal de nova tarefa */}
      <ModalNovaTarefa
        visivel={modal.modalVisivel}
        titulo={modal.novoTitulo}
        descricao={modal.novaDescricao}
        lembrete={modal.novoLembrete}
        showDatePicker={modal.showDatePicker}
        showTimePicker={modal.showTimePicker}
        onChangeTitulo={modal.setNovoTitulo}
        onChangeDescricao={modal.setNovaDescricao}
        onFechar={modal.handleFecharModal}
        onSubmit={handleSubmit}
        onToggleLembrete={modal.handleToggleLembrete}
        onRemoverLembrete={modal.handleRemoverLembrete}
        onDateChange={modal.handleDateChange}
        onTimeChange={modal.handleTimeChange}
        onAbrirDatePicker={modal.handleAbrirDatePicker}
        onAbrirTimePicker={modal.handleAbrirTimePicker}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  content: {
    flex: 1,
    backgroundColor: "#DCDCDC",
  },

  /* ── Lista ── */
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    gap: 12,
  },

  /* ── Estado vazio ── */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#999" },
  emptySubtext: { fontSize: 14, color: "#bbb", textAlign: "center" },

  /* ── FAB ── */
  fab: {
    position: "absolute",
    bottom: 36,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
});
