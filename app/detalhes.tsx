import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PRIMARY } from "../constants";
import { formatarData, formatarHora } from "../utils/formatters";
import { carregarTarefas, salvarTarefas } from "../utils/storage";
import { removerTarefa } from "../utils/tarefas";

// ─── Tela de Detalhes da Tarefa ───────────────────────────────────────────────

export default function Detalhes() {
  const params = useLocalSearchParams<{
    id: string;
    titulo: string;
    descricao: string;
    flagged: string;
    lembrete: string;
    concluida: string;
  }>();

  const id = params.id ?? "";
  const titulo = params.titulo ?? "";
  const descricao = params.descricao ?? "";
  const flagged = params.flagged === "true";
  const concluida = params.concluida === "true";
  const lembrete = params.lembrete ? new Date(params.lembrete) : null;

  // ── Excluir tarefa ────────────────────────────────────────────────────────

  function handleExcluir() {
    Alert.alert(
      "Excluir tarefa",
      `Deseja realmente excluir "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const tarefas = await carregarTarefas();
            const atualizadas = removerTarefa(tarefas, id);
            await salvarTarefas(atualizadas);
            router.replace("/");
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MINHAS TAREFAS</Text>
        {/* Espaço vazio para centralizar o título */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.detalhesContainer}>
          {/* Título + Flag */}
          <View style={styles.tituloRow}>
            <Text style={[styles.titulo, concluida && styles.tituloConcluida]}>
              {titulo}
            </Text>
            <Ionicons
              name={flagged ? "flag" : "flag-outline"}
              size={28}
              color={flagged ? PRIMARY : "#888"}
            />
          </View>

          {/* Descrição */}
          {descricao ? (
            <Text style={styles.descricao}>{descricao}</Text>
          ) : null}

          {/* Lembrete */}
          {lembrete && (
            <View style={styles.lembreteContainer}>
              <Text style={styles.lembreteLabel}>Lembrete</Text>
              <Text style={styles.lembreteTexto}>
                Data: {formatarData(lembrete)}
              </Text>
              <Text style={styles.lembreteTexto}>
                Hora: {formatarHora(lembrete)}
              </Text>
            </View>
          )}
        </View>

        {/* Botão Excluir */}
        <View style={styles.deleteWrapper}>
          <TouchableOpacity
            onPress={handleExcluir}
            style={styles.deleteBtn}
            accessibilityLabel="Excluir tarefa"
          >
            <Ionicons name="trash-outline" size={28} color="#C0392B" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
  },

  /* ── Header ── */
  header: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#EFEFEF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 40,
  },

  /* ── Conteúdo ── */
  content: {
    flex: 1,
    backgroundColor: "#DCDCDC",
    justifyContent: "space-between",
  },
  detalhesContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  /* ── Título + Flag ── */
  tituloRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titulo: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginRight: 16,
  },
  tituloConcluida: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  /* ── Descrição ── */
  descricao: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 26,
    marginBottom: 24,
  },

  /* ── Lembrete ── */
  lembreteContainer: {
    marginTop: 8,
    gap: 6,
  },
  lembreteLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  lembreteTexto: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  /* ── Botão Excluir ── */
  deleteWrapper: {
    alignItems: "center",
    paddingBottom: 48,
  },
  deleteBtn: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
