import type { ReactNode } from "react";
import "./HeaderTabela-css.css";
import { Plus } from "lucide-react";
interface HeaderTableaType {
  title?: string;
  children?: ReactNode;
  onClick?: () => void;
}
export default function HeaderTabela({ title, children,onClick}: HeaderTableaType) {
  return (
    <div className="conteiner-header">
      <div className="header-tabela">
        <h2>{title}</h2>
        <button onClick={onClick} className="butto-header-table">
          <Plus />
          Adicionar
        </button>
      </div>
      <div className="chil-table">
       {children}
       </div>
    </div>
  );
}
