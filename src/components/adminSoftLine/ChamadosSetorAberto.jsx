
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate


 const  ChamadosSetorAberto = () =>{

const navigate = useNavigate(); // Hook para redirecionamento

  const [chartData, setChartData] = useState({
    suporte: 0,
    cobranca: 0,
    comercial: 0,
    implantacao: 0,
    fiscal: 0,
    customizacao: 0,
    elogio: 0,
    outros: 0,
    reclamacao: 0,
    urgente: 0,
    visitaTecnica: 0,
    treinamento: 0,
    sugestao: 0,
    cobrancaHomologacao: 0,
    resolucaoDeErro: 0

   
  });

{/*}
React.useEffect(() => {
  axios
    .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/relatorio/statusAssuntosChamados") // URL correta da API
    .then((response) => {
      const data = response.data; // Obtenha os dados diretamente
      setChartData({
        suporte: data.suporte || 0,
        cobranca: data.cobranca || 0,
        comercial: data.comercial || 0,
        implantacao: data.implantacao || 0,
        fiscal: data.fiscal || 0,
        customizacao: data.customizacao || 0,
        elogio: data.elogio || 0,
        outros: data.outros || 0,
        reclamacao: data.reclamacao || 0,
        urgente: data.urgente || 0,
        visitaTecnica: data.visitaTecnica || 0,
        treinamento: data.treinamento || 0,
        sugestao: data.sugestao || 0,
        cobrancaHomologacao: data.cobrancaHomologacao || 0,
        resolucaoDeErro: data.resolucaoDeErro || 0,

      });
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}, []);
*/}



  // Verifica se o usuário está autenticado ao carregar o componente
    useEffect(() => {
        const token = localStorage.getItem("token"); // Recupera o token do localStorage
        if (!token) {
            navigate("/nao-autorizado"); // Redireciona para a página de não autorizado
        } else {
            // Faz a requisição para carregar os dados do relatório
            axios
                .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/relatorio/statusAssuntosChamados", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                    },
                })
                .then((response) => {
                    const data = response.data; // Obtenha os dados diretamente
                    setChartData({
                        suporte: data.suporte || 0,
                        cobranca: data.cobranca || 0,
                        comercial: data.comercial || 0,
                        implantacao: data.implantacao || 0,
                        fiscal: data.fiscal || 0,
                        customizacao: data.customizacao || 0,
                    });
                })
                .catch((error) => {
                    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                        navigate("/nao-autorizado"); // Redireciona para a página de não autorizado
                    } else {
                        console.error("Erro ao carregar os dados:", error);
                    }
                });
        }
    }, [navigate]);








  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Relatório dos Status de todos os Chamados",
    },
    tooltip: {
      valueSuffix: "%",
    },
    plotOptions: {
      pie: { // Adicione "pie" aqui para configurar gráficos do tipo pizza
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}", // Exibe apenas o nome da categoria
          style: {
            fontSize: "1.2em",
            textOutline: "none",
          },
        },
      },
    },



    series: [
      {
        name: "Porcentagem",
        colorByPoint: true,
        data: [
          {
            name: "Chamados de Suporte",
            y: chartData.suporte,
          },
          {
            name: "Chamados de cobrança",
            sliced: true,
            selected: true,
            y: chartData.cobranca,
          },
          {
            name: "Chamados de comercial",
            y: chartData.comercial,
          },

           {
              name: "Chamados de implantacao",
              y: chartData.implantacao,
           },

        {
                     name: "Chamados de fiscal",
                     y: chartData.fiscal,
        },

     {
                  name: "Chamados de customizacao",
                  y: chartData.customizacao,
     },

     {
                   name: "Elogios",
                   y: chartData.elogio,
      },

        {
                     name: "Outros",
                     y: chartData.outros,
        },

        {
                         name: "Reclamações",
                         y: chartData.reclamacao,
        },

        {
                         name: "Urgente",
                         y: chartData.urgente,
        },

        {
                             name: "Visita Técnica",
                             y: chartData.visitaTecnica,
        },
       {
                                 name: "Treinamentos",
                                 y: chartData.treinamento,
       },

      {
                                name: "Sugestões",
                                y: chartData.sugestao,
      },

     {
                               name: "Cobrança Homologação",
                               y: chartData.cobrancaHomologacao,
     },

     {
                                name: "Resolução de Erro",
                                y: chartData.resolucaoDeErro,
      },

         

        ],
      },
    ],
  };

  return (
    <div>
        <AdminHeaders />
        <h2 className="alert alert-info text-center" role="alert">Relatório de todos os chamados dos setores em aberto</h2>



      {/* Highcharts */}
      <div style={{ height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ChamadosSetorAberto;

