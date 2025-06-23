"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function LoginPaciente() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { paciente, setPaciente } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (paciente) router.replace("dashboardPaciente");
  }, [paciente]);

  async function checkUserData() {
    try {
      const { data } = await axios.get(`http://localhost:8000/paciente/${cpf}`);
      const { senha: userPassword, cpf: userCPF } = data;

      if (userPassword !== password || userCPF !== cpf) {
        setMessage("Usuário ou senha incorretos");
        return;
      }

      setPaciente(data);

      router.replace("dashboardPaciente");
    } catch {
      setMessage("Usuário ou senha incorretos");
      return;
    }
  }

  return (
    <div className="max-w-screen-md mx-auto w-full h-screen flex justify-center items-center px-2">
      <div className="bg-white w-11/12 xs:w-3/4 xm:w-3/5 sm:w-2/4 flex flex-col items-center rounded-xl gap-7 px-5 py-7 shadow-2xl">
        <img src="/Logo_SobreVidas.png" alt="Logo ou imagem decorativa" className="w-24 h-auto mb-4" />

        <p className="font-bold text-xl border-b-2 border-[#FFB8B8] pb-2">
          Paciente, faça o login!
        </p>

        <input type="text" inputMode="numeric" pattern="\d*" placeholder="CPF" className="bg-[#F4EEEE] p-1 sm:p-2 rounded-md outline-none w-full" onChange={(e) => setCpf(e.target.value)}/>

        <input type="password" placeholder="Senha" className="bg-[#F4EEEE] p-1 sm:p-2 rounded-md outline-none w-full" onChange={(e) => setPassword(e.target.value)}/>

        <button className="text-center border-2 border-[#FFB8B8] px-4 py-2 rounded-2xl hover:bg-[#FFB8B8] transition-colors" onClick={checkUserData}>
          Entrar
        </button>

        {message && (
          <p className="text-red-500 bg-red-100 p-1 rounded-md">{message}</p>
        )}

        <div className="flex w-full justify-around items-center">
          <Link href="#" className="border-b-2 border-[#FFB8B8] pb-2">
            <p>Esqueceu a senha?</p>
          </Link>

          <Link href="/p" className="border-b-2 border-[#FFB8B8] text-center pb-2">
            <p>Cadastre-se</p>
          </Link>
        </div>
      </div>
    </div>
  );
}