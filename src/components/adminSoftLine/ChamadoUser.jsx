
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate


export default function ChamadoUser() {

    const navigate = useNavigate(); // Hook para redirecionamento
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
    nome: "",
    email: "",
    login: "",
    ativo: false,
    password: "",
    empresa: "",
    cnpj: "",

  });

  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");



 // Verifica se o usuário está autenticado ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem("token"); // Recupera o token do localStorage
        if (!token) {
            navigate("/nao-autorizado"); // Redireciona para a página de não autorizado
        }
    }, [navigate]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
       setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://chamados-softline-k3bsb.ondigitalocean.app/usuario/salvar", formData);

      setMessage("Usuário cadastrado com sucesso!");
      setAlertType("success");
      setFormData({
        nome: "",
        email: "",
        login: "",
        ativo: false,
        password: "",
        empresa: "",
        cnpj: "",

      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Erro: Usuário já existe ou dados inválidos!");
        setAlertType("danger");
      } else {
        setMessage("Erro: Não foi possível cadastrar o usuário.");
        setAlertType("danger");
      }
    } finally {
                setIsLoading(false); // Desativa o estado de loading independente do resultado

     }
  };

  return (
    <div className="container mt-5">

        <AdminHeaders />

      <h2 className="mb-4 text-center alert alert-success" role="alert">
        Cadastro de Usuário
      </h2>

      {message && (
        <div className={`alert alert-${alertType}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="row">
          {/* Nome */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              className="form-control border border-warning"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control border border-primary"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          {/* Login */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="login">Login:</label>
            <input
              type="text"
              className="form-control border border-info"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>

          {/* Senha */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              className="form-control form-control border border-info"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          {/* Empresa */}
          <div className="form-group col-md-6 mb-3">
            <label htmlFor="empresa">Empresa:</label>
            <input
              type="text"
              className="form-control form-control border border-info"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
            />
          </div>


           {/* CNPJ */}
           <div className="form-group col-md-6 mb-3">
              <label htmlFor="cnpj">cnpj:</label>
              <input
               type="text"
                className="form-control form-control border border-info"
                id="cnpj"
                 name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
               />
            </div>


          {/* Ativo */}
          <div className="form-check col-md-6 d-flex align-items-center mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="ativo"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2" htmlFor="ativo">
              Ativo
            </label>
          </div>
        </div>

        <div className="row mt-4">
           <div className="col text-center">
             <button
                          type="submit"
                          className="btn btn-primary rounded-pill"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              <span className="ms-2">Enviando...</span>
                            </>
                          ) : (
                            "Registrar"
                          )}
             </button>
           </div>
         </div>
      </form>
    </div>
  );
}
