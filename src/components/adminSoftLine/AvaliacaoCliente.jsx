import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import AdminHeaders from "../headers/AdminHeaders";
import { useNavigate } from "react-router-dom";

const AvaliacaoCliente = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState({
        excelente: 0,
        bom: 0,
        ruim: 0,
        regular: 0
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/nao-autorizado");
        } else {
            axios.get("https://chamados-softline-k3bsb.ondigitalocean.app/chamados/relatorio/avaliacaoSatisfacaoDoCliente", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const data = response.data;
                setChartData({
                    excelente: data.excelente || 0,
                    bom: data.bom || 0,
                    ruim: data.ruim || 0,
                    regular: data.regular || 0,
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

    // Calcula o total para normalização (opcional, dependendo do backend)
    const total = chartData.excelente + chartData.bom + chartData.ruim + chartData.regular;

    // Ajusta os dados para o gráfico
    const seriesData = [
        {
            name: "Excelente",
            y: chartData.excelente,
            color: '#28a745' // Verde
        },
        {
            name: "Bom",
            y: chartData.bom,
            color: '#17a2b8' // Azul
        },
        {
            name: "Regular",
            y: chartData.regular,
            color: '#ffc107' // Amarelo
        },
        {
            name: "Ruim",
            y: chartData.ruim,
            color: '#dc3545' // Vermelho
        }
    ];

    const options = {
        chart: {
            type: "pie",
        },
        title: {
            text: "Avaliação de Satisfação dos Clientes",
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}%</b><br/>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}%',
                    style: {
                        fontSize: "1em",
                        textOutline: "none",
                    },
                    distance: -30 // Coloca os labels dentro das fatias
                },
                showInLegend: true
            }
        },
        series: [{
            name: "Avaliação",
            colorByPoint: false, // Usamos cores customizadas
            data: seriesData
        }]
    };

    return (
        <div>
            <AdminHeaders />
            <h2 className="alert alert-info text-center" role="alert">
                Relatório de Avaliação dos Chamados
            </h2>
            <div style={{ height: "500px", padding: "20px" }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    containerProps={{ style: { height: "100%" } }}
                />
            </div>
        </div>
    );
};

export default AvaliacaoCliente;