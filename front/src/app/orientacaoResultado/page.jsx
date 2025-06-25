"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import ExamOrientation from "@/components/ExamOrientation";
import axios from "axios";
import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrientacaoResultado() {
    const { paciente } = useUser();
    const [exames, setExames] = useState([]);
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
                    <FiArrowLeft className="w-10 h-fit" />
                </Link>

                <p className="text-center">
                    Orientação <br />
                    pós-resultado
                </p>

                <img
                    src="/Logo_SobreVidas_Sem_Fundo.png"
                    alt="Logo ou imagem decorativa"
                    className="w-24 h-auto"
                />
            </section>

            <div className="w-full flex flex-col items-center mt-7 gap-6">
                {(!exames) ?
                    <p>Não há orientações registradas.</p>
                    :
                    exames.map((exame, index) => (
                    <ExamOrientation exam={exame} key={index} />
                ))}
            </div>
        </div>
    );
}