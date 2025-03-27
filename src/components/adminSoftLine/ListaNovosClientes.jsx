
import '../css/ListaNovosClientes.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import { jwtDecode } from "jwt-decode"; // Para decodificar o token JWT

const ListaNovosClientes = () => {

  const navigate = useNavigate(); // Hook para redirecionamento
  const [clientes, setClientes] = useState([]); // Estado para armazenar a lista de clientes
  const [paginaAtual, setPaginaAtual] = useState(0); // Estado para controlar a página atual
  const [itensPorPagina, setItensPorPagina] = useState(10); // Estado para controlar itens por página
  const [totalPaginas, setTotalPaginas] = useState(0); // Estado para armazenar o total de páginas




// Verificação de autorização ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    if (!token) {
      // Se não houver token, redireciona para a página de não autorizado
      window.location.href = "/nao-autorizado";
      return;
    }

    // Decodifica o token para verificar as roles
    try {
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];

      // Verifica se o usuário tem a role necessária (por exemplo, ADMIN)
      if (!roles.includes("ADMIN")) {
        window.location.href = "/nao-autorizado";
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      window.location.href = "/nao-autorizado";
    }
  }, []); // Executa apenas uma vez ao montar o componente





 const buscarClientes = async () => {
   try {
     const response = await fetch(
       `https://chamados-softline-k3bsb.ondigitalocean.app/chamados/clientes/novosClientess?paginas=${paginaAtual}&itens=${itensPorPagina}`
     );
     if (response.ok) {
       const data = await response.json();
       setClientes(data.clientes); // Atualiza a lista de clientes
       setTotalPaginas(data.totalPaginas); // Atualiza o total de páginas
     } else {
       console.error("Erro ao buscar clientes:", response.statusText);
     }
   } catch (error) {
     console.error("Erro na requisição:", error);
   }
 };

  // Efeito para buscar os clientes quando a página ou itens por página mudam
  useEffect(() => {
    buscarClientes();
  }, [paginaAtual, itensPorPagina]);

  // Função para mudar de página
  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // Função para mudar a quantidade de itens por página
  const mudarItensPorPagina = (novoItensPorPagina) => {
    setItensPorPagina(novoItensPorPagina);
    setPaginaAtual(0); // Volta para a primeira página ao mudar a quantidade de itens
  };

  return (
    <div className="container">
      <h2 className="alert alert-primary my-4 text-center" role="alert">
        Lista de Novos Clientes
      </h2>

      {/* Controles de paginação */}
      <div className="d-flex justify-content-between mb-4">
        <div>
          <label>Itens por página:</label>
          <select
            value={itensPorPagina}
            onChange={(e) => mudarItensPorPagina(Number(e.target.value))}
            className="form-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 0}
          >
            Anterior
          </button>
          <span>
            Página {paginaAtual + 1} de {totalPaginas}
          </span>
          <button
            className="btn btn-primary ms-2"
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual + 1 >= totalPaginas}
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Tabela de clientes */}
      <table className="table table-success table-striped">
        <thead>
          <tr>

            <th>Empresa</th>
            <th>Ramo</th>
            <th>Qtd.Máquinas</th>
            <th>Hr.Contratadas</th>
            <th>Endereço</th>
            <th>Pt.Referência</th>
            <th>Responsável</th>
            <th>Telefone</th>
            <th>CNPJ</th>
            <th>Data Inicial da Implantação</th>
            <th>Data da Inauguração</th>
            <th>Data Final da Implantação</th>
            <th>Local do Servidor</th>
            <th>Config. Srv</th>
            <th>Mig.Dados</th>
            <th>H.Boleto</th>
            <th>Ass. do Contrato</th>
            <th>Pgmto</th>
            <th>Srv.Nuvem</th>
            <th>Config do Srv</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>

              <td>{cliente.nomeEmpresa}</td>
              <td>{cliente.ramo}</td>
              <td>{cliente.qtdMaquinas}</td>
              <td>{cliente.horasContratadas}</td>
              <td>{cliente.endereco}</td>
              <td>{cliente.pontoDeReferencia}</td>
              <td>{cliente.responsavel}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.cjpj}</td>
              <td>{cliente.dataInicialDaImplantacao}</td>
              <td>{cliente.dataInaguracao}</td>
              <td>{cliente.dataFinalDaImplantacao}</td>
              <td>{cliente.localDoServidor}</td>
              <td>{cliente.configuracaoServidor}</td>
              <td>{cliente.migracaoDeDados}</td>
              <td>{cliente.homologacaoBoleto}</td>
              <td>{cliente.assinaturaContratoDePrestacaoDeServico}</td>
              <td>{cliente.pagamento}</td>
              <td>{cliente.servidorEmNuvemEmCotacao}</td>
              <td>{cliente.configuracoesDoServidor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaNovosClientes;

