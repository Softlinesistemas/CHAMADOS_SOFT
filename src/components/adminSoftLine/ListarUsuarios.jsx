import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminHeaders from '../headers/AdminHeaders'; // Certifique-se de que o caminho está correto

export default function ListarUsuarios() {

  // Adicione este estado no início do componente
const [isLoadingBusca, setIsLoadingBusca] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [cnpj, setCnpj] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para o modal de edição de dados do usuário
  const [showModal, setShowModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Estados para o modal de edição de papéis
  const [showModalPapeis, setShowModalPapeis] = useState(false);
  const [papeisDisponiveis, setPapeisDisponiveis] = useState([]);
  const [papeisSelecionados, setPapeisSelecionados] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    login: "",
    ativo: false,
    empresa: "",
    password: "",
    cnpj: "",
  });


{/*
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("https://chamados-softline-k3bsb.ondigitalocean.app/usuario/admin/listarUsuarios");
        setUsuarios(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar usuários. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);


  */}

  useEffect(() => {
      const token = localStorage.getItem("token"); // Recupera o token do localStorage
      if (!token) {
          // Redireciona para a página de não autorizado
          window.location.href = "/nao-autorizado";
          return;
      }

      const fetchUsuarios = async () => {
          try {
              const response = await axios.get("https://chamados-softline-k3bsb.ondigitalocean.app/usuario/admin/listarUsuarios", {
                  headers: {
                      Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                  },
              });
              setUsuarios(response.data);
              setLoading(false);
          } catch (err) {
              if (err.response && err.response.status === 403) {
                  // Redireciona para a página de não autorizado
                  window.location.href = "/nao-autorizado";
              } else {
                  setError("Erro ao buscar usuários. Tente novamente mais tarde.");
              }
              setLoading(false);
          }
      };

      fetchUsuarios();
  }, []);



  // Fetch para listar os papéis disponíveis
  const fetchPapeis = async () => {
    try {
      const response = await axios.get("https://chamados-softline-k3bsb.ondigitalocean.app/usuario/admin/listarPapeis");
      setPapeisDisponiveis(response.data);
    } catch (err) {
      alert("Erro ao carregar os papéis. Tente novamente.");
    }
  };

  // Abrir o modal de edição de dados
  const abrirModal = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      login: usuario.login,
      ativo: usuario.ativo,
      empresa: usuario.empresa,
      password: usuario.password,
      cnpj: usuario.cnpj,
    });
    setShowModal(true);
  };

  // Fechar o modal de edição de dados
  const fecharModal = () => {
    setShowModal(false);
    setUsuarioEditando(null);
  };

  // Abrir o modal de edição de papéis
  const abrirModalPapeis = (usuario) => {
    setUsuarioEditando(usuario);
    setPapeisSelecionados(usuario.papeis.map((p) => p.id)); // IDs dos papéis associados ao usuário
    fetchPapeis();
    setShowModalPapeis(true);
  };

  // Fechar o modal de edição de papéis
  const fecharModalPapeis = () => {
    setShowModalPapeis(false);
    setUsuarioEditando(null);
  };

  // Atualizar os papéis selecionados
 const handleChange = (e) => {
   const { name, value, type, checked } = e.target;
   setFormData((prev) => ({
     ...prev,
     [name]: type === "checkbox" ? checked : value,
   }));
 };


  // Submeter os dados atualizados
  const handleUpdate = async () => {
    if (!usuarioEditando) return;

    try {
      const response = await axios.put(
        `https://chamados-softline-k3bsb.ondigitalocean.app/usuario/atualizar/${usuarioEditando.id}`,
        formData
      );

      alert("Usuário atualizado com sucesso!");

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id === usuarioEditando.id ? response.data : usuario
        )
      );

      fecharModal();
    } catch (err) {
      alert("Erro ao atualizar usuário. Tente novamente.");
    }
  };



// Alternar a seleção de um papel
const handlePapelChange = (papelId) => {
  setPapeisSelecionados((prevSelecionados) =>
    prevSelecionados.includes(papelId)
      ? prevSelecionados.filter((id) => id !== papelId) // Remove o papel se já estiver selecionado
      : [...prevSelecionados, papelId] // Adiciona o papel se não estiver selecionado
  );
};


  // Submeter a edição de papéis
 const handleUpdatePapeis = async () => {

   if (!usuarioEditando) return;

   try {
     const params = new URLSearchParams();
     papeisSelecionados.forEach((id) => params.append("pps", id));


console.log("URL:", `https://chamados-softline-k3bsb.ondigitalocean.app/usuario/editarPapel/${usuarioEditando.id}?${params.toString()}`);
    console.log("Papeis selecionados:", papeisSelecionados);


     await axios.put(
       `https://chamados-softline-k3bsb.ondigitalocean.app/usuario/editarPapel/${usuarioEditando.id}?${params.toString()}`
     );

     alert("Papéis atualizados com sucesso!");
     fecharModalPapeis();
   } catch (err) {
     alert("Erro ao atualizar papéis. Tente novamente.");
   }
 };


const buscarPorCnpj = async () => {
    if (!cnpj.trim()) {
      setMensagemErro('Por favor, insira CNPJ válido.');
      return;
    }

 setIsLoadingBusca(true);
  
    try {
      const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/usuario/admin/buscarUsuarios?cnpj=${cnpj}`);
        console.log("Resposta da API:", response);
      if (response.status === 204) {
        setResultados([]);
        setMensagemErro('Nenhum usuário encontrado para este CNPJ .');
      } else if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
        setMensagemErro('');
      } else {
        setMensagemErro('Erro ao buscar os dados. Tente novamente mais tarde.');
      }
    } catch (error) {
      setMensagemErro('Erro na comunicação com o servidor.');
    }  finally {
               setIsLoadingBusca(false);
    }
  };



  return (
    <div className="container mt-5">

         <AdminHeaders />

      <h2 className="text-center mb-4 alert alert-info" role="alert">
        Lista de Usuários
      </h2>

<br />

      {/* Div de busca por ticket */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control rounded-pill border border-success w-50"
          placeholder="Informe o CNPJ da empresa"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
        />
        {/*
        <button className="btn btn-success rounded-pill ms-2" onClick={buscarPorCnpj}>
          Buscar
        </button> 
        */}

           <button
              className="btn btn-success rounded-pill"
              onClick={buscarPorCnpj}
              disabled={isLoadingBusca}
            >
              {isLoadingBusca ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="ms-2">Buscando...</span>
                </>
              ) : (
                'Buscar'
              )}
            </button>
        
      </div>

      {mensagemErro && <p className="text-danger text-center">{mensagemErro}</p>}



      {loading && <p className="text-center">Carregando...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <table className="table table-success table-striped">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Login</th>
              <th>Ativo</th>
              <th>Empresa</th>
               <th>CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{index + 1}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.login}</td>
                <td>{usuario.ativo ? "Sim" : "Não"}</td>
                <td>{usuario.empresa}</td>
                 <td>{usuario.cnpj}</td>
                <td>
                  <button
                    className="btn btn-warning rounded-pill px-3 me-2"
                    onClick={() => abrirModal(usuario)}
                  >
                    Editar Dados
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill px-3"
                    onClick={() => abrirModalPapeis(usuario)}
                  >
                    Editar Papéis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de Edição de Dados */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Editar Usuário</h5>
                        <button type="button" className="btn-close" onClick={fecharModal}></button>
                      </div>
                      <div className="modal-body">
                        <form>


                       <div className="mb-3">
                         <label htmlFor="password" className="form-label">Senha</label>
                        <input
                          type="password"
                        className="form-control"
                        id="password"
                       name="password"
                        value={formData.password}
                          onChange={handleChange}
                         />
                      </div>



                          <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome</label>
                            <input
                              type="text"
                              className="form-control"
                              id="nome"
                              name="nome"
                              value={formData.nome}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="login" className="form-label">Login</label>
                            <input
                              type="text"
                              className="form-control"
                              id="login"
                              name="login"
                              value={formData.login}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="empresa" className="form-label">Empresa</label>
                            <input
                              type="text"
                              className="form-control"
                              id="empresa"
                              name="empresa"
                              value={formData.empresa}
                              onChange={handleChange}
                            />
                          </div>

                       <div className="mb-3">
                           <label htmlFor="cnpj" className="form-label">CNPJ</label>
                          <input
                          type="text"
                           className="form-control"
                            id="cnpj"
                           name="cnpj"
                           value={formData.cnpj}
                           onChange={handleChange}
                           />
                          </div>


                          <div className="form-check mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="ativo"
                              name="ativo"
                              checked={formData.ativo}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="ativo">
                              Ativo
                            </label>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary rounded-pill" onClick={fecharModal}>
                          Cancelar
                        </button>
                        <button type="button" className="btn btn-primary rounded-pill" onClick={handleUpdate}>
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
      )}

      {/* Modal de Edição de Papéis */}
      {showModalPapeis && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Papéis</h5>
                <button type="button" className="btn-close" onClick={fecharModalPapeis}></button>
              </div>
              <div className="modal-body">
                <form>
                  {papeisDisponiveis.map((papel) => (
                    <div key={papel.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`papel-${papel.id}`}
                        checked={papeisSelecionados.includes(papel.id)}
                        onChange={() => handlePapelChange(papel.id)}
                      />
                      <label className="form-check-label" htmlFor={`papel-${papel.id}`}>
                        {papel.papel}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={fecharModalPapeis}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleUpdatePapeis}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
