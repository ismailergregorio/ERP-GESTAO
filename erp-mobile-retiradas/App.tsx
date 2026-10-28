import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { buscarToken, salvarToken, removerToken } from "./src/services/tokenStorage";
import LoginScreen from "./src/screens/LoginScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RetiradaScreen from "./src/screens/RetiradaScreen";
import { buscarMeuUsuario, type UsuarioSessao } from "./src/services/authService";
import { colors } from "./src/theme/colors";

type Tela = "inicio" | "retirada" | "perfil" | "senha";

export default function App() {
  const [inicializando, setInicializando] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [trocaObrigatoria, setTrocaObrigatoria] = useState(false);
  const [tela, setTela] = useState<Tela>("inicio");

  const sair = async () => {
    await removerToken();
    setToken(null);
    setUsuario(null);
    setTrocaObrigatoria(false);
    setTela("inicio");
  };

  const carregarUsuario = async (forcarTroca = false) => {
    const dados = await buscarMeuUsuario();
    setUsuario(dados);
    const precisaTrocar = forcarTroca || Boolean(dados.trocarSenha);
    setTrocaObrigatoria(precisaTrocar);
    setTela(precisaTrocar ? "senha" : "inicio");
  };

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const salvo = await buscarToken();
        if (!salvo) return;
        setToken(salvo);
        const usuarioAtual = await buscarMeuUsuario();
        if (!ativo) return;
        setUsuario(usuarioAtual);
        const precisaTrocar = Boolean(usuarioAtual.trocarSenha);
        setTrocaObrigatoria(precisaTrocar);
        setTela(precisaTrocar ? "senha" : "inicio");
      } catch {
        await removerToken();
        if (ativo) { setToken(null); setUsuario(null); }
      } finally {
        if (ativo) setInicializando(false);
      }
    })();
    return () => { ativo = false; };
  }, []);

  const concluirLogin = async (novoToken: string, precisaTrocar: boolean) => {
    await salvarToken(novoToken);
    setToken(novoToken);
    await carregarUsuario(precisaTrocar);
  };

  const concluirTrocaSenha = async () => {
    const dados = await buscarMeuUsuario();
    setUsuario(dados);
    setTrocaObrigatoria(Boolean(dados.trocarSenha));
    setTela(dados.trocarSenha ? "senha" : "inicio");
  };

  if (inicializando) {
    return <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.muted, marginTop: 12 }}>Verificando sessão...</Text>
    </SafeAreaView>;
  }

  if (!token || !usuario) return <LoginScreen onLogin={concluirLogin} />;

  // A senha temporária deve ser trocada antes de permitir qualquer módulo.
  if (trocaObrigatoria || usuario.trocarSenha || tela === "senha") {
    return <ChangePasswordScreen obrigatoria={trocaObrigatoria || usuario.trocarSenha} onConcluida={concluirTrocaSenha} onCancelar={trocaObrigatoria ? undefined : () => setTela("perfil")} />;
  }

  if (tela === "perfil") {
    return <ProfileScreen
      usuario={usuario}
      onVoltar={() => setTela("inicio")}
      onNomeAtualizado={setUsuario}
      onAlterarSenha={() => setTela("senha")}
      onSair={() => void sair()}
    />;
  }

  if (tela === "retirada" && usuario.perfil !== "CONSULTA") {
    return <RetiradaScreen onVoltarInicio={() => setTela("inicio")} />;
  }

  return <HomeScreen
    usuario={usuario}
    onNovaRetirada={() => usuario.perfil !== "CONSULTA" && setTela("retirada")}
    onPerfil={() => setTela("perfil")}
  />;
}
