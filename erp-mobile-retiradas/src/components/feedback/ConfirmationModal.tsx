import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

type Props = {
  visible: boolean;
  status: "success" | "error";
  title: string;
  message: string;
  details?: string;
  onClose: () => void;
};

export function ConfirmationModal({ visible, status, title, message, details, onClose }: Props) {
  const scale = useRef(new Animated.Value(0.75)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.75);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, scale]);

  const success = status === "success";
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.55)", alignItems: "center", justifyContent: "center", padding: 22 }}>
        <Animated.View style={{
          width: "100%", maxWidth: 440, backgroundColor: "#fff", borderRadius: 24,
          padding: 25, alignItems: "center", opacity, transform: [{ scale }],
        }}>
          <View style={{
            width: 82, height: 82, borderRadius: 41, alignItems: "center", justifyContent: "center",
            backgroundColor: success ? "#DCFCE7" : "#FEE2E2", marginBottom: 18,
          }}>
            <Ionicons name={success ? "checkmark-circle" : "close-circle"} size={62} color={success ? "#16A34A" : "#DC2626"} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#182230", textAlign: "center" }}>{title}</Text>
          <Text style={{ fontSize: 15, color: "#475467", textAlign: "center", lineHeight: 22, marginTop: 10 }}>{message}</Text>
          {!!details && (
            <View style={{ width: "100%", marginTop: 15, padding: 12, borderRadius: 12, backgroundColor: success ? "#F0FDF4" : "#FEF2F2", borderWidth: 1, borderColor: success ? "#BBF7D0" : "#FECACA" }}>
              <Text selectable style={{ color: success ? "#166534" : "#991B1B", fontSize: 13, lineHeight: 19 }}>{details}</Text>
            </View>
          )}
          <Pressable onPress={onClose} style={{
            width: "100%", minHeight: 48, borderRadius: 12, marginTop: 22,
            backgroundColor: success ? colors.green : "#DC2626", alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{success ? "Continuar" : "Entendi, corrigir"}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
