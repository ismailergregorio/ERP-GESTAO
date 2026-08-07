import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Nav-css.css";

import {
    House,
    Boxes,
    ShoppingCart,
    Users,
    ClipboardList,
    FileText,
    Settings,
    ChevronDown,
    ChevronRight
} from "lucide-react";

interface Props {
    open: boolean;
}

const menus = [
    {
        title: "Dashboard",
        path: "/",
        icon: <House size={20} />,
    },
    {
        title: "Estoque",
        icon: <Boxes size={20} />,
        children: [
            { titulo: "Entradas", path: "/estoque/entrada" },
            { titulo: "Saídas", path: "/estoque/saida" },
            { titulo: "Inventário", path: "/estoque/inventario" },
        ],
    },
    {
        title: "Compras",
        path: "/compras",
        icon: <ShoppingCart size={20} />,
    },
    {
        title: "Cadastros",
        path: "/cadastros",
        icon: <ClipboardList size={20} />,
    },
    {
        title: "Funcionários",
        path: "/funcionarios",
        icon: <Users size={20} />,
    },
    {
        title: "Relatórios",
        path: "/relatorios",
        icon: <FileText size={20} />,
    },
    {
        title: "Configurações",
        path: "/configuracoes",
        icon: <Settings size={20} />,
    },
];

export default function Nav({ open }: Props) {

    const [menuAberto, setMenuAberto] = useState<string | null>(null);

    return (

        <nav className={open ? "nav" : "nav collapsed"}>

            <ul className="nav-list">

                {menus.map((menu) => (

                    <li key={menu.title}>

                        {menu.children ? (

                            <>
                                <button
                                    className="nav-link nav-button"
                                    onClick={() =>
                                        setMenuAberto(
                                            menuAberto === menu.title
                                                ? null
                                                : menu.title
                                        )
                                    }
                                >

                                    <div className="nav-start">
                                        {menu.icon}
                                        {open && <span>{menu.title}</span>}
                                    </div>

                                    {open &&
                                        (menuAberto === menu.title
                                            ? <ChevronDown size={18}/>
                                            : <ChevronRight size={18}/>)}

                                </button>

                                {menuAberto === menu.title && open && (

                                    <ul className="submenu">

                                        {menu.children.map((item) => (

                                            <li key={item.path}>

                                                <NavLink
                                                    to={item.path}
                                                    className="submenu-link"
                                                >
                                                    {item.titulo}
                                                </NavLink>

                                            </li>

                                        ))}

                                    </ul>

                                )}

                            </>

                        ) : (

                            <NavLink
                                to={menu.path!}
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >

                                {menu.icon}

                                {open && (
                                    <span>{menu.title}</span>
                                )}

                            </NavLink>

                        )}

                    </li>

                ))}

            </ul>

        </nav>

    );

}