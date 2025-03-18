import React, { useState } from "react";
import axios from "axios";

function Formulario() {
  const [statusChamados, setStatusChamados] = useState([]);
  const [assuntos, setAssuntos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [formData, setFormData] = useState({

    arquivo: null,
    statuschamados: "",
    assuntos: "",
    colaboradores: "",
    justificativa: "",
    reclamacao: "",
    nome: "",
    email: "",
    empresa: "",
    cnpj: "",

  });

  // Carregar listas (statusChamados, assuntos, colaboradores)
  React.useEffect(() => {
    axios
      .get("http://localhost:8080/chamados/user/userStatusChamados")
      .then((response) => setStatusChamados(response.data))
      .catch((error) => console.error("Erro ao carregar status chamados:", error));

    axios
      .get("http://localhost:8080/chamados/user/userListAssuntos")
      .then((response) => setAssuntos(response.data))
      .catch((error) => console.error("Erro ao carregar assuntos:", error));

    axios
      .get("http://localhost:8080/chamados/user/userListColaboradores")
      .then((response) => setColaboradores(response.data))
      .catch((error) => console.error("Erro ao carregar colaboradores:", error));
  }, []);

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

  const data = new FormData();

  // Adicionar o objeto chamado como JSON
  const chamadoData = {

      statuschamados: { id: formData.statuschamados },
      assuntos: { id: formData.assuntos },
      colaboradores: { id: formData.colaboradores },
      justificativa: formData.justificativa,
      reclamacao: formData.reclamacao,
      nome: formData.nome,
      email: formData.email,
      empresa: formData.empresa,
      cnpj: formData.cnpj,

  };

  data.append("chamado", new Blob([JSON.stringify(chamadoData)], { type: "application/json" }));

  // Adicionar o arquivo
  if (formData.arquivo) {
    data.append("file", formData.arquivo);
  }else{


  }

  try {
    const response = await axios.post(
      "http://localhost:8080/chamados/user/cadastrar", data, {
headers: {
        "Content-Type": "multipart/form-data",
      },

      }
    );
    alert("Chamado registrado com sucesso!");
  } catch (error) {
   console.error("Erro ao criar chamado:", error.response);
     alert(`Erro: ${error.response?.data?.message || "Erro ao criar chamado"}`);
  }
};



  return (
<>
     <h2 className="alert alert-info text-center" role="alert">Registrar um Novo Chamado</h2>
     <form onSubmit={handleSubmit} className="container mt-5">

         {/*    Insira aqui os inputs do nome, email, empresa e cnpj
          <div className="border border-primary p-4">
         */}

        <div className="border border-primary p-4">
                   <div className="row">
                     <div className="col-md-6 form-group">
                       <label htmlFor="nome">Nome:</label>
                       <input
                         type="text"
                         name="nome"
                         id="nome"
                         className="form-control border border-primary"
                         value={formData.nome}
                         onChange={handleChange}
                         required
                       />
                     </div>

                     <div className="col-md-6 form-group">
                       <label htmlFor="email">Email:</label>
                       <input
                         type="email"
                         name="email"
                         id="email"
                         className="form-control border border-primary"
                         value={formData.email}
                         onChange={handleChange}
                         required
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
                         value={formData.empresa}
                         onChange={handleChange}
                         required
                       />
                     </div>

                     <div className="col-md-6 form-group">
                       <label htmlFor="cnpj">CNPJ:</label>
                       <input
                         type="text"
                         name="cnpj"
                         id="cnpj"
                         className="form-control border border-primary"
                         value={formData.cnpj}
                         onChange={handleChange}
                         required
                       />
                     </div>
                   </div>
                </div>



      <div className=" border border-primary p-4" >
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

      <div className="row">
        <div className="col-md-6 form-group">
          <label htmlFor="justificativa">Justificativa:</label>
          <textarea
            name="justificativa"
            id="justificativa"
            className="form-control border border-danger" rows="8" placeholder="Digite aqui a sua solicitação..."
            value={formData.justificativa}
            onChange={handleChange}
          required/>
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor="reclamacao">Reclamação:</label>
          <textarea
            name="reclamacao"
            id="reclamacao"
            className="form-control border border-info" rows="8"
            value={formData.reclamacao}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 form-group">
          <label htmlFor="arquivo">Arquivo(opcional):</label>
          <input
            type="file"
            name="arquivo"
            id="arquivo"
            className="form-control border border-primary"
            onChange={handleChange}
            style={{ width: "200%" }}
          />
        </div>
      </div>

            <div className="row mt-4">
              <div className="col text-center">
                <button type="submit" className="btn btn-primary rounded-pill">
                  Registrar
                </button>
              </div>
            </div>

      </div>
    </form>
    </>
  );
}

export default Formulario;
