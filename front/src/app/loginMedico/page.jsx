"use client"

import Link from "next/link";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation"
import { useUser } from "@/context/userContext";

export default function LoginMedico() {

    const [cpf, setCpf] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const {medico, setMedico} = useUser()

    const router = useRouter()

    useEffect(() => {
        if (medico) router.replace("dashboard")
    }, [])

    async function checkUserData() {
        try {
            const { data } = await axios.get(`http://localhost:8000/medico/${cpf}`)
            const { senha: userPassword, cpf: userCPF } = data
            
            if (userPassword != password || userCPF != cpf) {
                setMessage("Usuário ou senha incorretos")
                return
            }

            setMedico(data)
    
            router.replace("dashboard")
        } catch {
            setMessage("Usuário ou senha incorretos")
            return
        }
    }

    return (
        <div className="max-w-screen-md mx-auto w-full h-screen flex justify-center items-center px-2">
            
            <div className="bg-white w-11/12 xs:w-3/4 xm:w-3/5 sm:w-2/4 flex flex-col items-center rounded-xl gap-7 px-5 py-7 shadow-2xl text-base sm:text-xl">
            
                <div className="w-full flex items-center justify-between">
                    <Link
                        href={"/"}
                    >
                        <FiArrowLeft className="w-8 h-fit"/>
                    </Link>

                    <img src="/Logo_SobreVidas.png" alt="Logo ou imagem decorativa" className="w-24 h-auto mb-4" />

                <div className="w-8" />
                    
            </div>

            <p className="font-bold text-xl border-b-2 border-[#FFB8B8] pb-2">Médico, faça o login!</p>
            <input type="number" placeholder="CPF" className="bg-[#F4EEEE] p-1 sm:p-2 rounded-md outline-none w-full" onChange={(e) => setCpf(e.target.value)}/>

            <input type="text" placeholder="Senha" className="bg-[#F4EEEE] p-1 sm:p-2 rounded-md outline-none w-full" onChange={(e) => setPassword(e.target.value)}/>

            {message && (
                <p className="text-red-500 bg-red-100 p-1 rounded-md">{message}</p>
            )}
                
            <button className="text-center border-2 border-[#FFB8B8] px-4 py-2 rounded-2xl" onClick={checkUserData}>
                Entrar
            </button>

            <div className="flex w-full justify-around items-center">
                <Link href="" className="border-b-2 border-[#FFB8B8] pb-2">
                    <p>Esqueceu a senha?</p>
                </Link>

                <Link href="/cadastroMedico" className="border-b-2 border-[#FFB8B8] text-center pb-2">
                    <p>Cadastre-se</p>
                </Link>
            </div>
        </div>
    </div>
    )
}