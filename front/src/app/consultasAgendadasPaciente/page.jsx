"use client"

import { useUser } from "@/context/userContext";
import axios from "axios";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShowConsultation from "@/components/ShowConsultation";

export default function ConsultasAgendadasPaciente() {

    const { paciente } = useUser()
    const [consultas, setConsultas] = useState([])
    const router = useRouter()

    useEffect(() => {
        if (!paciente) {
            router.replace("/loginPaciente");
        }
    }, [paciente])

    useEffect(()=>{
        async function fetchConsulta() {
            if (paciente?.id) {
                try {
                    const { data: res } = await axios.get(`http://localhost:8000/paciente/getallconsultasbyid/${paciente.id}`)
                    setConsultas(res)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchConsulta()
    }, [paciente])
    
    return (
        <div className="w-full min-h-screen bg-[#FFF1F1] text-xl xs:text-2xl flex flex-col items-center">
            <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3 font-semibold">
                <Link href={"/dashboardPaciente"} className="w-[60px]">
                    <FiArrowLeft className="w-10 h-fit" />
                </Link>
                <p className="text-center">
                    Agendamento <br />
                    de consulta
                </p>
                <img
                    src="/Logo_SobreVidas_Sem_Fundo.png"
                    alt="Logo ou imagem decorativa"
                    className="w-24 h-auto"
                />
            </section>

            <div className="w-[90%] flex flex-col items-center flex-wrap xm:flex-row xm:justify-center ">

                {
                    (consultas)?
                    consultas.map((consulta, index) => (
                        <ShowConsultation consulta = {consulta} key= {index}></ShowConsultation>
                    ))
                    :
                    <p className="mt-7">Não há consultas agendadas.</p>    
                }

            </div>
            


        </div>
    )
}