import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PRIMARY } from "../constants";
import { Tarefa } from "../types/Tarefa";
import { formatarData, formatarHora } from "../utils/formatters";
import { carregarTarefas, salvarTarefas } from "../utils/storage";
import { adicionarTarefa, toggleConcluida, toggleFlagged } from "../utils/tarefas";

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estado do modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoLembrete, setNovoLembrete] = useState<Date | null>(null);

  // Pickers independentes de data e hora
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fabScale = useRef(new Animated.Value(1)).current;

  // ── Carregar ao iniciar ──────────────────────────────────────────────────
  useEffect(() => {
    carregarTarefas().then((dados) => {
      setTarefas(dados);
      setCarregando(false);
    });
  }, []);

  // ── Salvar ao alterar ────────────────────────────────────────────────────
  useEffect(() => {
    if (carregando) return;
    salvarTarefas(tarefas);
  }, [tarefas, carregando]);

  // ── Handlers de lista ────────────────────────────────────────────────────

  function handleToggleConcluida(id: string) {
    setTarefas((prev) => toggleConcluida(prev, id));
  }

  function handleToggleFlagged(id: string) {
    setTarefas((prev) => toggleFlagged(prev, id));
  }

  // ── Handlers do modal ────────────────────────────────────────────────────

  function resetModal() {
    setNovoTitulo("");
    setNovaDescricao("");
    setNovoLembrete(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  function handleAbrirModal() {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setModalVisivel(true);
  }

  function handleFecharModal() {
    resetModal();
    setModalVisivel(false);
  }

  function handleAdicionarTarefa() {
    const novaLista = adicionarTarefa(
      tarefas,
      novoTitulo,
      novaDescricao,
      novoLembrete?.toISOString() ?? null
    );
    if (!novaLista) return;
    setTarefas(novaLista);
    resetModal();
    setModalVisivel(false);
  }

  // ── Handlers do lembrete ─────────────────────────────────────────────────

  function handleToggleLembrete() {
    if (novoLembrete) {
      setNovoLembrete(null);
      setShowDatePicker(false);
      setShowTimePicker(false);
    } else {
      // Valor inicial: hoje + 30 min arredondado
      const d = new Date();
      d.setMinutes(d.getMinutes() + 30, 0, 0);
      setNovoLembrete(d);
    }
  }

  function handleRemoverLembrete() {
    setNovoLembrete(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  /** Atualiza apenas a parte da DATA, preservando a hora já escolhida */
  function handleDateChange(_event: any, selectedDate?: Date) {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (!selectedDate || !novoLembrete) return;
    const updated = new Date(novoLembrete);
    updated.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    setNovoLembrete(updated);
  }

  /** Atualiza apenas a parte da HORA, preservando a data já escolhida */
  function handleTimeChange(_event: any, selectedTime?: Date) {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (!selectedTime || !novoLembrete) return;
    const updated = new Date(novoLembrete);
    updated.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    setNovoLembrete(updated);
  }

  // ── Render de item ───────────────────────────────────────────────────────

  function renderItem({ item }: { item: Tarefa }) {
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => handleToggleConcluida(item.id)}
          style={[styles.checkbox, item.concluida && styles.checkboxChecked]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.concluida }}
        >
          {item.concluida && <Ionicons name="checkmark" size={16} color="#fff" />}
        </Pressable>

        <Text style={[styles.taskTitle, item.concluida && styles.taskTitleDone]} numberOfLines={1}>
          {item.titulo}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleToggleFlagged(item.id)}
            accessibilityLabel="Marcar como importante"
            style={styles.actionBtn}
          >
            <Ionicons
              name={item.flagged ? "flag" : "flag-outline"}
              size={22}
              color={item.flagged ? PRIMARY : "#555"}
            />
          </TouchableOpacity>

          <TouchableOpacity accessibilityLabel="Ver detalhes" style={styles.actionBtn}>
            <Ionicons name="information-circle-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Render principal ─────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MINHAS TAREFAS</Text>
      </View>

      {/* Área de conteúdo com fundo cinza (define cor do SafeArea abaixo do header) */}
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
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          onPress={handleAbrirModal}
          accessibilityLabel="Adicionar tarefa"
          activeOpacity={0.85}
          style={styles.fabInner}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Android: pickers FORA do Modal (limitação nativa) */}
      {novoLembrete && showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={novoLembrete}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      {novoLembrete && showTimePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={novoLembrete}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* ── Modal de nova tarefa ── */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={handleFecharModal}
      >
        <TouchableWithoutFeedback onPress={handleFecharModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrapper}
          pointerEvents="box-none"
        >
          <View style={styles.modalBox}>
            {/* Cabeçalho do modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Tarefa</Text>
              <TouchableOpacity onPress={handleFecharModal} style={styles.modalClose}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.modalScroll}
            >
              {/* ── Título ── */}
              <Text style={styles.fieldLabel}>Título *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da tarefa..."
                placeholderTextColor="#aaa"
                value={novoTitulo}
                onChangeText={setNovoTitulo}
                autoFocus
                returnKeyType="next"
                maxLength={80}
              />

              {/* ── Descrição ── */}
              <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Descreva a tarefa (opcional)..."
                placeholderTextColor="#aaa"
                value={novaDescricao}
                onChangeText={setNovaDescricao}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="default"
                maxLength={200}
              />

              {/* ── Lembrete ── */}
              <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Lembrete</Text>

              {/* Toggle ativar/desativar */}
              <TouchableOpacity
                style={[styles.lembreteRow, novoLembrete && styles.lembreteRowActive]}
                onPress={handleToggleLembrete}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="alarm-outline"
                  size={20}
                  color={novoLembrete ? PRIMARY : "#888"}
                />
                <Text style={[styles.lembreteText, novoLembrete && styles.lembreteTextActive]}>
                  {novoLembrete ? "Lembrete ativo" : "Adicionar lembrete"}
                </Text>
                {novoLembrete ? (
                  <TouchableOpacity
                    onPress={handleRemoverLembrete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#bbb" />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#bbb" />
                )}
              </TouchableOpacity>

              {/* Botões de data e hora (visíveis só quando ativo) */}
              {novoLembrete && (
                <View style={styles.lembreteFields}>
                  {/* Botão DATA */}
                  <TouchableOpacity
                    style={[
                      styles.pickerBtn,
                      showDatePicker && styles.pickerBtnOpen,
                    ]}
                    onPress={() => {
                      setShowTimePicker(false);
                      setShowDatePicker((v) => !v);
                    }}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="calendar-outline" size={16} color={PRIMARY} />
                    <Text style={styles.pickerBtnText}>
                      {formatarData(novoLembrete)}
                    </Text>
                  </TouchableOpacity>

                  {/* Botão HORA */}
                  <TouchableOpacity
                    style={[
                      styles.pickerBtn,
                      showTimePicker && styles.pickerBtnOpen,
                    ]}
                    onPress={() => {
                      setShowDatePicker(false);
                      setShowTimePicker((v) => !v);
                    }}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="time-outline" size={16} color={PRIMARY} />
                    <Text style={styles.pickerBtnText}>
                      {formatarHora(novoLembrete)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* iOS: pickers inline */}
              {novoLembrete && showDatePicker && Platform.OS === "ios" && (
                <DateTimePicker
                  value={novoLembrete}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  locale="pt-BR"
                />
              )}
              {novoLembrete && showTimePicker && Platform.OS === "ios" && (
                <DateTimePicker
                  value={novoLembrete}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  locale="pt-BR"
                />
              )}
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancelar} onPress={handleFecharModal}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnAdicionar,
                  !novoTitulo.trim() && styles.btnAdicionarDisabled,
                ]}
                onPress={handleAdicionarTarefa}
                disabled={!novoTitulo.trim()}
              >
                <Text style={styles.btnAdicionarText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // PRIMARY aqui faz a área da status bar ficar roxa no iOS
    backgroundColor: PRIMARY,
  },
  content: {
    flex: 1,
    backgroundColor: "#DCDCDC",
  },

  /* ── Header ── */
  header: {
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 24,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  headerTitle: {
    color: "#EFEFEF",
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
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },

  /* ── Título da tarefa ── */
  taskTitle: { flex: 1, fontSize: 16, color: "#1a1a1a", fontWeight: "500" },
  taskTitleDone: { textDecorationLine: "none" },

  /* ── Ícones de ação ── */
  actions: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionBtn: { padding: 4 },

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

  /* ── Modal ── */
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 12,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  modalClose: { padding: 4 },
  modalScroll: { flexGrow: 0 },

  /* ── Campos ── */
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  fieldLabelSpaced: { marginTop: 16 },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  inputMultiline: {
    height: 80,
    paddingTop: 12,
  },

  /* ── Lembrete ── */
  lembreteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fafafa",
  },
  lembreteRowActive: {
    borderColor: PRIMARY,
    backgroundColor: "#f5f0fc",
  },
  lembreteText: { flex: 1, fontSize: 15, color: "#aaa" },
  lembreteTextActive: { color: PRIMARY, fontWeight: "600" },
  lembreteFields: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f5f0fc",
  },
  pickerBtnOpen: {
    backgroundColor: "#ecdff7",
    borderColor: PRIMARY,
  },
  pickerBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY,
  },

  /* ── Botões ── */
  modalActions: { flexDirection: "row", gap: 12, marginTop: 4 },
  btnCancelar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  btnCancelarText: { fontSize: 15, fontWeight: "600", color: "#666" },
  btnAdicionar: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
  },
  btnAdicionarDisabled: { backgroundColor: "#c4a8e0" },
  btnAdicionarText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
