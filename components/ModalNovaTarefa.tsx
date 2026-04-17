import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { PRIMARY } from "../constants";
import { formatarData, formatarHora } from "../utils/formatters";

type ModalNovaTarefaProps = {
  visivel: boolean;
  titulo: string;
  descricao: string;
  lembrete: Date | null;
  showDatePicker: boolean;
  showTimePicker: boolean;

  onChangeTitulo: (texto: string) => void;
  onChangeDescricao: (texto: string) => void;
  onFechar: () => void;
  onSubmit: () => void;
  onToggleLembrete: () => void;
  onRemoverLembrete: () => void;
  onDateChange: (event: any, date?: Date) => void;
  onTimeChange: (event: any, time?: Date) => void;
  onAbrirDatePicker: () => void;
  onAbrirTimePicker: () => void;
};

/**
 * Modal de criação de nova tarefa.
 * Contém campos de título, descrição e lembrete com date/time pickers.
 */
export function ModalNovaTarefa({
  visivel,
  titulo,
  descricao,
  lembrete,
  showDatePicker,
  showTimePicker,
  onChangeTitulo,
  onChangeDescricao,
  onFechar,
  onSubmit,
  onToggleLembrete,
  onRemoverLembrete,
  onDateChange,
  onTimeChange,
  onAbrirDatePicker,
  onAbrirTimePicker,
}: ModalNovaTarefaProps) {
  return (
    <>
      {/* Android: pickers FORA do Modal (limitação nativa) */}
      {lembrete && showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={lembrete}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {lembrete && showTimePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={lembrete}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <Modal
        visible={visivel}
        transparent
        animationType="fade"
        onRequestClose={onFechar}
      >
        <TouchableWithoutFeedback onPress={onFechar}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrapper}
          pointerEvents="box-none"
        >
          <View style={styles.modalBox}>
            {/* Cabeçalho */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Tarefa</Text>
              <TouchableOpacity onPress={onFechar} style={styles.modalClose}>
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
                value={titulo}
                onChangeText={onChangeTitulo}
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
                value={descricao}
                onChangeText={onChangeDescricao}
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
                style={[styles.lembreteRow, lembrete && styles.lembreteRowActive]}
                onPress={onToggleLembrete}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="alarm-outline"
                  size={20}
                  color={lembrete ? PRIMARY : "#888"}
                />
                <Text style={[styles.lembreteText, lembrete && styles.lembreteTextActive]}>
                  {lembrete ? "Lembrete ativo" : "Adicionar lembrete"}
                </Text>
                {lembrete ? (
                  <TouchableOpacity
                    onPress={onRemoverLembrete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#bbb" />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#bbb" />
                )}
              </TouchableOpacity>

              {/* Botões de data e hora */}
              {lembrete && (
                <View style={styles.lembreteFields}>
                  <TouchableOpacity
                    style={[styles.pickerBtn, showDatePicker && styles.pickerBtnOpen]}
                    onPress={onAbrirDatePicker}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="calendar-outline" size={16} color={PRIMARY} />
                    <Text style={styles.pickerBtnText}>{formatarData(lembrete)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.pickerBtn, showTimePicker && styles.pickerBtnOpen]}
                    onPress={onAbrirTimePicker}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="time-outline" size={16} color={PRIMARY} />
                    <Text style={styles.pickerBtnText}>{formatarHora(lembrete)}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* iOS: pickers inline */}
              {lembrete && showDatePicker && Platform.OS === "ios" && (
                <DateTimePicker
                  value={lembrete}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  locale="pt-BR"
                />
              )}
              {lembrete && showTimePicker && Platform.OS === "ios" && (
                <DateTimePicker
                  value={lembrete}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                  locale="pt-BR"
                />
              )}
            </ScrollView>

            {/* Botões de ação */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancelar} onPress={onFechar}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnAdicionar,
                  !titulo.trim() && styles.btnAdicionarDisabled,
                ]}
                onPress={onSubmit}
                disabled={!titulo.trim()}
              >
                <Text style={styles.btnAdicionarText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
