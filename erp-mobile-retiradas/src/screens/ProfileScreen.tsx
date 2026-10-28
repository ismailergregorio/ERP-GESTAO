import React, { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StatusBar, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { mensagemErroApi } from "../api";
import { alterarMeuNome, type UsuarioSessao } from "../services/authService";

type Props = { usuario: UsuarioSessao; onVoltar: () => void; onNomeAtualizado: (usuario: UsuarioSessao) => void; onAlterarSenha: () => void; onSair: () => void };

const perfilLabel: Record<string, string> = { ADMIN: "Administrador", ESTOQUISTA: "Estoquista", CONSULTA: "Consulta" };

export default function ProfileScreen({ usuario, onVoltar, onNomeAtualizado, onAlterarSenha, onSair }: Props) {
  const [nome, setNome] = useState(usuario.nome);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const salvarNome = async () => {
    if (!nome.trim()) { setErro("O nome é obrigatório."); return; }
    if (nome.trim().length > 120) { setErro("O nome deve ter no máximo 120 caracteres."); return; }
    try {
      setLoading(true); setErro(""); setMensagem("");
      const atualizado = await alterarMeuNome(nome);
      onNomeAtualizado({ ...usuario, ...atualizado, nome: atualizado?.nome || nome.trim() });
      setMensagem("Nome atualizado com sucesso.");
    } catch (e) { setErro(mensagemErroApi(e, "Não foi possível atualizar o nome.")); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={{ backgroundColor: colors.primaryDark, padding: 22, paddingTop: 30, flexDirection: "row", alignItems: "center", gap: 13 }}>
        <Pressable onPress={onVoltar} accessibilityLabel="Voltar"><Ionicons name="arrow-back" size={24} color="#fff" /></Pressable>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "#2674D9", alignItems: "center", justifyContent: "center" }}><Ionicons name="person" size={26} color="#fff" /></View>
        <View><Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>Meu perfil</Text><Text style={{ color: "#DCE7FF", marginTop: 3 }}>Dados da sua conta</Text></View>
      </View>
      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 17 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Nome de usuário</Text>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800", marginTop: 4 }}>{usuario.nomeUsuario}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 15 }}>Perfil de acesso</Text>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "800", marginTop: 4 }}>{perfilLabel[usuario.perfil] || usuario.perfil}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 15 }}>Nome completo</Text>
          <TextInput value={nome} onChangeText={setNome} maxLength={120} editable={!loading} style={{ marginTop: 7, backgroundColor: "#fff", borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 13, color: colors.text }} />
          {!!erro && <Text style={{ color: colors.red, marginTop: 10 }}>{erro}</Text>}
          {!!mensagem && <Text style={{ color: colors.green, marginTop: 10 }}>{mensagem}</Text>}
          <Pressable onPress={() => void salvarNome()} disabled={loading} style={{ marginTop: 14, backgroundColor: colors.primary, borderRadius: 10, padding: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
            {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="save-outline" size={19} color="#fff" />}
            <Text style={{ color: "#fff", fontWeight: "800" }}>{loading ? "Salvando..." : "Salvar nome"}</Text>
          </Pressable>
        </View>
        <Pressable onPress={onAlterarSenha} style={{ marginTop: 15, backgroundColor: "#fff", borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="lock-closed-outline" size={23} color={colors.primary} /><Text style={{ flex: 1, color: colors.text, fontWeight: "800" }}>Alterar minha senha</Text><Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
        <Pressable onPress={onSair} style={{ marginTop: 15, padding: 15, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
          <Ionicons name="log-out-outline" size={20} color={colors.red} /><Text style={{ color: colors.red, fontWeight: "800" }}>Sair da conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
