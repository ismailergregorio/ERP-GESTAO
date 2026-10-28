import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { styles } from "../../theme/styles";

type AppHeaderProps = { onRefresh: () => void };

export function AppHeader({ onRefresh }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandIcon}><Ionicons name="cube-outline" size={25} color="#fff" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>ERP • Retiradas</Text>
        <Text style={styles.headerSub}>Estoque, EPI e uniformes</Text>
      </View>
      <Pressable onPress={onRefresh} style={styles.headerAction} accessibilityLabel="Atualizar dados">
        <Ionicons name="refresh" size={22} color={colors.white} />
      </Pressable>
    </View>
  );
}
