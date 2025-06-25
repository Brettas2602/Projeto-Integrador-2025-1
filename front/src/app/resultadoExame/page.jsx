"use client"

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ExamResult from "@/components/ExamResult";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResultadoExame() {
    const { paciente } = useUser();
    const [exames, setExames] = useState([]);
    const [message, setMessage] = useState("")
    const router = useRouter();

    useEffect(() => {
        if (!paciente) {
            router.replace("/loginPaciente");
        }
    }, [paciente]);

    useEffect(() => {
        async function fetchExames() {
            if (paciente?.id) {
                try {
                    const { data } = await axios.get(`http://localhost:8000/paciente/resultadosbyid/${paciente.id}`);
                    setExames(data);
                } catch (error) {
                    console.error("Erro ao buscar exames:", error);
                }
            }
        }
        fetchExames();
    }, [paciente]);



    return (
        <div className="w-full h-screen text-xl xs:text-2xl">
            <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3 font-semibold">
                <Link href={"/dashboardPaciente"} className="w-[60px]">
                    <FiArrowLeft className="w-10 h-fit"/>
                </Link>

                <p>
                    Resultado <br />
                    do exame
                </p>

                <img src="/Logo_SobreVidas_Sem_Fundo.png" alt="Logo ou imagem decorativa" className="w-24 h-auto" />
            </section>

            <div className="w-full flex flex-col items-center mt-7 gap-6 ">

                {
                    (exames)?
                    exames.map((exame, index) =>(
                    <ExamResult exam={exame} key={index} />
                    )) :
                    <p>Não há resultados de exames.</p>
                }
                
            </div>

        </div>
    )
}