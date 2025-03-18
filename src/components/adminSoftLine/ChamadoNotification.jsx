{/*
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const ChamadosNotification = () => {
    const [chamados, setChamados] = useState([]);

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws", // Conexão WebSocket
            reconnectDelay: 5000, // Tenta reconectar em caso de falha
            onConnect: () => {
                console.log("Conectado ao WebSocket");
                client.subscribe("/topic/chamados", (message) => {
                    if (message.body) {
                        setChamados((prevChamados) => [message.body, ...prevChamados]);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("Erro no STOMP", frame);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return (
        <div>
            <h2>Novos Chamados</h2>
            <ul>
                {chamados.map((chamado, index) => (
                    <li key={index}>{chamado}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChamadosNotification;
*/}