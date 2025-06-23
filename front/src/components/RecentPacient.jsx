"use client"

import { HiOutlineUserCircle } from "react-icons/hi2";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentPacient({ pacientData }) {
    const [dataFormatada, setDataFormatada] = useState("")
    const [risco, setRisco] = useState("")
    
    useEffect(() => {
        async function  fetchConsulta() {
            try {
                const { data: dataConsulta } = await axios.get(`http://localhost:8000/paciente/getlastconsultationbyid/${pacientData.id}`)
                const { data: fichaCitopatologica } = await axios.get(`http://localhost:8000/paciente/getlastfichawhithriskbyid/${pacientData.id}`)

                if (dataConsulta && dataConsulta.data) {
                    const dataHora = new Date(dataConsulta.data);
                    const dataFormatada = dataHora.toLocaleDateString("pt-BR");
                    setDataFormatada(dataFormatada)
                } else {
                    setDataFormatada("sem registro")
                }

                if (fichaCitopatologica && fichaCitopatologica.risco) {
                    setRisco(fichaCitopatologica.risco)
                }

            } catch (error) {
                console.error(error)
            }
        }
        fetchConsulta();
    }, [])

    let color;

    if (risco == "Baixo") {
        color = "#4CAF50"
    }else if (risco == "Médio") {
        color = "#FFC107"
    }else if (risco == "Alto"){
        color = "#F44236"
    } else {
        color = "#B0B0B0"
    }

    return(
        <div className="flex justify-between items-center border-b-2 border-[#D9D9D9]">
            <div className="flex gap-3 items-center">
                <HiOutlineUserCircle className="w-10 h-fit"/>
                
                <div className="text-lg">
                    <p>{pacientData.nome}</p>
                    
                    <p className="text-sm">Última consulta: {dataFormatada}</p>
                </div>
            </div>

            <div className="size-6 rounded-full" style={{backgroundColor: color}}/>
        </div>
    )
}