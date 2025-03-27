

// Página NaoAutorizado.js
import React from "react";

export default function NaoAutorizado() {
    return (
        <div className="container mt-5">
            <h2 className="text-center text-danger">Acesso Não Autorizado</h2>
            <p className="text-center">
                Você não tem permissão para acessar esta página.
            </p>
        </div>
    );
}

