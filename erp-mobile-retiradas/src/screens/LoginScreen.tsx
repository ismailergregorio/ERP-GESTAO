import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StatusBar, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { login } from "../services/authService";
import { mensagemErroApi } from "../api";

type Props = { onLogin: (token: string, trocarSenha: boolean) => Promise<void> };

export default function LoginScreen({ onLogin }: Props) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const entrar = async () => {
    if (!usuario.trim() || !senha) { setErro("Informe seu usuário e sua senha."); return; }
    try {
      setLoading(true); setErro("");
      const resposta = await login(usuario, senha);
      await onLogin(resposta.token, Boolean(resposta.trocarSenha || resposta.usuario?.trocarSenha));
    } catch (e) {
      setErro(mensagemErroApi(e, "Não foi possível entrar. Confira suas credenciais."));
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ backgroundColor: colors.primaryDark, paddingHorizontal: 25, paddingTop: 42, paddingBottom: 36, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ alignSelf: "center", width: 68, height: 68, borderRadius: 20, backgroundColor: "#1685ED", alignItems: "center", justifyContent: "center", marginBottom: 13 }}>
            <Ionicons name="cube" size={39} color="#fff" />
          </View>
          <Text style={{ textAlign: "center", color: "#fff", fontSize: 30, fontWeight: "900" }}>Dev <Text style={{ color: "#2D9CFF" }}>ERP</Text></Text>
          <Text style={{ textAlign: "center", color: "#DCE7FF", marginTop: 5, fontSize: 15 }}>Retiradas Mobile</Text>
          <Text style={{ textAlign: "center", color: "#fff", fontSize: 21, fontWeight: "800", marginTop: 25 }}>Bem-vindo de volta</Text>
          <Text style={{ textAlign: "center", color: "#DCE7FF", marginTop: 6 }}>Entre para gerenciar retiradas com segurança.</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 25 }}>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: "800", marginBottom: 8 }}>Usuário</Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, marginBottom: 18 }}>
            <Ionicons name="person-outline" size={21} color={colors.muted} />
            <TextInput value={usuario} onChangeText={setUsuario} placeholder="Digite seu usuário" autoCapitalize="none" autoCorrect={false} editable={!loading} returnKeyType="next" style={{ flex: 1, padding: 15, color: colors.text }} />
          </View>
          <Text style={{ color: colors.text, fontSize: 15, fontWeight: "800", marginBottom: 8 }}>Senha</Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14 }}>
            <Ionicons name="lock-closed-outline" size={21} color={colors.muted} />
            <TextInput value={senha} onChangeText={setSenha} placeholder="Digite sua senha" secureTextEntry={!mostrarSenha} editable={!loading} onSubmitEditing={() => void entrar()} returnKeyType="go" style={{ flex: 1, padding: 15, color: colors.text }} />
            <Pressable onPress={() => setMostrarSenha(v => !v)} accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}><Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color={colors.muted} /></Pressable>
          </View>
          {!!erro && <View style={{ backgroundColor: "#FEF2F2", padding: 12, borderRadius: 10, marginTop: 15 }}><Text style={{ color: colors.red }}>{erro}</Text></View>}
          <Pressable onPress={() => void entrar()} disabled={loading} style={{ marginTop: 24, backgroundColor: loading ? "#7CA9E9" : "#0877E8", borderRadius: 12, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}>
            {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="log-in-outline" size={22} color="#fff" />}
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>{loading ? "Entrando..." : "Entrar"}</Text>
          </Pressable>
          <View style={{ alignItems: "center", marginTop: 23, flexDirection: "row", justifyContent: "center", gap: 7 }}>
            <Ionicons name="shield-checkmark-outline" size={17} color={colors.muted} /><Text style={{ color: colors.muted, fontSize: 12 }}>Acesso protegido pela sua conta ERP</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
