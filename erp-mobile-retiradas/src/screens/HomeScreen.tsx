import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StatusBar, Text, View, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { listarSaidas } from "../services/saidaService";
import { mensagemErroApi } from "../api";
import type { Saida } from "../types";
import { colors } from "../theme/colors";

type Props = { onNovaRetirada: () => void };

const dataFormatada = (value?: string) => {
  if (!value) return "Data não informada";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function HomeScreen({ onNovaRetirada }: Props) {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true); else setLoading(true);
      setErro("");
      const dados = await listarSaidas();
      const ordenadas = [...(dados || [])].sort((a, b) => {
        const da = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const db = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return db - da;
      });
      setSaidas(ordenadas.slice(0, 8));
    } catch (e: unknown) {
      setErro(mensagemErroApi(e, "Não foi possível carregar as últimas retiradas."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => { void carregar(); }, [carregar]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F6FB" }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={{ backgroundColor: colors.primary, padding: 20, paddingBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="cube-outline" size={27} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>ERP • Retiradas</Text>
          <Text style={{ color: "#DCE7FF", marginTop: 3, fontSize: 13 }}>Controle de saídas de produtos</Text>
        </View>
        <Pressable onPress={() => void carregar(true)} style={{ padding: 8 }} accessibilityLabel="Atualizar retiradas">
          <Ionicons name="refresh" size={22} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 18, paddingBottom: 30, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void carregar(true)} />}
        data={saidas}
        keyExtractor={(item, index) => String(item.id ?? index)}
        ListHeaderComponent={
          <View>
            <Text style={{ color: "#182230", fontSize: 25, fontWeight: "800" }}>Início</Text>
            <Text style={{ color: "#667085", marginTop: 5, marginBottom: 18, lineHeight: 20 }}>Consulte as retiradas recentes ou inicie uma nova entrega.</Text>
            <Pressable onPress={onNovaRetirada} style={{ backgroundColor: colors.green, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 25 }}>
              <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="add-circle-outline" size={29} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Nova retirada</Text>
                <Text style={{ color: "#E5FFF2", fontSize: 12, marginTop: 3 }}>Registrar saída de produtos ou EPI</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#fff" />
            </Pressable>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: "#182230", fontSize: 18, fontWeight: "800" }}>Últimas retiradas</Text>
              <Text style={{ color: "#667085", fontSize: 12 }}>Mais recentes</Text>
            </View>
            {loading && <View style={{ padding: 25, alignItems: "center" }}><ActivityIndicator color={colors.primary} /><Text style={{ color: "#667085", marginTop: 8 }}>Carregando retiradas...</Text></View>}
            {!!erro && <View style={{ padding: 14, borderRadius: 12, backgroundColor: "#FEF2F2", marginBottom: 12 }}>
              <Text style={{ color: "#991B1B", fontWeight: "700" }}>Não foi possível carregar o histórico</Text>
              <Text style={{ color: "#991B1B", marginTop: 5, fontSize: 12 }}>{erro}</Text>
              <Pressable onPress={() => void carregar()} style={{ marginTop: 10 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Tentar novamente</Text></Pressable>
            </View>}
            {!loading && !erro && saidas.length === 0 && <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 22, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 12 }}>
              <Ionicons name="file-tray-outline" size={30} color="#98A2B3" />
              <Text style={{ color: "#182230", fontWeight: "700", marginTop: 8 }}>Nenhuma retirada encontrada</Text>
              <Text style={{ color: "#667085", textAlign: "center", marginTop: 4, fontSize: 12 }}>As retiradas registradas aparecerão aqui.</Text>
            </View>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "flex-start", gap: 11 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.saidaEpi ? "#FFF4D6" : "#EAF1FF", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={item.saidaEpi ? "shield-checkmark-outline" : "cube-outline"} size={21} color={item.saidaEpi ? "#946200" : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#182230", fontSize: 14, fontWeight: "800" }}>{item.funcionario || "Usuário não informado"}</Text>
              <Text style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>Retirada #{item.id} • {dataFormatada(item.dataCriacao)}</Text>
              <View style={{ alignSelf: "flex-start", backgroundColor: item.saidaEpi ? "#FFF4D6" : "#EAF1FF", borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 }}>
                <Text style={{ color: item.saidaEpi ? "#946200" : colors.primary, fontSize: 11, fontWeight: "800" }}>{item.saidaEpi ? "EPI / Uniforme" : "Saída de produtos"}</Text>
              </View>
              {item.assinaturaColetada !== undefined && <Text style={{ color: item.assinaturaColetada ? colors.green : "#667085", fontSize: 11, marginTop: 6 }}>{item.assinaturaColetada ? "Assinatura coletada" : "Sem assinatura"}</Text>}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
