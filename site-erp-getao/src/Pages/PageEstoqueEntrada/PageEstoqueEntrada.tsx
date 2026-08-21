import Layout from "../../Layout/LayoutPages";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

import HeaderTabela from "../../Componete/HeaderTabela/HeaderTabela";
import Table from "../../Componete/Table/Table";
import Modal from "../../Componete/Modal/Modal";

import type { Column } from "../../Componete/Table/Table.types";

import api from "../../Services/Api";
import covertData from "../../Utils/ConverteDate";

import "./PegeEstoqueEntrada-css.css";
import "./ModelInportNF-css.css";

interface Entrada {
  id: number;
  notaFiscal: number;
  fornecedor_id: number;
  tipoEntrada_id: number;
  observacao: string;
  dataCriacao: string;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface TipoEntrada {
  id: number;
  nome: string;
}

export interface FornecedorNf {
  cnpj: string;
  crt: string;
  inscricaoEstadual: string;
  nomeFantasia: string;
  razaoSocial: string;
}

export interface ProdutoNfe {
  id: number;
  cest: string;
  cfop: string;
  codigo: string;
  codigoEAN: string;
  descricao: string;
  ncm: string;

  quantidade: number;
  quantidadeTributaria: number;

  unidadeComercial: string;
  unidadeTributaria: string;

  valorTotal: number;
  valorUnitario: number;
  valorUnitarioTributario: number;
}

export interface Nf {
  notaFiscal: number;
  chaveAcesso: string;
  dataEmissao: string;
  valorTotal: number;

  fornecedor: FornecedorNf;
  produto: ProdutoNfe[];
}

export default function EntradaEstoque() {
  const base = "entradas";

  const baseFornecedores = "fornecedores";
  const baseTiposEntrada = "tipos-entrada";

  /*
  =====================================================
  MODAIS
  =====================================================
  */

  const [modalManualOpen, setModalManualOpen] = useState(false);
  const [modalNfOpen, setModalNfOpen] = useState(false);

  /*
  =====================================================
  DADOS
  =====================================================
  */

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);

  /*
  =====================================================
  FORMULÁRIO MANUAL
  =====================================================
  */

  const [notafiscal, setNotaFiscal] = useState<number | undefined>();
  const [fornecedor_id, setFornecedor_id] = useState<number | undefined>();
  const [tipoEntrada_id, setTipoEntrada_id] = useState<number | undefined>();
  const [observacao, setObservacao] = useState("");

  /*
  =====================================================
  XML
  =====================================================
  */

  const [arquivoXml, setArquivoXml] = useState<File | null>(null);
  const [carregandoXml, setCarregandoXml] = useState(false);
  const [contadorImport, setContadorImport] = useState<number>(1);

  /*
  =====================================================
  ENTRADA REGISTRADA
  =====================================================
  */

  const [entradaRegistrada, setEntradaRegistrada] = useState<Entrada | null>(
    null,
  );

  /*
  =====================================================
  ETAPA DA ENTRADA MANUAL
  =====================================================
  */

  const [etapa, setEtapa] = useState(1);

  /*
  =====================================================
  BUSCAR ENTRADAS
  =====================================================
  */

  async function getEntradas() {
    try {
      const resposta = await api.get(`/${base}`);

      setEntradas(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar entradas.");
    }
  }

  /*
  =====================================================
  BUSCAR FORNECEDORES
  =====================================================
  */

  async function getFornecedores() {
    try {
      const resposta = await api.get(`/${baseFornecedores}`);

      setFornecedores(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao buscar fornecedores.");
    }
  }

  /*
  =====================================================
  BUSCAR TIPOS DE ENTRADA
  =====================================================
  */

  async function getTiposEntrada() {
    try {
      const resposta = await api.get(`/${baseTiposEntrada}`);

      setTiposEntrada(resposta.data);
    } catch (e: any) {
      console.error(e);

      toast.error(
        e.response?.data?.message ?? "Erro ao buscar tipos de entrada.",
      );
    }
  }

  /*
  =====================================================
  ABRIR MODAL MANUAL
  =====================================================
  */

  function abrirModalManual() {
    // Garante que o modal da NF esteja fechado
    setModalNfOpen(false);

    // Limpa os dados da entrada anterior
    setEntradaRegistrada(null);

    setEtapa(1);

    setNotaFiscal(undefined);
    setFornecedor_id(undefined);
    setTipoEntrada_id(undefined);
    setObservacao("");

    // Abre modal manual
    setModalManualOpen(true);
  }

  /*
  =====================================================
  FECHAR MODAL MANUAL
  =====================================================
  */

  function fecharModalManual() {
    setModalManualOpen(false);

    setEntradaRegistrada(null);

    setEtapa(1);

    setNotaFiscal(undefined);
    setFornecedor_id(undefined);
    setTipoEntrada_id(undefined);
    setObservacao("");
  }

  /*
  =====================================================
  ABRIR MODAL NF
  =====================================================
  */

  function abrirModalNf() {
    // Garante que o modal manual esteja fechado
    setModalManualOpen(false);

    setArquivoXml(null);

    // Abre modal da NF
    setModalNfOpen(true);
  }

  /*
  =====================================================
  FECHAR MODAL NF
  =====================================================
  */

  function fecharModalNf() {
    if (carregandoXml) {
      return;
    }
    setContadorImport(1);
    setModalNfOpen(false);
    setArquivoXml(null);
  }

  /*
  =====================================================
  CRIAR ENTRADA MANUAL
  =====================================================
  */

  async function PostEntrada() {
    if (!notafiscal) {
      toast.warning("Informe o número da nota fiscal.");
      return;
    }

    if (!fornecedor_id) {
      toast.warning("Selecione o fornecedor.");
      return;
    }

    if (!tipoEntrada_id) {
      toast.warning("Selecione o tipo de entrada.");
      return;
    }

    try {
      const resposta = await api.post(`/${base}`, {
        notaFiscal: notafiscal,
        fornecedor_id: fornecedor_id,
        tipoEntrada_id: tipoEntrada_id,
        observacao: observacao,
      });

      setEntradaRegistrada(resposta.data);

      /*
       * A entrada foi criada.
       * Agora passa para a etapa de produtos.
       */
      setEtapa(2);

      toast.success("Entrada criada com sucesso.");

      await getEntradas();
    } catch (e: any) {
      console.error(e);

      toast.error(e.response?.data?.message ?? "Erro ao criar entrada.");
    }
  }

  /*
  =====================================================
  SELECIONAR XML
  =====================================================
  */

  function selecionarXml(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const ehXml =
      arquivo.type === "text/xml" ||
      arquivo.name.toLowerCase().endsWith(".xml");

    if (!ehXml) {
      toast.error("Selecione um arquivo XML.");

      event.target.value = "";

      return;
    }

    setArquivoXml(arquivo);
  }

  /*
  =====================================================
  IMPORTAR XML
  =====================================================
  */
  const [nfe, setNfe] = useState<Nf | null>();
  async function importarXml() {
    if (!arquivoXml) {
      toast.warning("Selecione um arquivo XML.");
      return;
    }

    try {
      setCarregandoXml(true);

      const formData = new FormData();

      formData.append("arquivo", arquivoXml);

      const resposta = await api.post("/nfe/importar", formData);

      console.log("Resposta da NF-e:", resposta.data);

      const produtos = resposta.data.produto.map(
        (produto: any, index: number) => ({
          ...produto,
          id: index + 1,
        }),
      );

      setNfe({
        ...resposta.data,
        produto: produtos,
      });

      toast.success("NF-e importada com sucesso.");

      setArquivoXml(null);

      setContadorImport(2);
    } catch (e: any) {
      console.error("Erro ao importar XML:", e);

      toast.error(
        e.response?.data?.message ??
          e.response?.data ??
          "Erro ao importar NF-e.",
      );
    } finally {
      setCarregandoXml(false);
    }
  }

  /*
  =====================================================
  COLUNAS
  =====================================================
  */

  const colunas: Column<Entrada>[] = [
    {
      key: "id",
      title: "Id",
      width: "70px",
      align: "center",
    },

    {
      key: "notaFiscal",
      title: "Nota Fiscal",
    },

    {
      key: "fornecedor_id",
      title: "Fornecedor",

      render: (value) => {
        const fornecedor = fornecedores.find((item) => item.id === value);

        return fornecedor?.nome ?? "-";
      },
    },

    {
      key: "tipoEntrada_id",
      title: "Tipo",

      render: (value) => {
        const tipo = tiposEntrada.find((item) => item.id === value);

        return tipo?.nome ?? "-";
      },
    },

    {
      key: "observacao",
      title: "Observação",
    },

    {
      key: "dataCriacao",
      title: "Data Criação",

      render: (value) => {
        return value ? covertData(value) : "-";
      },
    },
  ];

  const colunasNf: Column<ProdutoNfe>[] = [
    {
      key: "id",
      title: "Id",
      align: "center",
    },
    {
      key: "codigo",
      title: "Código",
      align: "center",
    },

    {
      key: "descricao",
      title: "Produto",
    },

    {
      key: "quantidade",
      title: "Qtd.",
      align: "center",
    },

    {
      key: "unidadeComercial",
      title: "Un.",
      align: "center",
    },

    {
      key: "valorUnitario",
      title: "V. Unitário",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },

    {
      key: "valorTotal",
      title: "V. Total",
      align: "right",

      render: (value) => {
        return Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
  ];

  /*
  =====================================================
  EFFECT
  =====================================================
  */

  useEffect(() => {
    getEntradas();
    getFornecedores();
    getTiposEntrada();
  }, []);

  /*
  =====================================================
  RETURN
  =====================================================
  */

  return (
    <Layout title="Entrada de Estoque">
      <section>
        {/* =================================================
            TABELA PRINCIPAL
        ================================================= */}

        <HeaderTabela
          title="Entradas"
          onClick={abrirModalManual}
          butonsPlus={
            <button
              type="button"
              className="butto-header-table"
              onClick={abrirModalNf}
            >
              <Upload size={18} />
              Importar NF
            </button>
          }
        >
          <Table columns={colunas} data={entradas} />
        </HeaderTabela>

        {/* =================================================
            MODAL ENTRADA MANUAL
        ================================================= */}

        <Modal
          open={modalManualOpen}
          title="Nova Entrada"
          onClose={fecharModalManual}
        >
          {/* ETAPAS */}

          <div className="passo">
            <div className={etapa >= 1 ? "p n1 ativo" : "p n1"}>
              <h2 className={etapa >= 1 ? "nume ativo" : "nume"}>1</h2>

              <h2>Criar Entrada</h2>
            </div>

            <hr className={etapa >= 2 ? "ativo" : ""} />

            <div className={etapa >= 2 ? "p n2 ativo" : "p n2"}>
              <h2 className={etapa >= 2 ? "nume ativo" : "nume"}>2</h2>

              <h2>Adicionar Produtos</h2>
            </div>
          </div>

          {/* =================================================
              ETAPA 1
          ================================================= */}

          {etapa === 1 && (
            <div className="form-group">
              <div>
                <label htmlFor="nf">N° NF</label>

                <input
                  id="nf"
                  type="number"
                  placeholder="Digite o número da NF"
                  value={notafiscal ?? ""}
                  onChange={(e) =>
                    setNotaFiscal(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </div>

              <div>
                <label htmlFor="fornecedor">Fornecedor</label>

                <select
                  id="fornecedor"
                  value={fornecedor_id ?? ""}
                  onChange={(e) =>
                    setFornecedor_id(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                >
                  <option value="">Selecione um fornecedor</option>

                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tipo-entrada">Tipo de Entrada</label>

                <select
                  id="tipo-entrada"
                  value={tipoEntrada_id ?? ""}
                  onChange={(e) =>
                    setTipoEntrada_id(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                >
                  <option value="">Selecione um tipo de entrada</option>

                  {tiposEntrada.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="obs">Observações</label>

                <input
                  id="obs"
                  type="text"
                  placeholder="Digite a observação"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* =================================================
              ETAPA 2
          ================================================= */}

          {etapa === 2 && (
            <div>
              <h3>Adicionar Produtos</h3>

              {entradaRegistrada && (
                <p>
                  Entrada Nº <strong>{entradaRegistrada.id}</strong> criada com
                  sucesso.
                </p>
              )}

              {/*
                Aqui permanece o seu componente
                de inserção dos produtos.
              */}
            </div>
          )}

          {/* =================================================
              BOTÕES
          ================================================= */}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={fecharModalManual}
            >
              Cancelar
            </button>

            {etapa === 1 && (
              <button
                type="button"
                className="btn-primary"
                onClick={PostEntrada}
              >
                Criar Entrada
              </button>
            )}
          </div>
        </Modal>

        {/* =================================================
            MODAL IMPORTAR NF
        ================================================= */}

        <Modal
          open={modalNfOpen}
          title="Importar Nota Fiscal"
          onClose={fecharModalNf}
          tamanho="max"
        >
          {contadorImport == 1 && (
            <div className="form-modal">
              <div className="form-group">
                <div>
                  <label htmlFor="xml">Arquivo XML da NF-e</label>

                  <input
                    id="xml"
                    type="file"
                    accept=".xml,text/xml"
                    onChange={selecionarXml}
                    disabled={carregandoXml}
                  />
                </div>

                {arquivoXml && (
                  <div className="xml-preview">
                    <Upload size={20} />

                    <div>
                      <strong>Arquivo selecionado</strong>

                      <span>{arquivoXml.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={fecharModalNf}
                  disabled={carregandoXml}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={importarXml}
                  disabled={!arquivoXml || carregandoXml}
                >
                  {carregandoXml ? "Enviando..." : "Importar XML"}
                </button>
              </div>
            </div>
          )}
          {contadorImport === 2 && nfe && (
            <div className="nf-confirmacao">
              {/* =========================================
        FORNECEDOR
    ========================================= */}

              <div className="nf-info">
                <div className="nf-section-title">
                  <h3>Fornecedor</h3>
                </div>

                <div className="nf-info-grid">
                  <div className="nf-info-item">
                    <span>Razão Social</span>
                    <strong>{nfe.fornecedor?.razaoSocial ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>Nome Fantasia</span>
                    <strong>{nfe.fornecedor?.nomeFantasia ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>CNPJ</span>
                    <strong>{nfe.fornecedor?.cnpj ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>Inscrição Estadual</span>
                    <strong>{nfe.fornecedor?.inscricaoEstadual ?? "-"}</strong>
                  </div>

                  <div className="nf-info-item">
                    <span>CRT</span>
                    <strong>{nfe.fornecedor?.crt ?? "-"}</strong>
                  </div>
                </div>
              </div>

              {/* =========================================
        PRODUTOS
    ========================================= */}

              <div className="nf-produtos">
                <div className="nf-section-title">
                  <h3>Produtos da Nota</h3>

                  <span>{nfe.produto?.length ?? 0} produto(s)</span>
                </div>

                <Table<ProdutoNfe>
                  columns={colunasNf}
                  data={nfe.produto ?? []}
                />
              </div>

              {/* =========================================
        TOTAL
    ========================================= */}

              <div className="nf-total">
                <span>Total dos Produtos</span>

                <strong>
                  {nfe.produto
                    ?.reduce(
                      (total, produto) =>
                        total + Number(produto.valorTotal ?? 0),
                      0,
                    )
                    .toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                </strong>
              </div>

              {/* =========================================
        AÇÕES
    ========================================= */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setNfe(null);
                    setArquivoXml(null);
                    setContadorImport(1);
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setContadorImport(3);
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </section>
    </Layout>
  );
}
