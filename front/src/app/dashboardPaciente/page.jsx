"use client";

import Link from "next/link";
import { IoHelpCircleOutline } from "react-icons/io5";
import { TbCalendarMonth } from "react-icons/tb";
import { BsCardChecklist } from "react-icons/bs";
import { SlUserFemale } from "react-icons/sl";
import { CgFileDocument } from "react-icons/cg";
import { MdEventAvailable } from "react-icons/md";
import { useUser } from "@/context/userContext";
import { useRef, useState, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation"

export default function DashboardPaciente() {
    const router = useRouter()
    const { paciente, logout } = useUser();
    const [message, setMessage] = useState("")

    function handleLogout() {
        if (paciente) {
            logout("paciente")
            router.replace("/loginPaciente")
        }
    }

    useEffect(() => {
        const mensagem = localStorage.getItem("mensagemConsulta");
        if (mensagem) {
            setMessage(mensagem);
            localStorage.removeItem("mensagemConsulta");
        }
    }, []);


    const calendarRef = useRef(null);

    useEffect(() => {
        const calendar = new Calendar(calendarRef.current, {
            plugins: [dayGridPlugin, interactionPlugin],
            locale: ptBrLocale,
            initialView: "dayGridMonth",
            height: "auto",
            expandRows: true,
            fixedWeekCount: false,
            headerToolbar: {
                left: 'title',
                center: '',
                right: 'prev,next'
            },
        });

        calendar.render();

        return () => calendar.destroy();
    }, []);

    return (
        <div className="w-full">
            <section className="bg-[#FFD8D8] w-full flex items-center justify-between px-5 py-3">
                <IoHelpCircleOutline className="w-12 lg:w-16 h-fit cursor-pointer" />

                <div className="flex flex-col items-center">
                    <img
                        src="/Logo_SobreVidas_Sem_Fundo.png"
                        alt="Logo ou imagem decorativa"
                        className="w-24 h-auto"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <IoIosLogOut className="w-9 lg:w-12 h-fit cursor-pointer" onClick={handleLogout} />
                </div>
            </section>

            <div className="w-[90%] mx-auto flex flex-col items-center px-2 mt-10 gap-7">
                {message && (
                    <p className="text-green-600 bg-green-100 p-1 rounded-md">{message}</p>
                )}
                <div className="flex justify-between w-full gap-x-6">

                    <div className="gap-7 w-1/2 flex flex-col items-center justify-start">

                        <Link href={"/agendarConsulta"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-center justify-start 
                            px-4 py-3 shadow-md shadow-blue-500">
                            <TbCalendarMonth className="w-16 h-fit mb-2" />
                            <p className="w-fit whitespace-normal">Agendar consulta</p>
                        </Link>

                        <Link href={"/resultadoExame"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-center justify-start px-4 py-3 shadow-md shadow-blue-500">
                            <BsCardChecklist className="w-16 h-fit mb-2" />
                            <p className="w-fit whitespace-normal">Resultados de exames</p>
                        </Link>

                    </div>

                    <div className="w-1/2 flex justify-end">

                        <div className="bg-[#FFF1F1] w-[90%] h-[308px] xs:h-[348px] rounded-xl text-2xl flex flex-col items-center pt-3 shadow-md justify-evenly shadow-blue-500">
                            <SlUserFemale className="w-16 h-fit" />
                            <div className="w-full flex flex-col items-center text-sm">
                                <div ref={calendarRef} className="w-[95%] text-[10px] font-semibold" />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex justify-between w-full gap-x-6">

                    <div className="w-1/2 flex justify-center items-center">

                        <Link href={"orientacaoResultado"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-center justify-start px-1 py-3 shadow-md shadow-blue-500">
                            <CgFileDocument className="w-16 h-fit mb-2 ml-2" />
                            <p className="w-fit whitespace-normal">Orientações recebidas</p>
                        </Link>

                    </div>

                    <div className="w-1/2 flex justify-end items-center">

                        <Link href={"/consultasAgendadasPaciente"} className="bg-[#FFF1F1] w-[90%] h-[140px] xs:h-[160px] rounded-xl text-2xl flex flex-col items-center justify-start px-4 py-3 shadow-md shadow-blue-500">
                            <MdEventAvailable className="w-16 h-fit mb-2" />
                            <p className="w-fit whitespace-normal">Consultas Agendadas</p>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}