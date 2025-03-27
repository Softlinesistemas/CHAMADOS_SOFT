import React, { useState, useEffect } from "react";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import { jwtDecode } from "jwt-decode"; // Para decodificar o token JWT

import ListaNovosClientes from './ListaNovosClientes';

export default function NovosClientes() {


    const navigate = useNavigate(); // Hook para redirecionamento
    const [formData, setFormData] = useState({

    nomeEmpresa: "",
    ramo: "",
    qtdMaquinas: "",
    horasContratadas: "",
    endereco: "",
    pontoDeReferrencia: "",
    responsavel: "",
    telefone: "",
    observacaoImplantacao: "",
    observacaoTreinamento: "",
    cjpj: "",
    dataInicialDaImplantacao: "",
    dataInaguracao: "",
    dataFinalDaImplantacao: "",
    localDoServidor: "",
    configuracaoServidor: "",
    migracaoDeDados: "",
    homologacaBoleto: "",
    assinaturaContratoDePrestacaoDeServico: "",
    pagamento: "",
    servidorEmNuvemEmCotacao: "",
    configuracoesDoServidor: "",
     quaisDadosAmigrar: [], // Inicializar como array
     responsabilidadeDoCliente: [], // Inicializar como array
     modulos: [], // Inicializar como array
     treinamento: [], // Inicializar como array
  });


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




   const handleChange = (e) => {
     const { name, value, options, multiple } = e.target;

     if (multiple) {
       // Coletar todos os valores selecionados
       const selectedValues = Array.from(options)
         .filter((option) => option.selected)
         .map((option) => option.value);
       setFormData({ ...formData, [name]: selectedValues });
     } else {
         console.log(`Campo alterado: ${name}, Valor: ${value}`); // Adicione este console.log
       setFormData({ ...formData, [name]: value });
     }
   };


const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData); // Verifique se os campos estão preenchidos

    try {
      const response = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/admin/novosClientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Cliente cadastrado com sucesso!");
        console.log("Cliente cadastrado:", data);
        // Limpar o formulário após o sucesso
        setFormData({
          nomeEmpresa: "",
          ramo: "",
          qtdMaquinas: "",
          horasContratadas: "",
          endereco: "",
          pontoDeReferrencia: "",
          responsavel: "",
          telefone: "",
          observacaoImplantacao: "",
          observacaoTreinamento: "",
          cjpj: "",
          dataInicialDaImplantacao: "",
          dataInaguracao: "",
          dataFinalDaImplantacao: "",
          localDoServidor: "",
          configuracaoservidor: "",
          migracaoDeDados: "",
          homologacaBoleto: "",
          assinaturaContratoDePrestacaoDeServico: "",
          pagamento: "",
          servidorEmNuvemEmCotacao: "",
          configuracoesDoServidor: "",
          quaisDadosAmigrar: [],
          responsabilidadeDoCliente: [],
          modulos: [],
          treinamento: [],
        });
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar cliente: ${errorData.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na comunicação com o servidor.");
    }
  };


  return (

      <div className="d-flex">
           {/* Sidebar */}
           <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px' }}>
             <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
               <svg className="bi pe-none me-2" width="40" height="32">
                 <use xlinkHref="#bootstrap"></use>
               </svg>
               <span className="fs-4">Novos Clientes</span>
             </a>
             <hr />
             <ul className="nav nav-pills flex-column mb-auto">
               <li className="nav-item">
                 <a href="#" className="nav-link active" aria-current="page">
                   <svg className="bi pe-none me-2" width="16" height="16">
                     <use xlinkHref="#home"></use>
                   </svg>
                   Home
                 </a>
               </li>
               <li>
                 <a href="/ListaNovosClientes" className="nav-link text-white" >
                   <svg className="bi pe-none me-2" width="16" height="16">
                     <use xlinkHref="#speedometer2"></use>
                   </svg>
                   Lista dos novos clientes
                 </a>
               </li>
               <li>
                 <a href="#" className="nav-link text-white">
                   <svg className="bi pe-none me-2" width="16" height="16">
                     <use xlinkHref="#table"></use>
                   </svg>
                   A FAZER
                 </a>
               </li>
               <li>
                 <a href="#" className="nav-link text-white">
                   <svg className="bi pe-none me-2" width="16" height="16">
                     <use xlinkHref="#grid"></use>
                   </svg>
                   A FAZER
                 </a>
               </li>
               <li>
                 <a href="#" className="nav-link text-white">
                   <svg className="bi pe-none me-2" width="16" height="16">
                     <use xlinkHref="#people-circle"></use>
                   </svg>
                   A FAZER
                 </a>
               </li>
             </ul>
             <hr />

           </div>


    <div className="container">
         <AdminHeaders />
      <h2 className="alert alert-primary my-4 text-center" role="alert">Formulário do Novo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 border border-4">
          {/** Text Inputs */}

          <div className="col-md-4">
                      <label>Empresa:</label>
                      <input
                        type="text"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleChange}
                        className="form-control border border-primary"
                      />
                    </div>


          <div className="col-md-4">
            <label>Ramo:</label>
            <input
              type="text"
              name="ramo"
              value={formData.ramo}
              onChange={handleChange}
              className="form-control border border-success"
            />
          </div>


            <div className="col-md-4">
                      <label>Data Inicial da Implantação:</label>
                      <input
                        type="Date"
                        name="dataInicialDaImplantacao"
                        value={formData.dataInicialDaImplantacao}
                        onChange={handleChange}
                        className="form-control border border-danger"
                      />
            </div>


              <div className="col-md-4">
                      <label>Data da Inaguração:</label>
                      <input
                        type="Date"
                        name="dataInaguracao"
                        value={formData.dataInaguracao ?? ""}
                        onChange={handleChange}
                        className="form-control border border-danger-subtle"
                      />
            </div>



   <div className="col-md-4">
                      <label>Data final da Implantação:</label>
                      <input
                        type="Date"
                        name="dataFinalDaImplantacao"
                        value={formData.dataFinalDaImplantacao}
                        onChange={handleChange}
                        className="form-control border border-warning"
                      />
            </div>

          <div className="col-md-4">
            <label>Quantidade de Máquinas:</label>
            <input
              type="number"
              name="qtdMaquinas"
              value={formData.qtdMaquinas}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          <div className="col-md-4">
            <label>Horas Contratadas:</label>
            <input
              type="number"
              name="horasContratadas"
              value={formData.horasContratadas}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          {/** More Inputs */}
          <div className="col-md-4">
            <label>Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          <div className="col-md-4">
            <label>Ponto de Referência:</label>
            <input
              type="text"
              name="pontoDeReferrencia"
              value={formData.pontoDeReferrencia}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          <div className="col-md-4">
            <label>Responsável:</label>
            <input
              type="text"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          <div className="col-md-4">
            <label>Telefone:</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          <div className="col-md-6">
            <label>Observação Implantação:</label>
            <textarea
              name="observacaoImplantacao"
              value={formData.observacaoImplantacao}
              onChange={handleChange}
              className="form-control border border-info"
              rows="3"
            />
          </div>

          <div className="col-md-6">
            <label>Observação Treinamento:</label>
            <textarea
              name="observacaoTreinamento"
              value={formData.observacaoTreinamento}
              onChange={handleChange}
              className="form-control border border-info"
              rows="3"
            />
          </div>

          <div className="col-md-4">
            <label>CNPJ:</label>
            <input
              type="text"
              name="cjpj"
              value={formData.cjpj}
              onChange={handleChange}
              className="form-control border border-info"
            />
          </div>

          {/** Select Options */}
          <div className="col-md-4">
            <label>Local do Servidor:</label>
            <select
              name="localDoServidor"
              value={formData.localDoServidor}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Local">Local</option>
              <option value="Nuvem">Nuvem</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Configuração do Servidor:</label>
            <select
              name="configuracaoServidor"
              value={formData.configuracaoServidor}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Migração de Dados:</label>
            <select
              name="migracaoDeDados"
              value={formData.migracaoDeDados}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Homologação Boleto:</label>
            <select
              name="homologacaBoleto"
              value={formData.homologacaBoleto}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>

          <div className="col-md-4">
                      <label>Assinatura do Contrato de Prestação de Serviço:</label>
                      <select
                        name="assinaturaContratoDePrestacaoDeServico"
                        value={formData.assinaturaContratoDePrestacaoDeServico}
                        onChange={handleChange}
                        className="form-select border border-info"
                      >
                        <option value="">Selecione</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>



          <div className="col-md-6">
            <label>Quais Dados a Migrar:</label>
            <select multiple
              name="quaisDadosAmigrar"
              value={formData.quaisDadosAmigrar}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Clientes">Clientes</option>
              <option value="Produtos">Produtos</option>
              <option value="Fornecedores">Fornecedores</option>
              <option value="SPED (Entradas)">SPED (Entradas)</option>
              <option value="SPED (Saídas)">SPED (Saídas)</option>
              <option value="SPED (Clientes)">SPED (Clientes)</option>
              <option value="SPED (Fornecedores)">SPED (Fornecedores)</option>
              <option value="SPED (Produtos)">SPED (Produtos)</option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Responsabilidade do Cliente:</label>
            <select multiple
              name="responsabilidadeDoCliente"
              value={formData.responsabilidadeDoCliente}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Instalar Certificado Digital">Instalar Certificado Digital</option>
              <option value="Disponibilizar Informações Tributarias + CSC">Disponibilizar Informações Tributarias + CSC</option>
              <option value="Disponibilizar Anydesk do Servidor e Estações">Disponibilizar Anydesk do Servidor e Estações</option>
              <option value="Validar Informações Importadas">Validar Informações Importadas</option>
              <option value="Adicionar um item">Adicionar um item</option>
            </select>
          </div>




          <div className="col-md-6">
            <label>Módulos:</label>
            <select multiple
              name="modulos"
              value={formData.modulos}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Módulo ÁBACO VETOR">Módulo ÁBACO VETOR</option>
              <option value="Módulo Almoxarifado">Módulo Almoxarifado</option>
              <option value="Módulo Autoservice">Módulo Autoservice</option>
              <option value="Módulo Bussines View">Módulo Bussines View</option>
              <option value="Módulo Car Clean">Módulo Car Clean</option>
              <option value="Módulo Comercial">Módulo Comercial</option>
              <option value="ENTERPRISE COMMERCE Módulo Controle de Estoque">
                ENTERPRISE COMMERCE Módulo Controle de Estoque
              </option>
              <option value="ENTERPRISE SUPPLY Módulo CUIDADORES">
                ENTERPRISE SUPPLY Módulo CUIDADORES
              </option>
              <option value="Módulo de Consignação - ENTERPRISE CONSIGNMENT CONTRACT">
                Módulo de Consignação - ENTERPRISE CONSIGNMENT CONTRACT
              </option>
              <option value="Módulo E-Commerce">Módulo E-Commerce</option>
              <option value="Módulo Emissor Nota Fiscal Eletrônica - ENTERPRISE NF-e">
                Módulo Emissor Nota Fiscal Eletrônica - ENTERPRISE NF-e
              </option>
              <option value="Módulo Emissor Nota Fiscal Serviço - ENTERPRISE NFS-e">
                Módulo Emissor Nota Fiscal Serviço - ENTERPRISE NFS-e
              </option>
              <option value="Módulo Enterprise Professional">Módulo Enterprise Professional</option>
              <option value="Módulo Estoquista - STOCKIST STORE">
                Módulo Estoquista - STOCKIST STORE
              </option>
              <option value="Módulo Expedição - ENTERPRISE EXPEDITION">
                Módulo Expedição - ENTERPRISE EXPEDITION
              </option>
              <option value="Módulo Financeiro - ENTERPRISE FINANCES">
                Módulo Financeiro - ENTERPRISE FINANCES
              </option>

              <option value="Módulo Fiscal - FISS SOFT">
                              Módulo Fiscal - FISS SOFT
              </option>
              <option value="Módulo Frente de Loja - ENTERPRISE STORE">
                         Módulo Frente de Loja - ENTERPRISE STORE
               </option>
               <option value="Módulo Industrial">
                         Módulo Industrial
               </option>
               <option value="Módulo Locação - RENTAL AGREEMENT">
                                        Módulo Locação - RENTAL AGREEMENT
               </option>
               <option value="Módulo MDF-e - Manifesto Eletrônico de Documentos">
                          Módulo MDF-e - Manifesto Eletrônico de Documentos
               </option>
              <option value="Módulo Mobile - ENTERPRISE POCKET">
                         Módulo Mobile - ENTERPRISE POCKET
               </option>
               <option value="Módulo Nota Fiscal Eletrônica ao Consumidor - ENTERPRISE NFC-e">
                         Módulo Nota Fiscal Eletrônica ao Consumidor - ENTERPRISE NFC-e
               </option>
               <option value="Módulo Ordem de Serviço">
                          Módulo Ordem de Serviço
               </option>
               <option value="Módulo Ordem de Serviço Mobile E-SERVICE">
                            Módulo Ordem de Serviço Mobile E-SERVICE
                </option>
                <option value="Módulo Power Cash Cloud  E-COMANDA">
                            Módulo Power Cash Cloud  E-COMANDA
                 </option>
                 <option value="Módulo Rota Web">
                                Módulo Rota Web
                 </option>
                 <option value="Nota Fiscal Eletonica ao Consumidor (àbaco)">
                                 Nota Fiscal Eletonica ao Consumidor (àbaco)
                  </option>
                  <option value="Customização">
                               Customização
                 </option>
                 <option value="Despesas de Hospedagem">
                           Despesas de Hospedagem
                </option>
                <option value="Geração de Arquivo SPED - Fiscal">
                           Geração de Arquivo SPED - Fiscal
               </option>
               <option value="Geração de Arquivo SPED - Pis/Cofins">
                           Geração de Arquivo SPED - Pis/Cofins
                </option>
                <option value="LICENÇA ENTERPRISE">
                           LICENÇA ENTERPRISE
               </option>
               <option value="Mensalidade - Locação (Demais Máquinas)">
                              Mensalidade - Locação (Demais Máquinas)
              </option>
               <option value="Mensalidade - Locação (Servidor)">
                              Mensalidade - Locação (Servidor)
                </option>

                 <option value="Treinamento Prático Presencial">
                          Treinamento Prático Presencial
                 </option>
                <option value="Treinamento Prático Presencial">
                             Treinamento Prático Presencial
                </option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Treinamento:</label>
            <select multiple
              name="treinamento"
              value={formData.treinamento}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="Tela Inicial">Tela Inicial</option>
              <option value="Backup">Backup</option>
              <option value="Cadastros">Cadastros</option>
              <option value="Entrada de NF - Pedido de Compra - Almoxarifado">
                Entrada de NF - Pedido de Compra - Almoxarifado
              </option>
              <option value="Comercial (Proposta, Loja, Ábaco) - NF-e , NFC-e">
                Comercial (Proposta, Loja, Ábaco) - NF-e , NFC-e
              </option>
              <option value="Devoluções e Cancelamentos">Devoluções e Cancelamentos</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Estoque">Estoque</option>
              <option value="Movimentações e Relatórios">Movimentações e Relatórios</option>
              <option value="Fiscal">Fiscal</option>
              <option value="Módulo Web">Módulo Web</option>
              <option value="Ordem de Serviço">Ordem de Serviço</option>
            </select>
          </div>


          <div className="col-md-4">
            <label>Configurações do Servidor:</label>
            <select
              name="configuracoesDoServidor"
              value={formData.configuracoesDoServidor}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="VPS SSD 01GB 1x vCPU 2.5 Ghz 30 GB">VPS SSD 01GB 1x vCPU 2.5 Ghz 30 GB</option>
              <option value="VPS SSD 02GB 1x vCPU 2.5 Ghz 50 GB">VPS SSD 02GB 1x vCPU 2.5 Ghz 50 GB</option>
              <option value="VPS SSD 03GB 2x vCPU 2.5 Ghz 100 GB">VPS SSD 03GB 2x vCPU 2.5 Ghz 100 GB</option>
              <option value="VPS SSD 04GB 4x vCPU 2.5 Ghz 150 GB">VPS SSD 04GB 4x vCPU 2.5 Ghz 150 GB</option>
              <option value="VPS SSD 08GB 6x vCPU 2.5 Ghz 200 GB">VPS SSD 08GB 6x vCPU 2.5 Ghz 200 GB</option>
              <option value="VPS SSD 16GB 8x vCPU 2.5 Ghz 300 GB">VPS SSD 16GB 8x vCPU 2.5 Ghz 300 GB</option>
            </select>
          </div>


          <div className="col-md-4">
            <label>Servidor em Nuvem em Cotação:</label>
            <select
              name="servidorEmNuvemEmCotacao"
              value={formData.servidorEmNuvemEmCotacao}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="COTAÇÃO INICIADA">COTAÇÃO INICIADA</option>
              <option value="COTAÇÃO CONCLUIDA">COTAÇÃO CONCLUIDA</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>Pagamento Realizado:</label>
            <select
              name="pagamento"
              value={formData.pagamento}
              onChange={handleChange}
              className="form-select border border-info"
            >
              <option value="">Selecione</option>
              <option value="SIM">SIM</option>
              <option value="NÃO">NÃO</option>
            </select>
          </div>


          <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-primary rounded-pill">
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
}
