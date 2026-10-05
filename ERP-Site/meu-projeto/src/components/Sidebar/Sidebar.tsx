import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  FileText,
  Settings,
  UserRound,
  Tags,
  Ruler,
  Truck,
  User,
  ChevronDown,
  PackageCheck,
  LogIn,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [estoqueOpen, setEstoqueOpen] = useState(false);
  const [comprasOpen, setComprasOpen] = useState(false);
  const [vendasOpen, setVendasOpen] = useState(false);
  const [financeiroOpen, setFinanceiroOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  return (
    <aside className="sidebar">
      {/* LOGO */}

      <div className="sidebar-logo">
        <div className="logo-icon">
          <BarChart3 size={30} />
        </div>

        <div>
          <h1>ERP</h1>

          <span>Gestão que impulsiona seu negócio</span>
        </div>
      </div>

      {/* MENU */}

      <nav className="sidebar-menu">
        {/* DASHBOARD */}

        <NavLink
          to="/"
          className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={21} />

          <span>Dashboard</span>
        </NavLink>

        {/* =================================================
            CADASTROS
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setCadastrosOpen(!cadastrosOpen)}
          >
            <Users size={21} />

            <span>Cadastros</span>

            <ChevronDown
              size={16}
              className={cadastrosOpen ? "arrow-open" : ""}
            />
          </button>

          {cadastrosOpen && (
            <div className="submenu">
              <NavLink to="/produtos">
                <Package size={17} />
                Produtos
              </NavLink>
              <NavLink to="/categorias">
                <Tags size={17} />
                Categorias
              </NavLink>
              <NavLink to="/unidades-medida">
                <Ruler size={17} />
                Unidades de Medida
              </NavLink>
              <NavLink to="/fornecedores">
                <Truck size={17} />
                Fornecedores
              </NavLink>
 
              <NavLink to="/notas-fiscais">
                <FileText size={17} />
                Nf
              </NavLink>

              <NavLink to="/produtos-notas-fiscais">
                <PackageCheck size={17} />
                Produtos-NF
              </NavLink>

              <NavLink to="/tipo-entrada">
                <LogIn size={17} />
                Tipo de Entrada
              </NavLink>
              <NavLink to="/funcionarios">
                <UserRound size={17} />
                Funcionários
              </NavLink>
              <NavLink to="/setores">
                <Users size={17} />
                Setores
              </NavLink>
              <NavLink to="/tipo-saida">
                <LogIn size={17} />
                Tipo de Saída
              </NavLink>
              <NavLink to="/clientes">
                <User size={17} />
                Clientes
              </NavLink>
            </div>
          )}
        </div>

        {/* =================================================
            ESTOQUE
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setEstoqueOpen(!estoqueOpen)}
          >
            <Package size={21} />

            <span>Estoque</span>

            <ChevronDown
              size={16}
              className={estoqueOpen ? "arrow-open" : ""}
            />
          </button>

          {estoqueOpen && (
            <div className="submenu">
              <NavLink to="/estoque">
                <Package size={17} />
                Estoque Atual
              </NavLink>

              <NavLink to="/entradas">Entradas</NavLink>

              <NavLink to="/estoque/saidas">Saídas</NavLink>

              <NavLink to="/estoque/transferencias">Transferências</NavLink>

              <NavLink to="/estoque/movimentacoes">Movimentações</NavLink>
            </div>
          )}
        </div>

        {/* =================================================
            COMPRAS
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setComprasOpen(!comprasOpen)}
          >
            <ShoppingCart size={21} />

            <span>Compras</span>

            <ChevronDown
              size={16}
              className={comprasOpen ? "arrow-open" : ""}
            />
          </button>

          {comprasOpen && (
            <div className="submenu">
              <NavLink to="/compras">Pedidos de Compra</NavLink>

              <NavLink to="/compras/cotacoes">Cotações</NavLink>

              <NavLink to="/compras/recebimentos">Recebimentos</NavLink>
            </div>
          )}
        </div>

        {/* =================================================
            VENDAS
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setVendasOpen(!vendasOpen)}
          >
            <BarChart3 size={21} />

            <span>Vendas</span>

            <ChevronDown size={16} className={vendasOpen ? "arrow-open" : ""} />
          </button>

          {vendasOpen && (
            <div className="submenu">
              <NavLink to="/vendas">Pedidos de Venda</NavLink>

              <NavLink to="/vendas/faturamento">Faturamento</NavLink>
            </div>
          )}
        </div>

        {/* =================================================
            FINANCEIRO
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setFinanceiroOpen(!financeiroOpen)}
          >
            <DollarSign size={21} />

            <span>Financeiro</span>

            <ChevronDown
              size={16}
              className={financeiroOpen ? "arrow-open" : ""}
            />
          </button>

          {financeiroOpen && (
            <div className="submenu">
              <NavLink to="/financeiro">Visão Geral</NavLink>

              <NavLink to="/financeiro/contas-pagar">Contas a Pagar</NavLink>

              <NavLink to="/financeiro/contas-receber">
                Contas a Receber
              </NavLink>

              <NavLink to="/financeiro/fluxo-caixa">Fluxo de Caixa</NavLink>
            </div>
          )}
        </div>

        {/* =================================================
            RELATÓRIOS
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setRelatoriosOpen(!relatoriosOpen)}
          >
            <FileText size={21} />

            <span>Relatórios</span>

            <ChevronDown
              size={16}
              className={relatoriosOpen ? "arrow-open" : ""}
            />
          </button>

          {relatoriosOpen && (
            <div className="submenu">
              <NavLink to="/relatorios/estoque">Estoque</NavLink>

              <NavLink to="/relatorios/compras">Compras</NavLink>

              <NavLink to="/relatorios/vendas">Vendas</NavLink>

              <NavLink to="/relatorios/financeiro">Financeiro</NavLink>
            </div>
          )}
        </div>

        {/* USUÁRIOS */}

        <NavLink to="/usuarios" className="menu-link">
          <UserRound size={21} />

          <span>Usuários</span>
        </NavLink>

        {/* =================================================
            CONFIGURAÇÕES
           ================================================= */}

        <div className="menu-section">
          <button
            className="menu-title"
            onClick={() => setConfiguracoesOpen(!configuracoesOpen)}
          >
            <Settings size={21} />

            <span>Configurações</span>

            <ChevronDown
              size={16}
              className={configuracoesOpen ? "arrow-open" : ""}
            />
          </button>

          {configuracoesOpen && (
            <div className="submenu">
              <NavLink to="/configuracoes">Geral</NavLink>

              <NavLink to="/configuracoes/perfil">Perfil</NavLink>

              <NavLink to="/configuracoes/permissoes">Permissões</NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* FOOTER */}

      <div className="sidebar-footer">
        <strong>Seu negócio</strong>

        <span>mais eficiente todos os dias.</span>

        <div className="footer-line"></div>
      </div>
    </aside>
  );
}
