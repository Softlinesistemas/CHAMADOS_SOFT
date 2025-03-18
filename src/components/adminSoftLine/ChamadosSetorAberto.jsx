
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import AdminHeaders from "../headers/AdminHeaders";

 const  ChamadosSetorAberto = () =>{

  const [chartData, setChartData] = useState({
    suporte: 0,
    cobranca: 0,
    comercial: 0,
    implantacao: 0,
    fiscal: 0,
    customizacao: 0
  });

React.useEffect(() => {
  axios
    .get(`${process.env.APP_URL}chamados/relatorio/statusAssuntosChamados`) // URL correta da API
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
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}, []);

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

