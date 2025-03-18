import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container text-center">
      <h1>401 - Acesso não autorizado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}
