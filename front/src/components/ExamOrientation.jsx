"use client"

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function ExamResult({ exam }) {
    const [mostrarPopup, setMostrarPopup] = useState(false);

    return (
        
        <div className="w-full flex justify-center">

            <div onClick={() => setMostrarPopup(true)} className="bg-[#FFF1F1] w-4/5 p-4 rounded-xl flex justify-between shadow-md shadow-blue-500">
                <div>
                    <p>Exame citopatológico </p>
                    <p>{exam.data_resultado}</p>
                </div>

                <Link href={""}  className="self-center">
                    <FaArrowRight className="w-8 h-fit" />
                </Link>
                
            </div>

            {mostrarPopup &&(
            <div className="w-full h-screen bg-[#FFF1F1] flex flex-col fixed top-0 left-0 overflow-y-auto pb-8"> 

                <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3 font-semibold">
                    <button onClick={()=>setMostrarPopup(false)} className="w-[60px]">
                        <FiArrowLeft className="w-10 h-fit" />
                    </button>
                    <p>
                        Orientação <br />
                        pós-resultado
                    </p>
                    <img
                        src="/Logo_SobreVidas_Sem_Fundo.png"
                        alt="Logo ou imagem decorativa"
                        className="w-24 h-auto"
                    />
                </section>

                <div className="w-full flex justify-center">
                    <div className="w-4/5 mt-7">
                        <p className="text-justify">{exam.observacoes_gerais}</p>
                    </div>
                </div>
                </div>
                )}
            </div>
            

        
    )
}