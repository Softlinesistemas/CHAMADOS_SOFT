import React, { useState, useEffect } from 'react';

import '../css/UserSoftlineListagem.css';

import UserSoftLineHeaders from "../headers/UserSoftLineHeaders";
import { useNavigate } from 'react-router-dom';


export default function UserSoftlineListagem({ vetor = [] }) {
  
const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
const navigate = useNavigate();

const [colaborador, setColaborador] = useState('');
  const [ticket, setTicket] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');

  const [assuntos, setAssuntos] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(6);

  const [modalAberto, setModalAberto] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  // Adicione este estado no início do componente
const [isLoadingBusca, setIsLoadingBusca] = useState(false);

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



 const buscarPorColaborador = async () => {

 if (!colaborador.trim()) {
     setMensagemErro('Por favor, insira um nome válido.');
     return;
   }

 setIsLoadingBusca(true);
   
   try {
     const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/listarPorColaborador?nome=${colaborador}`);

     if (response.status === 204) {
       setResultados([]);
       setMensagemErro('Nenhum colaborador encontrado!!');
     } else if (response.ok) {
       const data = await response.json();
       setResultados(data);
       setMensagemErro('');
     } else {
       const errorText = await response.text(); // Captura o corpo da resposta em caso de erro
       setMensagemErro(`Erro ao buscar os dados: ${errorText}`);
     }
   } catch (error) {
     setMensagemErro('Erro na comunicação com o servidor.');
   } finally {
              setIsLoadingBusca(false);
   }
 };



  const fetchOptions = async () => {
    try {
      const assuntosResponse = await fetch('https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListAssuntos');
      if (assuntosResponse.ok) {
        const assuntosData = await assuntosResponse.json();
        setAssuntos(assuntosData);
      }

      const statusResponse = await fetch('https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userStatusChamados');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setStatusList(statusData);
      }

      const colaboradoresResponse = await fetch('https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListColaboradores');
      if (colaboradoresResponse.ok) {
        const colaboradoresData = await colaboradoresResponse.json();
        setColaboradores(colaboradoresData);
      }
    } catch (error) {
      alert('Erro ao buscar os dados de seleção.');
    }
  };

  React.useEffect(() => {
    fetchOptions();
  }, []);

  const abrirModal = (chamado) => {
    setChamadoSelecionado({ ...chamado });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setChamadoSelecionado(null);
  };

  const atualizarChamado = async () => {

     setIsLoadingUpdate(true); // Ativa o estado de loading
    
    try {
      const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/atualizar/${chamadoSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chamadoSelecionado),

      });

      if (response.ok) {
        alert('Chamado atualizado com sucesso!');
        fecharModal();
        buscarChamadosPaginados();
      } else {
         const errorText = await response.text(); // Para capturar o corpo da resposta em caso de erro
          alert(`Erro ao atualizar o chamado: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      alert('Erro na comunicação com o servidor.');
    } finally {
          setIsLoadingUpdate(false); // Desativa o estado de loading
        }
  };


// Função para excluir o chamado
  const excluirChamado = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este chamado?")) {
      try {
        const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/excluir/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Chamado excluído com sucesso!");
          // Atualiza a lista após a exclusão
          setResultados(resultados.filter(chamado => chamado.id !== id));
        } else {
          alert("Erro ao excluir o chamado.");
        }
      } catch (error) {
        alert("Erro na comunicação com o servidor.");
      }
    }
  };





  const buscarChamadosPaginados = async () => {
    try {
      const response = await fetch(
        `https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListChamados?paginas=${paginaAtual}&itens=${itensPorPagina}`
      );
      if (response.ok) {
        const data = await response.json();
        setResultados(data);
      } else {
        alert('Erro ao buscar os chamados.');
      }
    } catch (error) {
      alert('Erro na comunicação com o servidor.');
    }
  };

  React.useEffect(() => {
    buscarChamadosPaginados();
  }, [paginaAtual, itensPorPagina]);



  const buscarPorTicket = async () => {
    if (!ticket.trim()) {
      setMensagemErro('Por favor, insira um ticket válido.');
      return;
    }

    setIsLoadingBusca(true);
    
    try {
      const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/softline/buscarChamados?ticket=${ticket}`);

      if (response.status === 204) {
        setResultados([]);
        setMensagemErro('Nenhum chamado encontrado para este ticket.');
      } else if (response.ok) {
        const data = await response.json();
        setResultados(data);
        setMensagemErro('');
      } else {
        const errorText = await response.text(); // Captura o corpo da resposta em caso de erro
        setMensagemErro(`Erro ao buscar os dados: ${errorText}`);
      }
    } catch (error) {
      setMensagemErro('Erro na comunicação com o servidor.');
    } finally {
               setIsLoadingBusca(false);
     }
  };




  return (
    <div className="titulo">
        <UserSoftLineHeaders />
      <h1 className="custom-header d-flex justify-content-center" role="alert">Lista dos chamados-SUPORTE</h1>

  <br />

       <div>
                  {/* Div de busca por ticket e colaborador */}
                  <div className="d-flex justify-content-start mb-4">
                    {/* Div de busca por ticket */}
                    <div className="d-flex align-items-center me-3">
                      <input
                        type="text"
                        className="form-control rounded-pill border border-success me-2"
                        style={{ width: "300px" }}
                        placeholder="Digite o número do chamado"
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                      />
               <button
                   className="btn btn-success rounded-pill"
                   onClick={buscarPorColaborador}
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

                    {/* Div de busca por colaborador */}
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control rounded-pill border border-success me-2"
                        style={{ width: "300px" }}
                        placeholder="Digite o nome do colaborador"
                        value={colaborador}
                        onChange={(e) => setColaborador(e.target.value)}
                      />

               <button
                   className="btn btn-success rounded-pill"
                   onClick={buscarPorColaborador}
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
               </button>>

                      
                    </div>
                  </div>
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
            {/*  <th>Reclamação</th> */}
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
          {(
                      Array.isArray(resultados) && resultados.length > 0
                        ? resultados
                        : Array.isArray(vetor)
                        ? vetor
                        : []
                    ).map((objeto, indice) => (
            <tr
             key={objeto.ticket}
                 className={
                objeto.assuntos?.descricao === 'Customização' && objeto.dias > 5
                ? 'table-danger' // Adiciona a classe de realce condicional
                  : objeto.assuntos?.descricao === 'Implantação' && objeto.dias > 4
                  ? 'table-warning' // Realça com amarelo
                : ''
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





              {/*  <td>{objeto.reclamacao}</td> */}

              <td>{objeto.cnpj}</td>
              <td>{objeto.data}</td>
               <td>{objeto.dias}</td>

               <td>
                    <a href={`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/download/${objeto.id}`} target="_blank" rel="noopener noreferrer">
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

               <td>

               <button className="btn btn-danger rounded-pill px-3" type="button"
                 onClick={() => excluirChamado(objeto.id)} // Chama a função de exclusão
                    >
                   Excluir
                 </button>

               </td>

            </tr>
          ))}
        </tbody>
      </table>



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
    disabled={resultados.length < itensPorPagina} // Desabilita quando não há mais itens
    onClick={() => setPaginaAtual(paginaAtual + 1)}
  >
    Próximo
  </button>
</div>


      {modalAberto && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Chamado</h5>
                <button type="button" className="btn-close" onClick={fecharModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group mb-3">
                    <label>Assunto</label>
                    <select
                      className="form-control"
                      value={chamadoSelecionado.assuntos?.id || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          assuntos: { id: e.target.value },
                        })
                      }
                    >
                      <option value="">Selecione um Assunto</option>
                      {assuntos.map((assunto) => (
                        <option key={assunto.id} value={assunto.id}>
                          {assunto.descricao}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={chamadoSelecionado.statuschamados?.id || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          statuschamados: { id: e.target.value },
                        })
                      }
                    >
                      <option value="">Selecione um Status</option>
                      {statusList.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label>Colaborador</label>
                    <select
                      className="form-control"
                      value={chamadoSelecionado.colaboradores?.id || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          colaboradores: { id: e.target.value },
                        })
                      }
                    >
                      <option value="">Selecione um Colaborador</option>
                      {colaboradores.map((colaborador) => (
                        <option key={colaborador.id} value={colaborador.id}>
                          {colaborador.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label>Reclamação</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={chamadoSelecionado.reclamacao || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          reclamacao: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="form-group mb-3">
                    <label>Justificativa</label>
                    <textarea
                      className="form-control"
                      rows="3"
                     value={chamadoSelecionado.justificativa || ''}  disabled
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          justificativa: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="form-group mb-3">
                    <label>Empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={chamadoSelecionado.empresa || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          empresa: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={chamadoSelecionado.nome || ''}
                      onChange={(e) =>
                        setChamadoSelecionado({
                          ...chamadoSelecionado,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={fecharModal}>
                  Cancelar
                </button>

                {/*  
                <button type="button" className="btn btn-primary rounded-pill" onClick={atualizarChamado}>
                  Salvar
                </button>  */}

                  <button
                type="button"
                className="btn btn-primary rounded-pill"
                onClick={atualizarChamado}
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="ms-2">Salvando...</span>
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
