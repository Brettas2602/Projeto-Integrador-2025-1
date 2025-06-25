"use client";

import { IoHelpCircleOutline } from "react-icons/io5"
import { CiMedicalClipboard } from "react-icons/ci";
import { MdScreenSearchDesktop } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import Chart from "react-google-charts";
import RecentPacient from "@/components/RecentPacient";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation"
import { IoIosLogOut } from "react-icons/io";

export default function Dashboard() {
    const router = useRouter()
    const { medico, enfermeiro, logout } = useUser()
    const [pacientes, setPacientes] = useState([])
    const [consultasPendentes, setConsultasPendentes] = useState()
    const [donutChartData, setDonutChartData] = useState([
        ["Nível de risco", "Número de pacientes"],
        ["Alto", 0],
        ["Médio", 0],
        ["Baixo", 0]
    ]);
    const [barChartData, setBarChartData] = useState([
        ["Mês", "Número de consultas"]
    ])

    function handleLogout() {
        if (medico) {
            logout("medico")
            router.replace("/")
        } else if (enfermeiro) {
            logout("enfermeiro")
            router.replace("/")
        }
    }

    useEffect(() => {
        if (!medico && !enfermeiro) {
            router.replace("/")
        }
    }, [])

    useEffect(() => {
        const fetchData =
            async () => {
                try {
                    const res = await axios.get("http://localhost:8000/paciente/getcountbyrisk");
                    const { data: resPaciente } = await axios.get("http://localhost:8000/paciente/getlastfour");
                    const { data: consultasPorMes } = await axios.get("http://localhost:8000/consulta/getcountconsultasbyallmonths")
                    const { data: consultasCompletas } = await axios.get(`http://localhost:8000/consulta/getallconsultasagendadas`)
                    console.log(consultasCompletas)
                    setConsultasPendentes(consultasCompletas)
                    setPacientes(resPaciente)

                    const riscos = {
                        "Alto": 0,
                        "Médio": 0,
                        "Baixo": 0
                    };

                    res.data.forEach(item => {
                        if (item.risco === "Alto") riscos["Alto"] = item.quantidade;
                        if (item.risco === "Médio") riscos["Médio"] = item.quantidade;
                        if (item.risco === "Baixo") riscos["Baixo"] = item.quantidade;
                    });

                    setDonutChartData([
                        ["Nível de risco", "Número de pacientes"],
                        ["Alto", riscos["Alto"]],
                        ["Médio", riscos["Médio"]],
                        ["Baixo", riscos["Baixo"]]
                    ]);

                    const consultas = [
                        ["Mês", "Número de consultas"]
                    ]
                    if (consultasPorMes) {
                        consultasPorMes.forEach((item) => {
                            consultas.push([item.mes, item.total_consultas])
                        })
    
                        setBarChartData(consultas)
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados:", error);
                }
            };

        fetchData();
    }, []);

    return (
        <div className="w-full bg-[#F9F5F5] flex flex-col">
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

            <section className="min-h-[90vh] grid gap-5 px-8 py-5 justify-items-center">

                <div className="flex justify-between items-center flex-wrap ldx:items-stretch flex-row w-[95%] sm:w-[90%] ldx:w-full gap-4 ldx:gap-0">

                    <div className="w-full ldx:w-[35%] flex flex-col justify-between gap-4">
                        <Link
                            href={"/form"}
                            className="hover:scale-[1.06] transition w-full flex items-center px-5 py-3 gap-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg"
                        >
                            <CiMedicalClipboard className="w-12 h-fit" />
                            Preencher ficha citopatológica
                        </Link>

                        <Link
                            href={"/pesquisaPacientes"}
                            className="hover:scale-[1.06] transition w-full flex items-center px-5 py-3 gap-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg"
                        >
                            <MdScreenSearchDesktop className="w-12 h-fit" />
                            Consultar pacientes cadastrados
                        </Link>

                        <Link href={"/consultasAgendadas"} className="hover:scale-[1.06] transition w-full flex items-center px-5 py-3 gap-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg">
                            <ImStatsDots className="w-12 h-fit" />
                            Consultas Agendadas
                        </Link>
                    </div>

                    <div className="w-full xml:w-[64%] md:w-[67%] ldx:w-[35%] flex flex-col justify-between px-5 py-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg">
                        <p>Pacientes recentes</p>

                        {
                            (pacientes.map((p, i) => (
                                <RecentPacient pacientData={p} key={i} />
                            )))
                        }
                    </div>

                    <div className="w-full xml:w-[30%] ldx:w-[20%] flex flex-col p-9 xml:p-7 sm:p-[25px] gap-3 items-center text-xl bg-white shadow-md shadow-gray-400 rounded-lg  ">
                        <p>Consultas pendentes</p>
                        <div className="h-full flex justify-center items-center aspect-square border-4 border-[#D9D9D9] rounded-full xml:p-5 sm:p-[10px] ldx:p-0">
                            <p className="text-[#D9D9D9] text-6xl p-5 xml:text-7xl xml:p-0 sm:text-8xl">
                                {
                                    consultasPendentes
                                    ?
                                    consultasPendentes.length
                                    :
                                    0
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-[95%] sm:w-[90%] ldx:w-full flex justify-between flex-wrap gap-5 pb-5">

                    <div className="w-[100%] ldx:w-[35%] px-5 py-3 flex flex-col gap-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg">
                        <p>Pacientes por nível de risco</p>
                        <div className="flex justify-start ld:justify-evenly text-lg flex-wrap text-left">
                            <div className="flex items-center gap-3 px-4">
                                <div className="w-8 h-3 bg-[#4CAF50]" />
                                Baixo
                            </div>

                            <div className="flex items-center gap-3 px-4">
                                <div className="w-8 h-3 bg-[#FFC107]" />
                                Médio
                            </div>

                            <div className="flex items-center gap-3 px-4">
                                <div className="w-8 h-3 bg-[#F44236]" />
                                Alto
                            </div>
                        </div>
                        <Chart
                            className="mt-3"
                            chartType="PieChart"
                            data={donutChartData}
                            options={{
                                pieHole: 0.6,
                                pieSliceText: "none",
                                legend: "none",
                                chartArea: {
                                    width: "100%",
                                    height: "100%"
                                },
                                colors: ["#F44236", "#FFC107", "#4CAF50"]
                            }}
                            width={"100%"}
                        />
                    </div>

                    <div className="w-[60%] hidden ldx:flex flex-col px-5 pt-3 text-xl bg-white shadow-md shadow-gray-400 rounded-lg">
                        <p>Número de consultas por mês</p>
                        <Chart
                            chartType="ColumnChart"
                            data={barChartData}
                            options={{
                                legend: "none",

                            }}
                            width={"100%"}
                            height={"100%"}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}