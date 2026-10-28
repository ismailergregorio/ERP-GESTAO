import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform,
  Pressable, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/layout/AppHeader";
import { TipoRetiradaSelector, type TipoRetirada } from "../components/retiradas/TipoRetiradaSelector";
import { SignatureCapture } from "../components/retiradas/SignatureCapture";
import { mensagemErroApi } from "../api";
import { criarFuncionario, listarFuncionarios } from "../services/funcionarioService";
import { listarProdutosAtivos } from "../services/produtoService";
import { listarSetores } from "../services/setorService";
import { listarTiposSaida } from "../services/tipoSaidaService";
import { criarSaida, criarSaidaEpi } from "../services/saidaService";
import type { Funcionario, Produto, Setor, TipoSaida, SaidaRequest, SaidaEpiRequest } from "../types";

import { colors } from "../theme/colors";
import { styles } from "../theme/styles";
import { normalizar, ehEpi } from "../utils/retirada";

type Item = { produtoId: number; quantidade: string };


export default function RetiradaScreen({ onVoltarInicio }: { onVoltarInicio: () => void }) {
  const [tipo, setTipo] = useState<TipoRetirada>("normal");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [tiposSaida, setTiposSaida] = useState<TipoSaida[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [buscaPessoa, setBuscaPessoa] = useState("");
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [modalPessoa, setModalPessoa] = useState(false);
  const [nomeNovo, setNomeNovo] = useState("");
  const [cpfNovo, setCpfNovo] = useState("");
  const [criandoPessoa, setCriandoPessoa] = useState(false);
  const [setor, setSetor] = useState<Setor | null>(null);
  const [tipoSaida, setTipoSaida] = useState<TipoSaida | null>(null);
  const [finalidade, setFinalidade] = useState("");
  const [obs, setObs] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [assinatura, setAssinatura] = useState("");
  const [modalSelecao, setModalSelecao] = useState<"produto" | "setor" | "tipo" | null>(null);
  const [produtoBusca, setProdutoBusca] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      setLoadingDados(true);
      const [f, p, s, t] = await Promise.all([
        listarFuncionarios(), listarProdutosAtivos(), listarSetores(), listarTiposSaida()
      ]);
      setFuncionarios((f || []).filter((x: Funcionario) => x.ativo !== false));
      setProdutos((p || []).filter((x: Produto) => x.ativo !== false));
      setSetores((s || []).filter((x: Setor) => x.ativo !== false));
      setTiposSaida((t || []).filter((x: TipoSaida) => x.ativo !== false));
    } catch (e: unknown) {
      Alert.alert("Falha ao carregar dados", mensagemErroApi(e, "Não foi possível carregar os dados."));
    } finally { setLoadingDados(false); }
  }, []);

  useEffect(() => { void carregarDados(); }, [carregarDados]);

  const produtosDisponiveis = useMemo(() =>
    produtos.filter(p => tipo === "epi" ? ehEpi(p) : !ehEpi(p))
      .filter(p => normalizar(p.nome).includes(normalizar(produtoBusca))),
    [produtos, tipo, produtoBusca]);

  const pessoaFiltrada = useMemo(() => funcionarios.filter(f =>
    normalizar(f.nome).includes(normalizar(buscaPessoa)) ||
    (f.cpf || "").replace(/\D/g, "").includes(buscaPessoa.replace(/\D/g, ""))
  ), [funcionarios, buscaPessoa]);

  const limpar = () => {
    setFuncionario(null); setSetor(null); setTipoSaida(null); setFinalidade(tipo === "epi" ? "Entrega de EPI/Uniforme" : "");
    setObs(""); setItens([]); setAssinatura(""); setBuscaPessoa(""); setProdutoBusca("");
  };

  const selecionarTipo = (novo: TipoRetirada) => {
    setTipo(novo); setItens([]); setAssinatura("");
    setFinalidade(novo === "epi" ? "Entrega de EPI/Uniforme" : "");
  };

  const adicionarProduto = (p: Produto) => {
    if (itens.some(i => i.produtoId === p.id)) {
      Alert.alert("Produto já adicionado", "Altere a quantidade no item existente.");
      setModalSelecao(null); return;
    }
    if (p.estoque <= 0) {
      Alert.alert("Sem estoque", "Este produto não possui saldo disponível.");
      return;
    }
    setItens(old => [...old, { produtoId: p.id, quantidade: "1" }]);
    setModalSelecao(null); setProdutoBusca("");
  };

  const criarPessoa = async () => {
    if (!nomeNovo.trim()) { Alert.alert("Campo obrigatório", "Informe o nome do usuário."); return; }
    try {
      setCriandoPessoa(true);
      const dados = {
        nome: nomeNovo.trim(),
        ...(cpfNovo.trim() ? { cpf: cpfNovo.trim() } : {}),
      };
      const criada = await criarFuncionario(dados);
      const nova: Funcionario = { ...criada, ativo: criada.ativo ?? true };
      setFuncionarios(old => [...old, nova]);
      setFuncionario(nova); setModalPessoa(false); setNomeNovo(""); setCpfNovo(""); setBuscaPessoa("");
      Alert.alert("Usuário cadastrado", "Usuário selecionado para a retirada.");
    } catch (e: unknown) {
      Alert.alert("Não foi possível cadastrar", mensagemErroApi(e, "Confira os dados. Se o CPF já existir, localize o usuário na lista."));
    } finally { setCriandoPessoa(false); }
  };

  const salvar = async () => {
    if (!funcionario) return Alert.alert("Selecione o usuário", "Escolha ou cadastre quem está retirando os produtos.");
    if (!setor || !tipoSaida || !finalidade.trim()) return Alert.alert("Dados incompletos", "Informe setor, tipo de saída e finalidade.");
    if (!itens.length || itens.some(i => !Number(i.quantidade) || Number(i.quantidade) <= 0)) return Alert.alert("Itens incompletos", "Adicione ao menos um produto e informe quantidades válidas.");
    const ids = itens.map(i => i.produtoId);
    if (new Set(ids).size !== ids.length) return Alert.alert("Itens duplicados", "Cada produto deve aparecer apenas uma vez.");
    if (tipo === "epi" && !assinatura.startsWith("data:image/")) {
      return Alert.alert("Assinatura obrigatória", "A saída de EPI/uniforme exige a assinatura do usuário.");
    }
    const problema = itens.find(i => {
      const p = produtos.find(x => x.id === i.produtoId);
      return !p || Number(i.quantidade) > p.estoque || (tipo === "epi" && !ehEpi(p)) || (tipo === "normal" && ehEpi(p));
    });
    if (problema) return Alert.alert("Confira o estoque", "Um produto não tem saldo suficiente ou não pertence à categoria selecionada. Atualize os dados e tente novamente.");

    const dadosBase: SaidaRequest = {
      funcionarioId: funcionario.id,
      setorId: setor.id,
      tipoSaidaId: tipoSaida.id,
      finalidade: finalidade.trim(),
      ...(obs.trim() ? { obs: obs.trim() } : {}),
      produtos: itens.map(i => ({ produtoId: i.produtoId, quantidade: Number(i.quantidade) })),
    };
    try {
      setLoading(true);
      if (tipo === "epi") {
        const payloadEpi: SaidaEpiRequest = { ...dadosBase, assinaturaBase64: assinatura };
        await criarSaidaEpi(payloadEpi);
      } else {
        // Na saída comum, assinatura é opcional: só envia quando foi coletada.
        await criarSaida({
          ...dadosBase,
          ...(assinatura.startsWith("data:image/") ? { assinaturaBase64: assinatura } : {}),
        });
      }
      Alert.alert("Retirada registrada", tipo === "epi"
        ? "A saída foi registrada com a assinatura do usuário."
        : "A saída foi registrada com sucesso.", [
        { text: "Nova retirada", onPress: () => { limpar(); void carregarDados(); } }
      ]);
    } catch (e: unknown) {
      Alert.alert("Erro ao registrar", mensagemErroApi(e, "A API não aceitou a retirada. Confira estoque, categoria, tipo de saída e os campos exigidos."));
    } finally { setLoading(false); }
  };

  const produtoPorId = (id: number) => produtos.find(p => p.id === id);
  const money = (v: number) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <AppHeader onRefresh={() => void carregarDados()} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={onVoltarInicio} style={{ flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", paddingVertical: 8, marginBottom: 5 }}>
            <Ionicons name="arrow-back" size={19} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: "800" }}>Voltar ao início</Text>
          </Pressable>
          <Text style={styles.pageTitle}>Registrar retirada</Text>
          <Text style={styles.pageHint}>Selecione o tipo, identifique o usuário, adicione os itens e colete a assinatura.</Text>

          <TipoRetiradaSelector value={tipo} onChange={selecionarTipo} />

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeading}><View style={styles.step}><Text style={styles.stepText}>1</Text></View><Text style={styles.sectionTitle}>Quem está retirando?</Text></View>
            <Pressable style={styles.selectBox} onPress={() => setModalPessoa(true)}>
              <Ionicons name="person-circle-outline" size={25} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.selectLabel}>{funcionario ? funcionario.nome : "Selecionar ou cadastrar usuário"}</Text>
                <Text style={styles.selectSub}>{funcionario ? (funcionario.cpf || "Usuário selecionado") : "Pesquise por nome ou CPF"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
            <Pressable style={styles.linkButton} onPress={() => { setNomeNovo(""); setCpfNovo(""); setModalPessoa(true); }}>
              <Ionicons name="person-add-outline" size={17} color={colors.primary} /><Text style={styles.linkText}>Cadastrar novo usuário</Text>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeading}><View style={styles.step}><Text style={styles.stepText}>2</Text></View><Text style={styles.sectionTitle}>Dados da retirada</Text></View>
            <Text style={styles.fieldLabel}>Setor *</Text>
            <Pressable style={styles.selectBox} onPress={() => setModalSelecao("setor")}>
              <Text style={[styles.selectLabel, !setor && styles.placeholder]}>{setor?.nome || "Selecionar setor"}</Text><Ionicons name="chevron-down" size={19} color={colors.muted} />
            </Pressable>
            <Text style={styles.fieldLabel}>Tipo de saída *</Text>
            <Pressable style={styles.selectBox} onPress={() => setModalSelecao("tipo")}>
              <Text style={[styles.selectLabel, !tipoSaida && styles.placeholder]}>{tipoSaida?.nome || "Selecionar tipo de saída"}</Text><Ionicons name="chevron-down" size={19} color={colors.muted} />
            </Pressable>
            <Text style={styles.fieldLabel}>Finalidade *</Text>
            <TextInput value={finalidade} onChangeText={setFinalidade} placeholder="Ex.: reposição de uniforme" style={styles.input} />
            <Text style={styles.fieldLabel}>Observações (opcional)</Text>
            <TextInput value={obs} onChangeText={setObs} placeholder="Informações adicionais" style={[styles.input, styles.multiline]} multiline />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeading}><View style={styles.step}><Text style={styles.stepText}>3</Text></View><Text style={styles.sectionTitle}>Produtos para retirada</Text></View>
            <Text style={styles.sectionDescription}>{tipo === "epi" ? "Somente produtos das categorias EPI e Uniforme." : "Produtos gerais; EPI e Uniforme são selecionados na opção específica."}</Text>
            <Pressable style={styles.addProduct} onPress={() => setModalSelecao("produto")}>
              <Ionicons name="add-circle" size={22} color="#fff" /><Text style={styles.addProductText}>Adicionar produto</Text>
            </Pressable>
            {itens.length === 0 ? <View style={styles.empty}><Ionicons name="cart-outline" size={27} color={colors.muted} /><Text style={styles.emptyText}>Nenhum produto adicionado</Text></View> :
              itens.map((item, index) => {
                const p = produtoPorId(item.produtoId);
                return <View style={styles.itemCard} key={item.produtoId}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{p?.nome || `Produto #${item.produtoId}`}</Text>
                    <Text style={styles.itemMeta}>Disponível: {p?.estoque ?? 0} {p?.siglaUnidadeMedida || ""}</Text>
                    {tipo === "epi" && <Text style={styles.itemMeta}>Categoria: {p?.categoria || "EPI/Uniforme"}</Text>}
                  </View>
                  <View style={styles.quantityArea}>
                    <Text style={styles.quantityLabel}>Qtd.</Text>
                    <TextInput
                      value={item.quantidade} keyboardType="numeric" selectTextOnFocus
                      onChangeText={v => setItens(old => old.map((x, i) => i === index ? { ...x, quantidade: v.replace(/[^0-9]/g, "") } : x))}
                      style={styles.quantityInput}
                    />
                  </View>
                  <Pressable onPress={() => setItens(old => old.filter((_, i) => i !== index))} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={19} color={colors.red} />
                  </Pressable>
                </View>;
              })}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeading}><View style={styles.step}><Text style={styles.stepText}>4</Text></View><Text style={styles.sectionTitle}>Assinatura do usuário {tipo === "epi" ? "*" : "(opcional)"}</Text></View>
            <Text style={styles.sectionDescription}>
              {tipo === "epi"
                ? "Obrigatória para retirada de EPI e uniformes. Peça ao usuário para assinar na tela."
                : "Opcional para saída comum. Você pode concluir sem coletar assinatura."}
            </Text>
            <SignatureCapture value={assinatura} onChange={setAssinatura} />
          </View>

          <Pressable disabled={loading || loadingDados} onPress={() => void salvar()} style={[styles.submit, (loading || loadingDados) && { opacity: 0.65 }]}>
            {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />}
            <Text style={styles.submitText}>{loading ? "Registrando retirada..." : "Confirmar retirada e assinatura"}</Text>
          </Pressable>
          <Pressable onPress={limpar} style={styles.resetButton}><Text style={styles.resetText}>Limpar formulário</Text></Pressable>
          <Text style={styles.footerNote}>Os dados são validados pela API. A confirmação só ocorre após o servidor aceitar o registro.</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalPessoa} animationType="slide" onRequestClose={() => setModalPessoa(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalPessoa(false)}><Ionicons name="close" size={25} color={colors.text} /></Pressable>
            <Text style={styles.modalTitle}>Selecionar usuário</Text>
            <View style={{ width: 25 }} />
          </View>
          <View style={styles.modalBody}>
            <TextInput value={buscaPessoa} onChangeText={setBuscaPessoa} placeholder="Buscar por nome ou CPF" style={styles.input} />
            <Pressable style={styles.primaryButton} onPress={() => { setNomeNovo(buscaPessoa.trim()); setCpfNovo(""); setModalPessoa(false); setTimeout(() => setModalPessoa(true), 100); }}>
              <Ionicons name="person-add-outline" size={19} color="#fff" /><Text style={styles.primaryButtonText}>Cadastrar novo usuário</Text>
            </Pressable>
            <FlatList
              data={pessoaFiltrada} keyExtractor={x => String(x.id)} keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
              renderItem={({ item }) => <Pressable style={styles.listRow} onPress={() => { setFuncionario(item); setModalPessoa(false); }}>
                <View style={styles.avatar}><Ionicons name="person" size={19} color={colors.primary} /></View>
                <View style={{ flex: 1 }}><Text style={styles.listTitle}>{item.nome}</Text><Text style={styles.listSub}>{item.cpf || "CPF não informado"}</Text></View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>}
            />
          </View>
          <Modal visible={!!(modalPessoa && nomeNovo !== "")} transparent animationType="fade" onRequestClose={() => { setNomeNovo(""); setCpfNovo(""); }}>
            <View style={styles.overlay}><View style={styles.dialog}>
              <Text style={styles.dialogTitle}>Cadastrar usuário</Text>
              <Text style={styles.fieldLabel}>Nome completo *</Text>
              <TextInput value={nomeNovo} onChangeText={setNomeNovo} placeholder="Nome do usuário" style={styles.input} />
              <Text style={styles.fieldLabel}>CPF (opcional)</Text>
              <TextInput value={cpfNovo} onChangeText={setCpfNovo} placeholder="000.000.000-00" keyboardType="numeric" style={styles.input} />
              <View style={styles.dialogActions}>
                <Pressable onPress={() => { setNomeNovo(""); setCpfNovo(""); }} style={styles.dialogCancel}><Text style={styles.dialogCancelText}>Cancelar</Text></Pressable>
                <Pressable disabled={criandoPessoa} onPress={() => void criarPessoa()} style={styles.dialogSave}>{criandoPessoa ? <ActivityIndicator color="#fff" /> : <Text style={styles.dialogSaveText}>Cadastrar</Text>}</Pressable>
              </View>
            </View></View>
          </Modal>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!modalSelecao} animationType="slide" onRequestClose={() => setModalSelecao(null)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalSelecao(null)}><Ionicons name="close" size={25} color={colors.text} /></Pressable>
            <Text style={styles.modalTitle}>{modalSelecao === "produto" ? "Selecionar produto" : modalSelecao === "setor" ? "Selecionar setor" : "Tipo de saída"}</Text>
            <View style={{ width: 25 }} />
          </View>
          <View style={styles.modalBody}>
            {modalSelecao === "produto" && <TextInput value={produtoBusca} onChangeText={setProdutoBusca} placeholder="Pesquisar produto" style={styles.input} />}
            <FlatList
              data={modalSelecao === "produto" ? produtosDisponiveis : modalSelecao === "setor" ? setores : tiposSaida}
              keyExtractor={(x: any) => String(x.id)} keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma opção disponível.</Text>}
              renderItem={({ item }: any) => <Pressable style={styles.listRow} onPress={() => {
                if (modalSelecao === "produto") adicionarProduto(item);
                else if (modalSelecao === "setor") { setSetor(item); setModalSelecao(null); }
                else { setTipoSaida(item); setModalSelecao(null); }
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>{item.nome}</Text>
                  {modalSelecao === "produto" && <Text style={styles.listSub}>{item.categoria} • Estoque: {item.estoque} {item.siglaUnidadeMedida || ""}</Text>}
                </View><Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {loadingDados && <View style={styles.loadingPill}><ActivityIndicator color="#fff" size="small" /><Text style={styles.loadingText}>Carregando dados...</Text></View>}
    </SafeAreaView>
  );
}
