import React from "react";
import { useNavigate } from "react-router-dom";
//import Notifications from "../../Notifications";


 // Importamos o componente

 {/*import ChamadoNotification from "../adminSoftLine/ChamadoNotification"; */}

export default function AdminHeaders() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="d-flex justify-content-center align-items-center py-3">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <a href="/components/adminSoftLine/AdminSoftLineListagem" className="nav-link active" aria-current="page">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a href="/AdminSoftlineForm" className="nav-link">Abrir chamado</a>
        </li>
        <li className="nav-item">
          <a href="/components/adminSoftLine/AdminSoftLineListagem" className="nav-link">Listar Chamados</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Usuários
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/ListarUsuarios">Listar Usuários</a></li>
            <li><a className="dropdown-item" href="/ChamadoUser">Cadastrar usuário</a></li>

          </ul>
        </li>
        <li className="nav-item">
          <a href="/ListagemCustomizacao" className="nav-link disabled">Customização</a>
        </li>
        <li className="nav-item">
          <a href="/ListagemImplantacao" className="nav-link disabled">Implantação</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dashboards
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="/RelatorioStatusChamados">Relatório dos Status dos chamados</a></li>
            <li><a className="dropdown-item" href="/ChamadosSetorAberto">Relatório dos setores em análise/em aberto</a></li>
            <li><a className="dropdown-item" href="/AvaliacaoCliente">Relatório da avaliação dos chamados pelos clientes</a></li>
<li>
  <a
    className="dropdown-item"
    href="/components/user/UserSoftlineListagem"
    onClick={(e) => e.preventDefault()} // Desabilita o link
    style={{ pointerEvents: 'none', opacity: 0.5 }} // Estilo para parecer desabilitado
  >
    SUPORTE
  </a>
</li>            <li><a className="dropdown-item" href="/NovosClientes">Novos Clientes</a></li>
          </ul>
        </li>
      </ul>

      {/* Ícone antes do botão Sair */}
      <div className="d-flex align-items-center" style={{ marginLeft: "20px" }}>

       {/* Adicionamos o ícone de notificação   <Notifications />*/}


        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
