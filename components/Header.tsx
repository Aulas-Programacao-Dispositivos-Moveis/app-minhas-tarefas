import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PRIMARY } from "../constants";

type HeaderProps = {
  /** Exibe o botão de voltar à esquerda */
  onVoltar?: () => void;
};

/**
 * Header roxo compartilhado entre as telas.
 * Se `onVoltar` for passado, exibe o botão ← à esquerda.
 */
export function Header({ onVoltar }: HeaderProps) {
  return (
    <View style={styles.header}>
      {onVoltar ? (
        <TouchableOpacity
          onPress={onVoltar}
          style={styles.backBtn}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text style={styles.title}>MINHAS TAREFAS</Text>

      {/* Espaço para manter o título centralizado */}
      <View style={styles.spacer} />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    color: "#EFEFEF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 40,
  },
});
