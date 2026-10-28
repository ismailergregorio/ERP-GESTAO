import React from "react";
import { Alert, Text, View } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { styles } from "../../theme/styles";

type Props = { value: string; onChange: (signature: string) => void };

export function SignatureCapture({ value, onChange }: Props) {
  return (
    <>
      <View style={styles.signatureWrap}>
        <SignatureScreen
          onOK={onChange}
          onEmpty={() => { onChange(""); Alert.alert("Assinatura necessária", "Assine no quadro antes de concluir."); }}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Usar assinatura"
          webStyle={`.m-signature-pad { box-shadow: none; border: 0; } .m-signature-pad--body { border: 0; } .m-signature-pad--footer { padding: 4px; display: flex; } .button { background-color: ${colors.primary}; color: white; border-radius: 8px; } body,html { width: 100%; height: 100%; }`}
          autoClear={false}
          imageType="image/png"
          backgroundColor="#ffffff"
          penColor="#14213d"
          minWidth={1}
          maxWidth={3}
        />
      </View>
      <View style={[styles.signatureStatus, value ? styles.signed : null]}>
        <Ionicons name={value ? "checkmark-circle" : "alert-circle-outline"} size={18} color={value ? colors.green : "#946200"} />
        <Text style={[styles.signatureStatusText, value ? { color: colors.green } : null]}>
          {value ? "Assinatura pronta para envio" : "A assinatura será obrigatória para concluir"}
        </Text>
      </View>
    </>
  );
}
