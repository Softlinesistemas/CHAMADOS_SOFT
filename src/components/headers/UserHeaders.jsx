import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserHeaders.css";

export default function UserHeaders() {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');

    // Redireciona para a página de login
    navigate('/');
  };

  return (
    <header className="d-flex justify-content-center py-3">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <a href="/UsuarioListagem" className="nav-link active" aria-current="page">Home-USUARIO-COMUM</a>
        </li>
        <li className="nav-item">
          <a href="/UserForm" className="nav-link">Abrir chamado</a>
        </li>
        <li className="nav-item">
          <a href="/components/user/UsuarioListagem" className="nav-link">Listar Chamados</a>
        </li>


      </ul>
      
      {/* Botão de logout */}
<div className="d-flex align-items-center">
  <button onClick={handleLogout} className="btn-sair">
    Sair
  </button>
</div>
      
    </header>
  );
}
