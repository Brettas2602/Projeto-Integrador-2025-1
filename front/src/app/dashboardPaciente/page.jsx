"use client";

import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { IoHelpCircleOutline } from "react-icons/io5";
import { TbCalendarMonth } from "react-icons/tb";
import { BsCardChecklist } from "react-icons/bs";
import { SlUserFemale } from "react-icons/sl";
import { CgFileDocument } from "react-icons/cg";
import { MdAddLocation } from "react-icons/md";
import { useUser } from "@/context/userContext";
import { useState, useEffect } from "react";

const diasDaSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
const diasDoMes = Array.from({ length: 30 }, (_, i) => i + 1);

export default function DashboardPaciente() {
    const { paciente } = useUser();
    const [message, setMessage] = useState("")

    useEffect(() => {
        const mensagem = localStorage.getItem("mensagemConsulta");
        if (mensagem) {
            setMessage(mensagem);
            localStorage.removeItem("mensagemConsulta"); 
    }
}, []);
    return (
            <div className="w-full">
                <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3">
                    <FiMenu className="w-10 lg:w-12 h-fit lg:mr-16" />

                    <div className="flex flex-col items-center">
                    <img
                        src="/Logo_SobreVidas_Sem_Fundo.png"
                        alt="Logo ou imagem decorativa"
                        className="w-24 h-auto"
                    />
                    </div>

                    <div className="flex items-center gap-4">
                    <IoHelpCircleOutline className="w-12 lg:w-16 h-fit" />
                    </div>
                </section>

                <div className="w-[90%] mx-auto flex flex-col items-center px-2 mt-10 gap-7">
                        {message && (
                            <p className="text-green-600 bg-green-100 p-1 rounded-md">{message}</p>
                        )}
                    <div className="flex justify-between w-full gap-x-6">
                    
                        <div className="gap-7 w-1/2 flex flex-col items-center justify-start">
                        
                            <Link href={"/agendarConsulta"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-start justify-start 
                            px-4 py-3 shadow-md shadow-blue-500">
                            <TbCalendarMonth className="w-16 h-fit mb-2" />
                            <p className="w-fit whitespace-normal">Agendar consulta</p>
                            </Link>

                            <Link href={"/resultadoExame"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-start justify-start px-4 py-3 shadow-md shadow-blue-500">
                            <BsCardChecklist className="w-16 h-fit mb-2" />
                            <p className="w-fit whitespace-normal">Resultados de exames</p>
                            </Link>
                        
                        </div>

                        <div className="w-1/2 flex justify-end">
                        
                            <div className="bg-[#FFF1F1] w-[90%] h-[308px] xs:h-[348px] rounded-xl text-2xl flex flex-col items-center justify-between py-3 shadow-md shadow-blue-500 gap-4">
                                <SlUserFemale className="w-16 h-fit mt-2" />
                                {paciente?.nome && (
                                    <p className="px-3 py-1.5 border border-[#B56AAA] rounded-xl text-xl">
                                    {paciente.nome}</p>
                                )}  

                                <div className="w-full flex flex-col items-center text-sm">
                                    <div className="grid grid-cols-7 w-[95%] text-center font-semibold border-[0.5px] border-[#b9b9b9]">
                                        {diasDaSemana.map((dia, idx) => (
                                        <div key={idx} className="text-[#B56AAA] py-1">
                                            {dia}
                                        </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 w-[95%] text-center text-gray-700 text-xs">
                                        {diasDoMes.map((dia) => (
                                        <div
                                            key={dia}
                                            className="border-[0.5px] border-[#b9b9b9] py-1 hover:bg-[#E3C7EB] cursor-pointer"
                                        >
                                            {dia}
                                        </div>
                                        ))}
                                </div>
                            </div>
                    </div>
                    
                    </div>
                </div>
                
                <div className="flex justify-between w-full gap-x-6">
                    
                    <div className="w-1/2 flex justify-center items-center"> 
                    
                    <Link href={"orientacaoResultado"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-start justify-start px-1 py-3 shadow-md shadow-blue-500">
                    <CgFileDocument className="w-16 h-fit mb-2 ml-2" />
                    <p className="w-fit whitespace-normal">Orientações recebidas</p>
                    </Link>
                    
                    </div>
                    
                    <div className="w-1/2 flex justify-end items-center">
                    
                    <button className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-start justify-start px-4 py-3 shadow-md shadow-blue-500">
                    <MdAddLocation className="w-16 h-fit mb-2" />
                    <p className="w-fit whitespace-normal">Localizar UBS</p>
                    </button>
                    
                    </div>
                    </div>
                </div>
            </div>
    );
    }
