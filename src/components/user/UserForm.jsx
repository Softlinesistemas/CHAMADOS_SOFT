import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate


function UserForm() {
        const navigate = useNavigate(); // Hook para redirecionamento

  const [statusChamados, setStatusChamados] = useState([]);
  const [assuntos, setAssuntos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [formData, setFormData] = useState({
    arquivo: null,
    statuschamados: "",
    assuntos: "",
    colaboradores: "",
    justificativa: "",
    reclamacao: "", // Adicionando o campo de reclamação
  });

{/*
  useEffect(() => {
    // Obtém o token do localStorage
    const token = localStorage.getItem("token");

    // Carrega os dados do usuário logado
    axios
      .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { nome, email, empresa, cnpj } = response.data;
        setFormData((prevData) => ({
          ...prevData,
          nome,
          email,
          empresa,
          cnpj,
        }));
      })
      .catch((error) => console.error("Erro ao obter usuário:", error));

    // Carregar listas (statusChamados, assuntos, colaboradores)
    axios
      .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userStatusChamados")
      .then((response) => setStatusChamados(response.data))
      .catch((error) => console.error("Erro ao carregar status chamados:", error));

    axios
      .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListAssuntos")
      .then((response) => setAssuntos(response.data))
      .catch((error) => console.error("Erro ao carregar assuntos:", error));

    axios
      .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListColaboradores")
      .then((response) => setColaboradores(response.data))
      .catch((error) => console.error("Erro ao carregar colaboradores:", error));
  }, []);
*/}

// Verifica se o usuário está autenticado ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem("token"); // Recupera o token do localStorage
        if (!token) {
            navigate("/nao-autorizado"); // Redireciona para a página de não autorizado
        } else {
            // Carrega os dados do usuário logado
            axios
                .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const { nome, email, empresa, cnpj } = response.data;
                    setFormData((prevData) => ({
                        ...prevData,
                        nome,
                        email,
                        empresa,
                        cnpj,
                    }));
                })
                .catch((error) => {
                    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                        navigate("/nao-autorizado"); // Redireciona para a página de não autorizado
                    } else {
                        console.error("Erro ao obter usuário:", error);
                    }
                });

            // Carregar listas (statusChamados, assuntos, colaboradores)
            axios
                .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userStatusChamados")
                .then((response) => setStatusChamados(response.data))
                .catch((error) => console.error("Erro ao carregar status chamados:", error));

            axios
                .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListAssuntos")
                .then((response) => setAssuntos(response.data))
                .catch((error) => console.error("Erro ao carregar assuntos:", error));

            axios
                .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListColaboradores")
                .then((response) => setColaboradores(response.data))
                .catch((error) => console.error("Erro ao carregar colaboradores:", error));
        }
    }, [navigate]);





  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, arquivo: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };




const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const data = new FormData();

  const chamadoData = {
    nome: formData.nome,
    email: formData.email,
    empresa: formData.empresa,
    cnpj: formData.cnpj,
    statuschamados: { id: formData.statuschamados },
    assuntos: { id: formData.assuntos },
    colaboradores: { id: formData.colaboradores },
    justificativa: formData.justificativa,
    reclamacao: formData.reclamacao,
  };

  data.append("chamado", new Blob([JSON.stringify(chamadoData)], { type: "application/json" }));

  if (formData.arquivo) {
    data.append("file", formData.arquivo);
  }

  try {
    await axios.post("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/cadastrar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Chamado registrado com sucesso!");

    // 🔹 Limpar os campos do formulário após sucesso
    setFormData({
      arquivo: null,
      statuschamados: "",
      assuntos: "",
      colaboradores: "",
      justificativa: "",
      reclamacao: "",
    });

    // 🔹 Limpar o campo de arquivo manualmente
    document.getElementById("arquivo").value = "";

  } catch (error) {
    console.error("Erro ao criar chamado:", error.response);
    alert(`Erro: ${error.response?.data?.message || "Erro ao criar chamado"}`);
  }
};


  return (
    <>
      <h2 className="alert alert-info text-center">Registrar um Novo Chamado</h2>
      <form onSubmit={handleSubmit} className="container mt-5">
        <div className="border border-primary p-4">
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                name="nome"
                id="nome"
                className="form-control border border-primary"
                value={formData.nome || ""}  disabled

              />
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control border border-primary"
                value={formData.email || ""} disabled

              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6 form-group">
              <label htmlFor="empresa">Empresa:</label>
              <input
                type="text"
                name="empresa"
                id="empresa"
                className="form-control border border-primary"
                value={formData.empresa || ""} disabled

              />
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="cnpj">CNPJ:</label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                className="form-control border border-primary"
                value={formData.cnpj || ""} disabled

              />
            </div>
          </div>
        </div>

        <div className="border border-primary p-4">
          <div className="row">
            <div className="col-md-4 form-group">
                      <label htmlFor="assuntos">Assunto:</label>
                      <select
                        name="assuntos"
                        id="assuntos"
                        className="form-control border border-primary"
                        value={formData.assuntos}
                        onChange={handleChange}
                      >
                        <option value="">Selecione um assunto</option>
                        {assuntos.map((assunto, index) => (
                          <option key={assunto.id} value={assunto.id} disabled={index !== 0}>
                            {assunto.descricao}
                          </option>
                        ))}
                      </select>
                    </div>

             <div className="col-md-4 form-group">
                      <label htmlFor="statuschamados">Status do Chamado:</label>
                      <select
                        name="statuschamados"
                        id="statuschamados"
                        className="form-control border border-success"
                        value={formData.statuschamados}
                        onChange={handleChange}
                      >
                        <option value="">Selecione o status</option>
                        {statusChamados.map((status, index) => (
                          <option key={status.id} value={status.id} disabled={index !== 0}>
                            {status.status}
                          </option>
                        ))}
                      </select>
                    </div>

            <div className="col-md-4 form-group">
              <label htmlFor="colaboradores">Colaborador:</label>
                       <select
                         name="colaboradores"
                         id="colaboradores"
                         className="form-control border border-warning"
                         value={formData.colaboradores}
                         onChange={handleChange}
                       >
                         <option value="">Selecione um colaborador</option>
                         {colaboradores.map((colaborador, index) => (
                           <option key={colaborador.id} value={colaborador.id} disabled={index !== 0}>
                             {colaborador.nome}
                           </option>
                         ))}
                       </select>
                     </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 form-group">
              <label htmlFor="justificativa">Justificativa:</label>
              <textarea
                name="justificativa"
                id="justificativa"
            className="form-control border border-danger" rows="8" placeholder="Digite aqui a sua solicitação..."

                value={formData.justificativa}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 form-group">
              <label htmlFor="reclamacao">Reclamação:</label>
              <textarea
                name="reclamacao"
                id="reclamacao"
                className="form-control border border-info" rows="8"

                value={formData.reclamacao}
                onChange={handleChange}
                placeholder="Descreva sua reclamação (se houver)"
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 form-group">
              <label htmlFor="arquivo">Anexar Arquivo:</label>
              <input
                type="file"
                name="arquivo"
                id="arquivo"
                className="form-control border border-primary"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

                    <div className="row mt-4">
                      <div className="col text-center">
                        <button type="submit" className="btn btn-primary rounded-pill">
                          Registrar
                        </button>
                      </div>
                    </div>
      </form>
    </>
  );
}

export default UserForm;
