import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { styles } from "../../theme/styles";

type Props = { value: string; onChange: (signature: string) => void };

export function SignatureCapture({ value, onChange }: Props) {
  const pad = useRef<SignatureCanvas>(null);

  const salvar = () => {
    const canvas = pad.current;
    if (!canvas || canvas.isEmpty()) {
      onChange("");
      return;
    }
    onChange(canvas.getTrimmedCanvas().toDataURL("image/png"));
  };

  const limpar = () => {
    pad.current?.clear();
    onChange("");
  };

  return (
    <>
      <View style={[styles.signatureWrap, { padding: 8 }]}>
        <SignatureCanvas
          ref={pad}
          penColor="#14213d"
          backgroundColor="#ffffff"
          canvasProps={{
            width: 900,
            height: 260,
            style: { width: "100%", height: "100%", touchAction: "none" },
          }}
          onEnd={salvar}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Pressable onPress={limpar} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>Limpar assinatura</Text>
        </Pressable>
      </View>
      <View style={[styles.signatureStatus, value ? styles.signed : null]}>
        <Text style={[styles.signatureStatusText, value ? { color: colors.green } : null]}>
          {value ? "Assinatura pronta para envio" : "Assine no quadro acima"}
        </Text>
      </View>
    </>
  );
}
