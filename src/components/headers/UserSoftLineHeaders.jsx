
import React from 'react';
import { useNavigate } from "react-router-dom";
import "../css/UserSoftLineHeaders.css";

export default function UserSoftLineHeaders(){

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
                <li className="nav-item"><a href="/components/userSoftline/UserSoftlineListagem" className="nav-link active" aria-current="page">Home</a></li>
                <li className="nav-item"><a href="/UserSoftLineForm" className="nav-link">Abrir chamado</a></li>
                <li className="nav-item"><a href="/components/userSoftline/UserSoftlineListagem" className="nav-link">Listar Chamados</a></li>

              </ul>

{/* Botão de logout */}
<div className="d-flex align-items-center">
  <button onClick={handleLogout} className="btn-sair">
    Sair
  </button>
</div>

            </header>

    )


}


