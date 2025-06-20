"use client"

import { useUser } from "@/context/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CadastroMedico() {
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirmada, setSenhaConfirmada] = useState("");

  const {setMedico} = useUser()

  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação simples
    if (senha !== senhaConfirmada) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
        const {data: medico} = await axios.post("http://localhost:8000/medico", {
            "id_ubs": 1,
            "crm": crm,
            "email": email,
            "cpf": cpf,
            "senha": senha,
            "nome": nome,
        })

        setMedico(medico)
    
        console.log("Dados do médico:", medico);
        alert("Cadastro enviado com sucesso!");
    
        // Limpa os campos
        setNome("");
        setCrm("");
        setEmail("");
        setCpf("");
        setSenha("");
        setSenhaConfirmada("");
    
        router.replace("/dashboard")
    } catch (error) {
        console.error("Erro ao cadastrar enfermeiro:", error);
        alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="max-w-screen-md mx-auto w-full h-screen flex justify-center items-center px-2">
      <div className="bg-white w-4/5 xm:w-3/4 sm:w-4/5 sm:flex sm:flex-col rounded-xl gap-3 px-5 py-7 shadow-2xl">
        <p className="text-xl font-bold border-b-2 border-[#B56AAA] w-fit mb-4">
          Cadastro de médico
        </p>

        <form onSubmit={handleSubmit} className="sm:flex sm:flex-col gap-2">
          <div className="sm:grid sm:grid-cols-5 gap-5">
            <label className="col-span-3 mt-1">
              Nome Completo:
              <input
                className="bg-[#F4EEEE] rounded-md w-full h-6 my-1 outline-none px-1 shadow-md"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>

            <label className="sm:col-span-2 mt-1">
              CRM:
              <input
                className="bg-[#F4EEEE] rounded-md w-full my-1 outline-none px-1 shadow-md"
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="sm:grid sm:grid-cols-5 gap-5">
            <label className="col-span-3 mt-1">
              Email:
              <input
                className="bg-[#F4EEEE] rounded-md w-full my-1 outline-none px-1 shadow-md"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="col-span-2 flex flex-col">
              CPF:
              <input
                className="bg-[#F4EEEE] rounded-md w-full my-1 outline-none px-1 shadow-md"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="w-full sm:w-3/6">
            Senha:
            <input
              className="bg-[#F4EEEE] rounded-md w-full my-1 outline-none px-1 shadow-md"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <div className="sm:flex sm:justify-between sm:items-end">
            <label className="w-full sm:w-3/6">
              Digite a senha novamente:
              <input
                className="bg-[#F4EEEE] rounded-md w-full my-1 outline-none px-1 shadow-md"
                type="password"
                value={senhaConfirmada}
                onChange={(e) => setSenhaConfirmada(e.target.value)}
                required
              />
            </label>

            <div className="flex justify-center sm:justify-start">
              <button
                className="bg-[#FF3333] text-white p-1 px-2 rounded-xl shadow-lg mr-2 hover:bg-[#CC0000] mt-7 sm:mt-0"
                type="button"
                onClick={() => {
                  setNome("");
                  setCrm("");
                  setEmail("");
                  setCpf("");
                  setSenha("");
                  setSenhaConfirmada("");
                }}
              >
                Cancelar
              </button>

              <button
                className="bg-[#28a745] text-white p-1 px-2 rounded-xl shadow-lg hover:bg-[#1e7e34] ml-10 mt-7 sm:mt-0"
                type="submit"
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
