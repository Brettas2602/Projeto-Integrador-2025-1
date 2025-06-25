"use client"

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import ShowConsultation from "@/components/ShowConsultation";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function ConsultasAgendadas() {
    const router = useRouter()
    const {medico, enfermeiro} = useUser()
    const [consultas, setConsultas] = useState([])

    useEffect(() => {
        if (!medico && !enfermeiro) {
            router.replace("/")
        }
    }, [])

    useEffect(() => {
        async function requestConsultas() {
            try {
                const { data } = await axios.get(`http://localhost:8000/consulta/getallconsultasagendadas`)
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

            <div className="w-[90%] flex justify-between flex-wrap m-auto">
                {(!consultas)?
                <p>Não há consultas agendadas</p>
                :
                consultas.map((consulta, index) => (
                <ShowConsultation consulta = {consulta} key= {index}></ShowConsultation>
                ))}
            </div>
        </div>
    )
}
