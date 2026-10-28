import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StatusBar, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { mensagemErroApi } from "../api";
import { alterarMinhaSenha } from "../services/authService";

type Props = { obrigatoria: boolean; onConcluida: () => Promise<void> | void; onCancelar?: () => void };

export default function ChangePasswordScreen({ obrigatoria, onConcluida, onCancelar }: Props) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const salvar = async () => {
    setErro(""); setSucesso("");
    if (!atual || !nova || !confirmacao) { setErro("Preencha todos os campos."); return; }
    if (nova.length < 6 || nova.length > 72) { setErro("A nova senha deve ter entre 6 e 72 caracteres."); return; }
    if (nova === atual) { setErro("A nova senha deve ser diferente da senha atual."); return; }
    if (nova !== confirmacao) { setErro("A confirmação não corresponde à nova senha."); return; }
    try {
      setLoading(true);
      await alterarMinhaSenha(atual, nova);
      setSucesso("Senha alterada com sucesso.");
      setAtual(""); setNova(""); setConfirmacao("");
      await onConcluida();
    } catch (e) { setErro(mensagemErroApi(e, "Não foi possível alterar a senha.")); }
    finally { setLoading(false); }
  };

  const campo = (label: string, value: string, setter: (v: string) => void, placeholder: string) => (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: colors.text, fontWeight: "800", marginBottom: 7 }}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={placeholder} secureTextEntry autoCapitalize="none" editable={!loading} style={{ backgroundColor: "#fff", borderColor: colors.border, borderWidth: 1, borderRadius: 11, padding: 14, color: colors.text }} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ backgroundColor: colors.primaryDark, padding: 22, paddingTop: 34 }}>
          <Ionicons name="shield-checkmark-outline" size={35} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 10 }}>{obrigatoria ? "Confirme sua nova senha" : "Alterar senha"}</Text>
          <Text style={{ color: "#DCE7FF", marginTop: 6, lineHeight: 20 }}>{obrigatoria ? "Por segurança, troque a senha temporária antes de acessar o aplicativo." : "Informe a senha atual e escolha uma nova senha."}</Text>
        </View>
        <View style={{ padding: 22 }}>
          {campo("Senha atual ou temporária", atual, setAtual, "Digite a senha atual")}
          {campo("Nova senha", nova, setNova, "Mínimo de 6 caracteres")}
          {campo("Confirmar nova senha", confirmacao, setConfirmacao, "Digite novamente a nova senha")}
          {!!erro && <Text style={{ color: colors.red, marginTop: 12 }}>{erro}</Text>}
          {!!sucesso && <Text style={{ color: colors.green, marginTop: 12 }}>{sucesso}</Text>}
          <Pressable onPress={() => void salvar()} disabled={loading} style={{ marginTop: 22, backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 9 }}>
            {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="checkmark-circle-outline" size={21} color="#fff" />}
            <Text style={{ color: "#fff", fontWeight: "900" }}>{loading ? "Salvando..." : "Confirmar nova senha"}</Text>
          </Pressable>
          {!obrigatoria && onCancelar && <Pressable onPress={onCancelar} style={{ padding: 15, alignItems: "center" }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Cancelar</Text></Pressable>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
