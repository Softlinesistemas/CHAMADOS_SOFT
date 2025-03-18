
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const ChamadosEmAberto = () => {
  const [chartData, setChartData] = useState({
    suporte: 0,
    fiscal: 0,
    cobranca: 0,
    customizacao: 0,
    implantacao: 0,
    comercial: 0
  });

React.useEffect(() => {
  axios
    .get(`${process.env.APP_URL}chamados/relatorio/statusAssuntosChamados`) // URL correta da API
    .then((response) => {
      const data = response.data; // Obtenha os dados diretamente
      setChartData({
        suporte: data.suporte || 0,
        fiscal: data.fiscal || 0,
        cobranca: data.cobranca || 0,
        customizacao: data.customizacao || 0,
        implantacao: data.implantacao || 0,
        comercial: data.comercial || 0,
      });
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}, []);

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Relatório dos chamados em aberto de acordo com o setor",
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
            name: "Suporte",
            y: chartData.suporte,
          },
          {
            name: "Fiscal",
            sliced: true,
            selected: true,
            y: chartData.fiscal,
          },
          {
            name: "Cobrança",
            y: chartData.cobranca,
          },

           {
              name: "Customização",
              y: chartData.customizacao,
           },

           {
            name: "Implantação",
            y: chartData.implantacao,
         },

         {
          name: "Comercial",
          y: chartData.comercial,
       },

        ],
      },
    ],
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Página Inicial
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Highcharts */}
      <div style={{ height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ChamadosEmAberto;

