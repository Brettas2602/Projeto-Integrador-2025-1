import { useState, useEffect } from "react";
import axios from "axios";

export default function ShowConsultation({ consulta }) {
    const dataHora = new Date(consulta.data);
    const dataFormatada = dataHora.toLocaleDateString("pt-BR");
    const horaFormatada = dataHora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [paciente, setPaciente] = useState([])

    useEffect(() => {
        async function fetchPaciente() {
            try {
                const { data } = await axios.get(`http://localhost:8000/paciente/getbyid/${consulta.paciente_id}`)
                setPaciente(data)
            } catch (error) {
                console.error("Erro ao buscar paciente ", error)
            }
        }
        fetchPaciente();
    }, [])
    return (
        <div className="bg-white shadow-md shadow-gray-400 rounded-lg w-[330px] h-[140px] flex flex-col justify-center m-5 pl-5">
            <p>Nome: {paciente.nome}</p>
            <p>CPF: {paciente.cpf}</p>
            <p>Data: {dataFormatada}</p>
            <p>Horário: {horaFormatada}</p>
        </div>
    )
}