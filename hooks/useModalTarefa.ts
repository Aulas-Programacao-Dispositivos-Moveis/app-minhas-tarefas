import { useRef, useState } from "react";
import { Animated, Platform } from "react-native";

/**
 * Hook que gerencia o estado do modal de criação de tarefas.
 * Responsável por: campos do formulário, visibilidade, animação do FAB,
 * lembrete e date/time pickers.
 */
export function useModalTarefa() {
  // ── Visibilidade e animação ────────────────────────────────────────────
  const [modalVisivel, setModalVisivel] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current;

  // ── Campos do formulário ───────────────────────────────────────────────
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoLembrete, setNovoLembrete] = useState<Date | null>(null);

  // ── Pickers de data e hora ─────────────────────────────────────────────
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ── Reset ──────────────────────────────────────────────────────────────

  function resetModal() {
    setNovoTitulo("");
    setNovaDescricao("");
    setNovoLembrete(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  // ── Abrir / Fechar ────────────────────────────────────────────────────

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

  // ── Lembrete ──────────────────────────────────────────────────────────

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

  // ── Date/Time pickers ─────────────────────────────────────────────────

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

  function handleAbrirDatePicker() {
    setShowTimePicker(false);
    setShowDatePicker((v) => !v);
  }

  function handleAbrirTimePicker() {
    setShowDatePicker(false);
    setShowTimePicker((v) => !v);
  }

  return {
    // Estado
    modalVisivel,
    fabScale,
    novoTitulo,
    novaDescricao,
    novoLembrete,
    showDatePicker,
    showTimePicker,

    // Setters (para TextInput onChangeText)
    setNovoTitulo,
    setNovaDescricao,

    // Handlers
    handleAbrirModal,
    handleFecharModal,
    resetModal,
    handleToggleLembrete,
    handleRemoverLembrete,
    handleDateChange,
    handleTimeChange,
    handleAbrirDatePicker,
    handleAbrirTimePicker,
  };
}
