

import React from 'react';


export default function Header(){

    return (
        <header className="d-flex justify-content-center py-3">
              <ul className="nav nav-pills">
                <li className="nav-item"><a href="#" className="nav-link active" aria-current="page">Home</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Abrir chamado</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Listar Chamados</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Outros</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Reclamação</a></li>
              </ul>
            </header>



    )


}