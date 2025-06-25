"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PesquisaUsuarios() {
    const [tipoFiltro, setTipoFiltro] = useState("nome") // nome | idade | risco
    const [nome, setNome] = useState("")
    const [idadeMin, setIdadeMin] = useState("")
    const [idadeMax, setIdadeMax] = useState("")
    const [risco, setRisco] = useState("")
    const [pacientes, setPacientes] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get("http://localhost:8000/pacientes")
                setPacientes(data)
            } catch (error) {
                console.error("Erro ao carregar dados:", err);

            }
        }
        fetchData()
    }, [])

    const buscar = async () => {
        let res

        if (tipoFiltro === "nome" && nome) {
            res = await axios.get(`http://localhost:8000/paciente/getbyname/${nome}`)
        } else if (tipoFiltro === "idade" && idadeMin && idadeMax) {
            res = await axios.get(`http://localhost:8000/paciente/getbyage/${idadeMin}/${idadeMax}`)
        } else if (tipoFiltro === "risco" && risco) {
            res = await axios.get(`http://localhost:8000/paciente/getbyrisk/${risco}`)
        } else res = await axios.get(`http://localhost:8000/pacientes`)

        if (res) setPacientes(res.data)
    }

    return (
        <div className="container mx-auto px-10 py-4 space-y-6">
            <div className="flex justify-between w-full">
                <Link href={"/dashboard"} className="w-[60px]">
                    <FiArrowLeft className="w-10 h-fit" />
                </Link>

                <h1 className="text-3xl text-center font-bold">Pesquisa de Usuários</h1>

                <div className="w-10"/>
            </div>

            <div className="flex items-center gap-2">
                {/* Campo dinâmico */}
                {tipoFiltro === "nome" && (
                    <input
                        type="text"
                        placeholder="Digite o nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border focus:outline-none p-2 rounded w-full"
                    />
                )}

                {tipoFiltro === "idade" && (
                    <>
                        <input
                            type="number"
                            placeholder="Idade mínima"
                            value={idadeMin}
                            onChange={(e) => setIdadeMin(e.target.value)}
                            className="border focus:outline-none p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Idade máxima"
                            value={idadeMax}
                            onChange={(e) => setIdadeMax(e.target.value)}
                            className="border focus:outline-none p-2 rounded w-full"
                        />
                    </>
                )}

                {tipoFiltro === "risco" && (
                    <select
                        value={risco}
                        onChange={(e) => setRisco(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Selecione o risco</option>
                        <option value="Baixo">Baixo</option>
                        <option value="Médio">Médio</option>
                        <option value="Alto">Alto</option>
                    </select>
                )}

                {/* Seletor de filtro */}
                <div className="flex items-center bg-white gap-2 border-2 border-blue-800 p-2 rounded">
                    <FiFilter
                        className="w-6 h-fit text-blue-800"
                    />
                    <label className="font-medium">Filtro:</label>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="focus:outline-none"
                    >
                        <option value="nome">Nome</option>
                        <option value="idade">Idade</option>
                        <option value="risco">Risco</option>
                    </select>
                </div>

                {/* Botão de buscar */}
                <button
                    onClick={buscar}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>


            {/* Resultados */}
            <div className="space-y-2 mt-4">
                {
                    pacientes != null
                        ?
                        pacientes.map((paciente, i) => (
                            <div key={i} className="flex justify-between p-3 border rounded bg-gray-50">
                                <p className="w-1/4"><strong>Nome:</strong> {paciente.nome}</p>
                                <p className="w-1/4"><strong>Idade:</strong> {paciente.idade}</p>
                                <p className="w-1/4"><strong>Risco:</strong> {(paciente.fichas) ? paciente.fichas[0].risco : "Indefinido"}</p>
                                {(paciente.fichas) ?
                                    <button
                                        className="flex items-center gap-2 bg-green-700 text-white p-2 rounded-xl"
                                        onClick={() =>router.push(`/editForm/${paciente.cpf}`)}
                                    >
                                        <MdOutlineEdit />
                                        Editar Ficha
                                    </button>
                                    :
                                    <button
                                        className="flex items-center gap-2 bg-red-700 text-white p-2 rounded-xl"
                                    >
                                        <MdOutlineEdit />
                                        Sem registros
                                    </button>
                                }
                            </div>
                        ))
                        :
                        <p className=" text-center p-3 border rounded bg-gray-50">Nenhum paciente encontrado</p>
                }
            </div>
        </div>
    )
}