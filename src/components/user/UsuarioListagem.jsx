import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeaders from "../headers/UserHeaders";

export default function UsuarioListagem({ vetor = [] }) {

// Adicione este estado no início do componente
const [isLoadingBusca, setIsLoadingBusca] = useState(false);
    
    const navigate = useNavigate();
    const [ticket, setTicket] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");
    const [assuntos, setAssuntos] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(6);
    const [modalAberto, setModalAberto] = useState(false);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

    const [totalItens, setTotalItens] = useState(0);

 // Função para verificar se o usuário está autorizado
  const verificarAutorizacao = () => {
    // Exemplo de verificação: verifica se há um token no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Se não houver token, redireciona para a página de não autorizado
      window.location.href = "/nao-autorizado";
    }
  };

  // Verifica a autorização ao carregar o componente
  useEffect(() => {
    verificarAutorizacao();
  }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/nao-autorizado");
        } else {
            fetchOptions();
            buscarChamadosPaginados();
        }
    }, [navigate]);

    const fetchOptions = async () => {
        try {
            const token = localStorage.getItem("token");
            const assuntosResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListAssuntos", {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (assuntosResponse.ok) {
                const assuntosData = await assuntosResponse.json();
                setAssuntos(assuntosData);
            }

             const statusResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userStatusChamados", {


                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                setStatusList(statusData);
            }

            const colaboradoresResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListColaboradores", {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (colaboradoresResponse.ok) {
                const colaboradoresData = await colaboradoresResponse.json();
                setColaboradores(colaboradoresData);
            }
        } catch (error) {
            alert("Erro ao buscar os dados de seleção.");
        }
    };

    const buscarChamadosPaginados = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Usuário não autenticado.");
                return;
            }

            const response = await fetch(
                `https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListChamadoss?paginas=${paginaAtual}&itens=${itensPorPagina}`,

                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setResultados(data);
               setTotalItens(prev => data.length === itensPorPagina ? (paginaAtual + 1) * itensPorPagina + 1 : paginaAtual * itensPorPagina + data.length);

            } else {
                alert("Erro ao buscar os chamados.");
            }
        } catch (error) {
            alert("Erro na comunicação com o servidor.");
        }
    };

    useEffect(() => {
        buscarChamadosPaginados();
    }, [paginaAtual, itensPorPagina]);

    const buscarPorTicket = async () => {
        if (!ticket.trim()) {
            setMensagemErro("Por favor, insira um ticket válido.");
            return;
        }

       setIsLoadingBusca(true);
        
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/buscarChamado?ticket=${ticket}`, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 204) {
                setResultados([]);
                setMensagemErro("Nenhum chamado encontrado para este ticket.");
            } else if (response.ok) {
                const data = await response.json();
                setResultados(data);
                setMensagemErro("");
            } else {
                setMensagemErro("Erro ao buscar os dados. Tente novamente mais tarde.");
            }
        } catch (error) {
            setMensagemErro("Erro na comunicação com o servidor.");
        }  finally {
                   setIsLoadingBusca(false);
        }
    };

    const abrirModal = (chamado) => {
        setChamadoSelecionado({ ...chamado });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setChamadoSelecionado(null);
    };

  /* const handleAvaliacaoChange = (e) => {
       setChamadoSelecionado((prevState) => {
           const updated = { ...prevState, pesquisa: e.target.value };
           console.log("Atualizando chamadoSelecionado:", updated);
           return updated;
       });
   };  */

   const handleAvaliacaoChange = (e) => {
       const { value } = e.target;
       setChamadoSelecionado(prevState => ({
           ...prevState,
           pesquisa: value
       }));
   };

    const atualizarChamado = async () => {

        if (!chamadoSelecionado || !chamadoSelecionado.id) {
                alert("Erro: Nenhum chamado selecionado.");
                return;
                }

        try {
            const token = localStorage.getItem("token");

             const chamadoAtualizado = { ...chamadoSelecionado }; // Garantir que temos a versão atualizada

         console.log("Enviando para atualização:", chamadoAtualizado);

            const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/atualizar/${chamadoSelecionado.id}`, {

                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(chamadoSelecionado),
            });

            if (response.ok) {
                alert("Chamado atualizado com sucesso!");
                fecharModal();
                buscarChamadosPaginados();
            } else {
                const errorText = await response.text();
                alert(`Erro ao atualizar o chamado: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            alert("Erro na comunicação com o servidor.");
        }
    };

    const excluirChamado = async (id) => {
        if (window.confirm("Você tem certeza que deseja excluir este chamado?")) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/excluir/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    alert("Chamado excluído com sucesso!");
                    setResultados(resultados.filter((chamado) => chamado.id !== id));
                } else {
                    alert("Erro ao excluir o chamado.");
                }
            } catch (error) {
                alert("Erro na comunicação com o servidor.");
            }
        }
    };

    return (
        <div className="titulo">
            <h1 className="custom-header d-flex justify-content-center" role="alert">
                Lista dos chamados
            </h1>

            <br />

            <div className="d-flex justify-content-center mb-4">
                <input
                    type="text"
                    className="form-control rounded-pill border border-success w-50"
                    placeholder="Digite o número do chamado"
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                />
              
              <button
                    className="btn btn-success rounded-pill"
                    onClick={buscarPorTicket}
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

                                      <div className="d-flex align-items-center ms-0">
                                             <span className="me-2" style={{ color: 'blue' }}>•</span> {/* Ponto azul */}
                                             <span className="me-3" style={{ fontSize: '0.9rem' }}>Bom</span>

                                             <span className="me-2" style={{ color: 'green' }}>•</span> {/* Ponto verde */}
                                             <span className="me-3" style={{ fontSize: '0.9rem' }}>Excelente</span>

                                             <span className="me-2" style={{ color: 'orange' }}>•</span> {/* Ponto amarelo */}
                                             <span className="me-3" style={{ fontSize: '0.9rem' }}>Regular</span>

                                             <span className="me-2" style={{ color: 'red' }}>•</span> {/* Ponto vermelho */}
                                             <span className="me-3" style={{ fontSize: '0.9rem' }}>Ruim</span>
                                     </div>

            {mensagemErro && <p className="text-danger text-center">{mensagemErro}</p>}

            <table className="table table-success table-striped">
                <thead>
                    <tr>
                        <th>Pesquisa</th>
                        <th>Ticket</th>
                        <th>Horário</th>
                        <th>Empresa</th>
                        <th>Nome</th>
                        <th>Solicitação</th>
                        <th>CNPJ</th>
                        <th>Data</th>
                        <th>Dias</th>
                        <th>Arquivo</th>
                        <th>Assunto</th>
                        <th>Status</th>
                        <th>Colaborador</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(resultados) && resultados.length > 0 ? resultados : Array.isArray(vetor) ? vetor : []).map((objeto, indice) => (
                        <tr
                            key={objeto.ticket}
                            className={
                                objeto.assuntos?.descricao === "Customização" && objeto.dias > 5
                                    ? "table-danger"
                                    : objeto.assuntos?.descricao === "Implantação" && objeto.dias > 4
                                    ? "table-warning"
                                    : ""
                            }
                        >
                         <td>

                                {objeto.pesquisa === "Ruim" && <span className="ms-2 text-danger pisca">&#x2B24;</span>}
                                {objeto.pesquisa === "Bom" && <span className="ms-2 text-primary pisca">&#x2B24;</span>}
                                {objeto.pesquisa === "Regular" && <span className="ms-2 text-warning pisca">&#x2B24;</span>}
                                {objeto.pesquisa === "Excelente" && <span className="ms-2 text-success pisca">&#x2B24;</span>}
                           </td>

                            <td>{objeto.ticket}</td>
                            <td>{objeto.horario}</td>
                            <td>{objeto.empresa}</td>
                            <td>{objeto.nome}</td>
                            <td>{objeto.justificativa}</td>
                            <td>{objeto.cnpj}</td>
                            <td>{objeto.data}</td>
                            <td>{objeto.dias}</td>
                            <td>
                                <a
                                    //href={`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/download/${objeto.id}`}
                                    href={`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/download/${objeto.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {objeto.name}
                                </a>
                            </td>
                            <td>{objeto.assuntos?.descricao}</td>
                            <td>{objeto.statuschamados?.status}</td>
                            <td>{objeto.colaboradores?.nome}</td>
                            <td>
                                <button
                                    className="btn btn-warning rounded-pill px-3"
                                    onClick={() => abrirModal(objeto)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
{/*
            <div className="d-flex justify-content-center my-3">
                <button
                    className="btn btn-primary rounded-pill mx-2"
                    disabled={paginaAtual === 0}
                    onClick={() => setPaginaAtual(paginaAtual - 1)}
                >
                    Anterior
                </button>
                <span>Página {paginaAtual + 1}</span>
                <button
                    className="btn btn-primary rounded-pill mx-2"
                    disabled={resultados.length < itensPorPagina}
                    onClick={() => setPaginaAtual(paginaAtual + 1)}
                >
                    Próximo
                </button>
            </div>
*/}

 <div className="d-flex justify-content-center my-2">
           <span className="me-2">Itens por página:</span>
           <select
             className="form-select"
             style={{ width: '80px' }}
             value={itensPorPagina}
             onChange={(e) => {
               setItensPorPagina(Number(e.target.value));
               setPaginaAtual(0); // Resetar para a primeira página ao mudar o tamanho
             }}
           >
             <option value="5">5</option>
             <option value="10">10</option>
             <option value="20">20</option>
             <option value="50">50</option>
           </select>
</div>

            
            {modalAberto && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title alert alert-success">Editar Chamado</h5>
                                <button type="button" className="btn-close" onClick={fecharModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group mb-3 text-center">
                                        <label className="fw-bold">Justificativa</label>
                                        <textarea
                                            className="form-control text-center"
                                            rows="12"
                                            value={chamadoSelecionado.justificativa || "N/A"}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group mb-3 text-center">
                                        <label className="fw-bold">Avaliação</label>
                                        <select
                                            className="form-control"
                                            value={chamadoSelecionado.pesquisa || ""}
                                            onChange={handleAvaliacaoChange}
                                        >
                                            <option value="">Selecione uma avaliação</option>
                                            <option value="Ruim">Ruim</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Bom">Bom</option>
                                            <option value="Excelente">Excelente</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary rounded-pill" onClick={fecharModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary rounded-pill" onClick={atualizarChamado}>
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
