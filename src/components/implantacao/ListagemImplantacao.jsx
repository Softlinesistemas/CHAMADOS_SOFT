import React, { useState, useEffect } from 'react';
import  ImplantacaoHeaders from '../headers/ImplantacaoHeaders';
import { useNavigate } from 'react-router-dom';


export default function ListagemImplantacao({ vetor = [] }){


const navigate = useNavigate();
   const [ticket, setTicket] = useState(''); // Estado para o ticket digitado
   const [resultados, setResultados] = useState([]); // Estado para armazenar resultados filtrados
   const [mensagemErro, setMensagemErro] = useState(''); // Estado para mensagens de erro

   const [assuntos, setAssuntos] = useState([]);
   const [statusList, setStatusList] = useState([]);
   const [colaboradores, setColaboradores] = useState([]);

   const [paginaAtual, setPaginaAtual] = useState(0); // Página atual (começa em 0)
   const [itensPorPagina, setItensPorPagina] = useState(6); // Quantidade de itens por página

    // Estado do Modal e o Objeto Selecionado
    const [modalAberto, setModalAberto] = useState(false); // Estado para controlar o modal
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null); // Estado para armazenar o chamado selecionado


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


    // Função para Abrir o Modal
   const abrirModal = (chamado) => {
      setChamadoSelecionado({ ...chamado });
      setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setChamadoSelecionado(null);
      };

  const atualizarChamado = async () => {
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
       `https://chamados-softline-k3bsb.ondigitalocean.app/chamados/implantacao/usuarioImplantacao?paginas=${paginaAtual}&itens=${itensPorPagina}`
     );
     if (response.ok) {
       const data = await response.json();
       // Filtrar apenas chamados com "Implantação"
       const chamadosFiltrados = data.filter(chamado => chamado.assuntos?.descricao === "Implantação");
       setResultados(chamadosFiltrados);
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


// Função para buscar as listas do backend
const fetchOptions = async () => {

  try {
    // Buscar Assuntos
    const assuntosResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListAssuntos");
    if (assuntosResponse.ok) {
      const assuntosData = await assuntosResponse.json();
      setAssuntos(assuntosData); // Deve ser um array
    }

    // Buscar Status
    const statusResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userStatusChamados");
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      setStatusList(statusData); // Deve ser um array
    }

    // Buscar Colaboradores
    const colaboradoresResponse = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListColaboradores");
    if (colaboradoresResponse.ok) {
      const colaboradoresData = await colaboradoresResponse.json();
      setColaboradores(colaboradoresData); // Deve ser um array
    }
  } catch (error) {
    alert('Erro ao buscar os dados de seleção.');
  }
};


   // Chamar a função ao montar o componente
 React.useEffect(() => {
     fetchOptions();
 }, []);


   const buscarPorTicket = async () => {

      if (!ticket.trim()) {
        setMensagemErro('Por favor, insira um ticket válido.');
        return;
      }

      try {
        const response = await fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/implantacao/buscarImplantacao?ticket=${ticket}`);
        if (response.status === 204) {
          setResultados([]);
          setMensagemErro('Nenhum chamado encontrado para este ticket.');
        } else if (response.ok) {
          const data = await response.json();
          setResultados(data);
          setMensagemErro('');
        } else {
          setMensagemErro('Erro ao buscar os dados. Tente novamente mais tarde.');
        }
      } catch (error) {
        setMensagemErro('Erro na comunicação com o servidor.');
      }
    };




   return (

    <div className="titulo">

     <ImplantacaoHeaders/>

         <h1 className="custom-header d-flex justify-content-center" role="alert">Lista dos chamados para Implantação</h1>
              <br />


               {/* Div de busca por ticket */}
                    <div className="d-flex justify-content-center mb-4">
                      <input
                        type="text"
                        className="form-control rounded-pill border border-success w-50"
                        placeholder="Digite o número do chamado"
                        value={ticket}
                        onChange={(e) => setTicket(e.target.value)}
                      />
                      <button className="btn btn-success rounded-pill ms-2" onClick={buscarPorTicket}>
                        Buscar
                      </button>
                    </div>

                    {mensagemErro && <p className="text-danger text-center">{mensagemErro}</p>}


            <table className="table table-success table-striped">
                  <thead>
                    <tr>

                      <th>Empresa</th>
                      <th>CNPJ</th>
                      <th>Nome</th>
                      <th>Data</th>
                      <th>Ticket</th>
                      <th>Solicitação</th>
                      <th>Horário</th>
                      <th>Dias</th>
                      <th>Arquivo</th>
                      <th>Assunto</th>
                      <th>Status</th>
                      <th>Colaborador</th>
                      <th>Reclamação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                 {/*   {(resultados.length > 0 ? resultados : vetor).map((objeto, indice)*/}
                   {(
                      Array.isArray(resultados) && resultados.length > 0
                         ? resultados.filter(chamado => chamado.assuntos?.descricao === "Implantação")
                         : Array.isArray(vetor)
                         ? vetor.filter(chamado => chamado.assuntos?.descricao === "Implantação")
                         : []
                    ).map((objeto, indice) => (

                      <tr key={objeto.ticket}

                      className={
                              objeto.assuntos?.descricao === 'Implantação' && objeto.dias > 5
                                ? 'table-danger' // Adiciona a classe de realce condicional
                                : ''
                            }

                      >

                        <td>{objeto.empresa}</td>
                        <td>{objeto.cnpj}</td>
                        <td>{objeto.nome}</td>
                        <td>{objeto.data}</td>
                        <td>{objeto.ticket}</td>
                        <td>{objeto.justificativa}</td>
                        <td>{objeto.horario}</td>
                        <td>{objeto.dias}</td>
                        <td>
                          <a href={`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/download/${objeto.id}`} target="_blank" rel="noopener noreferrer">
                            {objeto.name}
                          </a>
                        </td>
                        <td>{objeto.assuntos?.descricao}</td>
                        <td>{objeto.statuschamados?.status}</td>
                        <td>{objeto.colaboradores?.nome}</td>
                        <td>{objeto.reclamacao}</td>
                        <td>
                          <button className="btn btn-warning rounded-pill px-3" type="button" onClick={() => abrirModal(objeto)}>Editar</button>
                        </td>
                  {/*
                        <td>

                          <button className="btn btn-danger rounded-pill px-3" type="button"
                                onClick={() => excluirChamado(objeto.id)} // Chama a função de exclusão
                             >
                                  Excluir
                          </button>


                        </td>
                 */}
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
                        value={chamadoSelecionado.justificativa || ''}
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