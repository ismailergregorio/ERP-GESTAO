import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { styles } from "../../theme/styles";

export type TipoRetirada = "normal" | "epi";
type Props = { value: TipoRetirada; onChange: (value: TipoRetirada) => void };

export function TipoRetiradaSelector({ value, onChange }: Props) {
  return (
    <View style={styles.typeRow}>
      <Pressable onPress={() => onChange("normal")} style={[styles.typeCard, value === "normal" && styles.typeSelected]}>
        <Ionicons name="file-tray-stacked-outline" size={23} color={value === "normal" ? colors.primary : colors.muted} />
        <Text style={[styles.typeTitle, value === "normal" && styles.typeTextSelected]}>Saída comum</Text>
        <Text style={styles.typeHint}>Produtos gerais</Text>
      </Pressable>
      <Pressable onPress={() => onChange("epi")} style={[styles.typeCard, value === "epi" && styles.typeSelected]}>
        <Ionicons name="shield-checkmark-outline" size={23} color={value === "epi" ? colors.primary : colors.muted} />
        <Text style={[styles.typeTitle, value === "epi" && styles.typeTextSelected]}>EPI / Uniforme</Text>
        <Text style={styles.typeHint}>Entrega individual</Text>
      </Pressable>
    </View>
  );
}
