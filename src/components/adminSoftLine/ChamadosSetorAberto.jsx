import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom";

const ChamadosSetorAberto = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/nao-autorizado");
    } else {
      axios
        .get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/relatorio/statusAssuntosChamados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
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
        .catch((error) => {
          if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            navigate("/nao-autorizado");
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
    pointFormat: '{series.name}: <b>{point.y}</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y}",
        style: {
          fontSize: "1.2em",
          textOutline: "none",
        },
      },
      showInLegend: true,

legend: {
  labelFormatter: function () {
    return this.name;
  }
}


      
    },
  },
  series: [{
    name: "Quantidade",
    colorByPoint: true,
    data: [
      { name: "Suporte", y: chartData.suporte },
      { name: "Cobrança", y: chartData.cobranca },
      { name: "Comercial", y: chartData.comercial },
      { name: "Implantação", y: chartData.implantacao },
      { name: "Fiscal", y: chartData.fiscal },
      { name: "Customização", y: chartData.customizacao },
      { name: "Elogio", y: chartData.elogio },
      { name: "Outros", y: chartData.outros },
      { name: "Reclamação", y: chartData.reclamacao },
      { name: "Urgente", y: chartData.urgente },
      { name: "Visita Técnica", y: chartData.visitaTecnica },
      { name: "Treinamento", y: chartData.treinamento },
      { name: "Sugestão", y: chartData.sugestao },
      { name: "Cobrança Homologação", y: chartData.cobrancaHomologacao },
      { name: "Resolução de Erro", y: chartData.resolucaoDeErro }
    ]
  }]
};


  return (
    <div>
      <AdminHeaders />
      <h2 className="alert alert-info text-center" role="alert">
        Relatório de todos os chamados dos setores em aberto
      </h2>

      <div style={{ height: "400px" }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ChamadosSetorAberto;
