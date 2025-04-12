import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom";

const RelatorioStatusChamados = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState({
        emAndamento: 0,
        emFaseDeTeste: 0,
        resolvido: 0,
        analise: 0,
        aberto: 0,
        pendente: 0,
        atualizar: 0
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/nao-autorizado");
        } else {
            axios.get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/relatorio/statusDosChamados", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const data = response.data;
                setChartData({
                    emAndamento: data.EmAndamento || 0,
                    emFaseDeTeste: data.EmFaseDeTeste || 0,
                    resolvido: data.Resolvido || 0,
                    analise: data.EmAnalise || 0, // Corrigido para manter consistência
                    aberto: data.aberto || 0,
                    pendente: data.pendente || 0,
                    atualizar: data.atualizar || 0,
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
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: {
                        fontSize: "1.2em",
                        textOutline: "none",
                    },
                },
            },
        },
        series: [{
            name: "Porcentagem",
            colorByPoint: true,
            data: [
                { name: "Chamados em Andamento", y: chartData.emAndamento },
                { name: "Chamados em Fase de Teste", y: chartData.emFaseDeTeste },
                { name: "Chamados Resolvidos", y: chartData.resolvido },
                { name: "Chamados em Análise", y: chartData.analise },
                { name: "Chamados em Aberto", y: chartData.aberto },
                { name: "Chamados Pendentes", y: chartData.pendente },
                { name: "Chamados para atualizar", y: chartData.atualizar }
            ]
        }]
    };

    return (
        <div>
            <AdminHeaders />
            <h2 className="alert alert-info text-center" role="alert">
                Relatório dos Status de todos os chamados
            </h2>
            <div style={{ height: "400px" }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </div>
    );
};

export default RelatorioStatusChamados;
