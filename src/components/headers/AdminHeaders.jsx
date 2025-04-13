import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminHeaders.css"; // Importe o CSS

export default function AdminHeaders() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="admin-header">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <a href="/components/adminSoftLine/AdminSoftLineListagem"
             className="nav-link active"
             aria-current="page">
            Home
          </a>
        </li>

        <li className="nav-item">
          <a href="/AdminSoftlineForm"
             className="nav-link btn btn-abrir-chamado">
            Abrir chamado
          </a>
        </li>

        <li className="nav-item">
          <a href="/components/adminSoftLine/AdminSoftLineListagem"
             className="nav-link btn btn-listar-chamados">
            Listar Chamados
          </a>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link btn btn-usuarios dropdown-toggle"
             href="#"
             role="button"
             data-bs-toggle="dropdown"
             aria-expanded="false">
            Usuários
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li><a className="dropdown-item dropdown-item-dark" href="/ListarUsuarios">Listar Usuários</a></li>
            <li><a className="dropdown-item dropdown-item-dark" href="/ChamadoUser">Cadastrar usuário</a></li>
          </ul>
        </li>

        <li className="nav-item">
          <a href="/ListagemCustomizacao" className="nav-link disabled">Customização</a>
        </li>

        <li className="nav-item">
          <a href="/ListagemImplantacao" className="nav-link disabled">Implantação</a>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link btn btn-dashboards dropdown-toggle"
             href="#"
             role="button"
             data-bs-toggle="dropdown"
             aria-expanded="false">
            Dashboards
          </a>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li><a className="dropdown-item dropdown-item-dark" href="/RelatorioStatusChamados">Relatório dos Status dos chamados</a></li>
            <li><a className="dropdown-item dropdown-item-dark" href="/ChamadosSetorAberto">Relatório dos setores em análise/em aberto</a></li>
            <li><a className="dropdown-item dropdown-item-dark" href="/AvaliacaoCliente">Relatório da avaliação dos chamados pelos clientes</a></li>
            <li>
              <a className="dropdown-item dropdown-item-dark disabled"
                 href="/components/user/UserSoftlineListagem"
                 onClick={(e) => e.preventDefault()}>
                SUPORTE
              </a>
            </li>
            <li><a className="dropdown-item dropdown-item-dark" href="/NovosClientes">Novos Clientes</a></li>
          </ul>
        </li>
      </ul>

      <div className="d-flex align-items-center">
        <button onClick={handleLogout} className="btn-sair">
          Sair
        </button>
      </div>
    </header>
  );
}
