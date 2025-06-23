"use client"

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import ShowConsultation from "@/components/ShowConsultation";

export default function ConsultasAgendadas() {
    
    const [consultas, setConsultas] = useState([])

    useEffect(() => {
        async function requestConsultas() {
            try {
                const { data } = await axios.get(`http://localhost:8000/consulta/getallconsultas`)
                setConsultas(data)
                console.log(data)
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            }
        }
        requestConsultas();
    }, [])
    
    return (
        <div className="mx-auto w-full min-h-screen text-xl bg-wflex flex-col items-center">
            <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3 font-semibold">
                <Link href={"/dashboard"} className="w-[60px]">
                    <FiArrowLeft className="w-10 h-fit" />
                </Link>

                <p className="text-center"> Consultas <br />agendadas </p>

                <img src="/Logo_SobreVidas_Sem_Fundo.png" alt="Logo ou imagem decorativa" className="w-24 h-auto"/>
            </section>

            <div className="w-[90%] flex justify-between flex-wrap">
                {consultas.map((consulta, index) => (
                    <ShowConsultation consulta = {consulta} key= {index}></ShowConsultation>
                ))}
            </div>
        </div>
    )
}