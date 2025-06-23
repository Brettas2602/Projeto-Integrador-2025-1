"use client"

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import FullCalendar from "@/components/FullCalendar";


export default function AgendarConsulta() {
    const { paciente } = useUser();
    const router = useRouter();
    const [message, setMessage] = useState("")
    const [ubsList, setUbsList] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
    const [horarioSelecionado, setHorarioSelecionado] = useState("");
    const [diaSelecionado, setDiaSelecionado] = useState("");

    useEffect(() => {
        document.body.style.overflow = mostrarPopup ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mostrarPopup]);

    useEffect(() => {
        if (!paciente) {
            router.replace("/loginPaciente");
        }
    }, [paciente]);

    function formatarData(dataStr) {
        if (!dataStr) return "";
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    useEffect(() => {
        async function fetchUbs() {
            try {
                const { data } = await axios.get(`http://localhost:8000/ubs/getallubs`)
                setUbsList(data)
            } catch (error) {
                console.error("Erro ao buscar UBS:", error);
            }
        }
        fetchUbs();
    }, [])

    async function checkDataConsulta() {
        if (!(unidadeSelecionada && diaSelecionado && horarioSelecionado)){
            setMessage("Os dados não estão preenchidos corretamente.")
            return;
        }
        try {
            const dataCompleta = new Date(`${diaSelecionado}T${horarioSelecionado}`);
            const response = await axios.post("http://localhost:8000/consulta/createconsulta", {
                paciente_id: paciente?.id,
                ubs_id: Number(unidadeSelecionada),
                data: dataCompleta.toISOString(),
            });
            localStorage.setItem("mensagemConsulta", "Consulta marcada com sucesso!");
            setMostrarPopup(false);
            router.replace("dashboardPaciente")
        } catch (error) {
            console.error("Erro ao marcar consulta:", error);
            setMessage("Erro ao marcar consulta.");
        }
    }


    const nomeUbsSelecionada = ubsList.find((u) => u.id === Number(unidadeSelecionada))?.nome;

    return (
        <div className="w-full min-h-screen bg-[#FFF1F1] text-xl xs:text-2xl">
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

            <div className="w-full flex flex-col mt-[25px] items-start gap-4">
                <label className="ml-[20px]">Unidade:</label>
                <select className="bg-transparent border-[2px] border-[#6f6e6e] p-1 rounded-xl text-[#6f6e6e] outline-none ml-[25px] mb-[15px" value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)}>

                    <option value="">Selecione uma unidade</option>
                    {ubsList.map((ubs) => (
                        <option key={ubs.id} value={ubs.id}>
                            {ubs.nome}
                        </option>
                    ))}

                </select>

                <label className="ml-[20px]">Selecione o dia:</label>
                <div className="h-auto w-[80%] bg-[#e3e2e2] flex flex-col items-center p-3 rounded-xl shadow-md shadow-blue-600 self-center">
                    <FullCalendar onDateSelect={(data) => setDiaSelecionado(data)} setMessage={setMessage}/>
                    
                    {message && (
                        <p className="text-red-500 bg-red-100 p-1 rounded-md mt-4 text-xs">{message}</p>
                    )}
                </div>

                <label className="mt-[25px] ml-[20px]">Horários disponíveis:</label>
                <select className="bg-transparent border-[2px] border-[#6f6e6e] p-1 rounded-xl text-[#6f6e6e] outline-none ml-[25px] mb-[20px]" value={horarioSelecionado} onChange={(e) => setHorarioSelecionado(e.target.value)}>
                    <option value="">Selecione um horário</option>
                    <option value="08:00">08:00</option>
                    <option value="08:30">08:30</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                    <option value="15:30">15:30</option>
                    <option value="16:00">16:00</option>
                    <option value="16:30">16:30</option>
                    <option value="17:00">17:00</option>
                </select>

                <button onClick={() => setMostrarPopup(true)} className="self-center mt-[15px] p-2 bg-[#3550BD] text-white rounded-xl" id="consulta" >
                    Marcar Consulta
                </button>

                {mostrarPopup && (
                    <div className="w-full h-screen bg-[#cfcfcf] bg-opacity-55 fixed top-0 left-0 flex justify-center items-center z-[9999]" id="fundo">
                        <div className="w-[75%] min-h-[50%] bg-[#FFF1F1] px-4 gap-6 flex flex-col justify-center rounded-2xl py-4">
                            <p>
                                Data de realização: <br />
                                {diaSelecionado ? formatarData(diaSelecionado) : "Não selecionado"}
                            </p>

                            <p>
                                Horário de realização: <br />
                                {horarioSelecionado || "Não selecionado"}
                            </p>

                            <p>
                                Ubs para realização do exame: <br />
                                {nomeUbsSelecionada || "Não selecionada"}
                            </p>

                            {message && (
                                <p className="text-red-500 bg-red-100 p-1 rounded-md">{message}</p>
                            )}

                            <div className="w-[90%] flex justify-between self-center mt-[20px]">
                                <button onClick={() => { setMostrarPopup(false); setMessage("") }} className="bg-[#F03636] text-white rounded-xl py-1 px-4" >
                                    Voltar
                                </button>
                                <button className="bg-[#25943E] text-white rounded-xl py-1 px-4" onClick={checkDataConsulta}>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
