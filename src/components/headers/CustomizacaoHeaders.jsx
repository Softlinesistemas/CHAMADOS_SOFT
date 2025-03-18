
import React from 'react';
import { useNavigate } from "react-router-dom";

export default function CustomizacaoHeaders(){


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
                <li className="nav-item"><a href="/components/customizacao/ListagemCustomizacao" className="nav-link active" aria-current="page">Home</a></li>
                <li className="nav-item"><a href="/components/customizacao/ListagemCustomizacao" className="nav-link">Listar Chamados</a></li>

              </ul>

    {/* Botão de logout */}
     <button
           onClick={handleLogout}
           className="btn btn-danger"
           style={{
             marginLeft: '20px',
             padding: '10px 20px',
             borderRadius: '5px',
           }}
         >
           Sair
    </button>

         </header>



    )


}




