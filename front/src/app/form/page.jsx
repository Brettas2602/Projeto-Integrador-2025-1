"use client"

import Input from "@/components/FormInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function Form() {

    const [ubs, setUbs] = useState({})
    const { medico, enfermeiro } = useUser();
    
    useEffect(() => {
    async function fetchUbs() {
        try {
            if (medico || enfermeiro) {
                const { data: res } = await axios.get(`http://localhost:8000/ubs/1`);
                setUbs(res);
                console.log(res)
            }
        } catch (error) {
            console.error("Erro ao buscar UBS:", error);
        }
    }

    fetchUbs();
}, [medico, enfermeiro]);


    const [paciente, setPaciente] = useState({
        id_ubs: 1,
        cartao_sus: "",
        nome: "",
        senha: "",
        nome_mae: "",
        apelido: "",
        cpf: "",
        nacionalidade: "",
        data_nascimento: null,
        cor: "",
        telefone: "",
        escolaridade: "",
        endereco: {
            logradouro: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            uf: "",
            cep: "",
            referencia: ""
        }
    });

    const [ficha, setFicha] = useState({
        numero_protocolo: Math.round(Math.random() * Math.pow(10, 9)).toString(),
        risco: "",
        dados_anamnese: {
            motivo_exame: "",
            data_exame_preventivo: null,
            diu: null,
            gravida: null,
            anticoncepcional: null,
            hormonio_menopausa: null,
            fez_radioterapia: null,
            ultima_menstruacao: null,
            sangramento_relacoes: null,
            sangramento_menopausa: null
        },
        exame_clinico: {
            inspecao_colo: "",
            sinais_dst: null,
            data_coleta: null,
            responsavel: ""
        },
        identificacao_laboratorio: {
            cnes_laboratorio: "",
            nome: "",
            numero_exame: "",
            recebido_em: null
        },
        resultado: {
            amostra_rejeitada: "",
            epitelios: "",
            adequabilidade: "",
            normalidade: null,
            alteracoes_calulares: "",
            microbiologia: "",
            celulas_atipicas: "",
            atipia_escamosa: "",
            atipia_glandular: "",
            neoplasias_malignas: "",
            celulas_endometriais: null,
            observacoes_gerais: "",
            screening_citotecnico: "",
            responsavel: "",
            data_resultado: null
        }
    })

    const handlePacienteChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({ ...prev, [name]: value }));
        console.log(paciente)
    };

    const handleEnderecoChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({
            ...prev,
            endereco: { ...prev.endereco, [name]: value }
        }));
    };

    const handleFichaChange = (e) => {
        const { name, value } = e.target;
        setFicha(prev => ({ ...prev, [name]: value }));
        console.log(ficha)
    };

    const handleAnamneseChange = (e) => {
        let { name, value } = e.target;
        if (value == "true" || value == "false") {
            value == "true" ? value = true : value = false
        }
        setFicha(prev => ({
            ...prev,
            dados_anamnese: { ...prev.dados_anamnese, [name]: value }
        }));
        console.log(ficha)
    };

    const handleExameClinicoChange = (e) => {
        let { name, value } = e.target;
        if (value == "true" || value == "false") {
            value == "true" ? value = true : value = false
        }
        setFicha(prev => ({
            ...prev,
            exame_clinico: { ...prev.exame_clinico, [name]: value }
        }));
        console.log(ficha)
    };

    const handleIdentificacaoLabChange = (e) => {
        let { name, value } = e.target;
        if (value == "true" || value == "false") {
            value == "true" ? value = true : value = false
        }
        setFicha(prev => ({
            ...prev,
            identificacao_laboratorio: { ...prev.identificacao_laboratorio, [name]: value }
        }));
        console.log(ficha)
    };

    const handleResultadoChange = (e) => {
        let { name, value } = e.target;
        if (value == "true" || value == "false") {
            value == "true" ? value = true : value = false
        }
        setFicha(prev => ({
            ...prev,
            resultado: { ...prev.resultado, [name]: value }
        }));
        console.log(ficha)
    };

    async function saveInformations() {
        try {
            const {data: createdpaciente} = await axios.post("http://localhost:8000/paciente", paciente)
            console.log(createdpaciente)
    
            const {data: createdFicha} = await axios.post("http://localhost:8000/ficha", {
                ...ficha,
                paciente_id: createdpaciente.id
            })
            console.log(createdFicha)
            
            localStorage.setItem("mensagemFormulario", "Ficha Citopatológica criada com sucesso!")
            router.push("/dashboard")
        } catch (error) {
            console.log(error)
        }
    }

    const router = useRouter()

    return (
        <div className="w-full min-h-screen px-20 py-5 bg-[#F9F5F5] flex flex-col gap-10" >
            <div className="flex justify-between">
                <button onClick={() => router.back()}>
                    <FiArrowLeft className="w-12 h-fit" />
                </button>

                <p className="text-center text-3xl font-bold">
                    REQUISIÇÃO DE EXAME CITOPATOLÓGICO - COLO DE ÚTERO
                </p>

                <div className="w-12" />
            </div>

            <form className="flex flex-col gap-10 mb-12">

                {/* Dados iniciais */}
                <section className="flex flex-col gap-5">
                    <div className="flex justify-between gap-5">
                        <Input type="text" title="UF" className="w-1/4" value={ubs?.endereco?.uf} />
                        {console.log(ubs)}
                        <Input title="CNES" type="number" className="w-1/4" value = {ubs?.cnes} />
                        <Input title="Nº Protocolo" name="numero_protocolo" value={ficha.numero_protocolo} onChange={handleFichaChange} type="number" className="w-1/4" />
                    </div>
                    <Input title="Unidade de Saúde" value={ubs?.nome} />
                    <div className="flex gap-5">
                        <Input title="Município" className="w-1/2" value={ubs.endereco?.cidade} />
                        <Input title="Prontuário" className="w-1/2" value={ubs.prontuario} />
                    </div>
                </section>

                {/* Informações pessoais */}
                <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-center">INFORMAÇÕES PESSOAIS</h2>
                    <Input title="Cartão Sus" name="cartao_sus" value={paciente.cartao_sus} onChange={handlePacienteChange} className="w-1/3" />
                    <Input title="Nome Completo da Mulher" name="nome" value={paciente.nome} onChange={handlePacienteChange} />
                    <Input title="Nome Completo da Mãe" name="nome_mae" value={paciente.nome_mae} onChange={handlePacienteChange} />
                    <Input title="Apelido da Mulher" name="apelido" value={paciente.apelido} onChange={handlePacienteChange} className="w-1/2" />
                    <div className="flex gap-5">
                        <Input title="CPF" name="cpf" value={paciente.cpf} onChange={handlePacienteChange} className="w-1/2" />
                        <Input title="Senha" name="senha" value={paciente.senha} onChange={handlePacienteChange} className="w-1/2" />
                    </div>
                    <div className="flex gap-5">
                        <Input title="Nacionalidade" name="nacionalidade" value={paciente.nacionalidade} onChange={handlePacienteChange} className="w-1/3" />
                        <Input title="Data de Nascimento" name="data_nascimento" type="date" value={paciente.data_nascimento || ""} onChange={handlePacienteChange} className="w-1/3" />
                    </div>
                </section>


                {/* Raça/cor */}
                <section>
                    <h3 className="font-medium mb-2">Raça/cor</h3>
                    <div className="flex gap-5 flex-wrap">
                        {["Branca", "Preta", "Parda", "Amarela", "Indígena/Etnia"].map((item) => (
                            <label key={item} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="cor"
                                    value={item}
                                    checked={paciente.cor === item}
                                    onChange={handlePacienteChange}
                                />
                                {item}
                            </label>
                        ))}
                        <input
                            type="text"
                            name="cor"
                            value={paciente.cor}
                            onChange={handlePacienteChange}
                            className="border-b border-black focus:outline-none"
                        />
                    </div>
                </section>


                {/* Dados residenciais */}
                <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-center">DADOS RESIDENCIAIS</h2>
                    <div className="flex gap-5">
                        <Input title="Cidade" name="cidade" value={paciente.endereco.cidade} onChange={handleEnderecoChange} />
                        <Input title="Logradouro" name="logradouro" value={paciente.endereco.logradouro} onChange={handleEnderecoChange} />
                    </div>
                    <div className="flex gap-5">
                        <Input title="Número" name="numero" value={paciente.endereco.numero} onChange={handleEnderecoChange} className="w-1/4" />
                        <Input title="Complemento" name="complemento" value={paciente.endereco.complemento} onChange={handleEnderecoChange} className="w-3/4" />
                    </div>
                    <div className="flex gap-5">
                        <Input title="Bairro" name="bairro" value={paciente.endereco.bairro} onChange={handleEnderecoChange} />
                        <Input title="UF" name="uf" value={paciente.endereco.uf} onChange={handleEnderecoChange} className="w-1/4" />
                    </div>
                    <div className="flex gap-5">
                        <Input title="CEP" name="cep" value={paciente.endereco.cep} onChange={handleEnderecoChange} className="w-1/3" />
                        <Input title="Telefone" name="telefone" value={paciente.telefone} onChange={handlePacienteChange} className="w-1/3" />
                    </div>
                    <Input title="Ponto de Referência" name="referencia" value={paciente.endereco.referencia} onChange={handleEnderecoChange} />
                </section>


                {/* Escolaridade */}
                <section>
                    <h3 className="font-medium mb-2">Escolaridade:</h3>
                    <div className="flex gap-5 flex-wrap">
                        {[
                            "Analfabeta",
                            "Ensino fundamental incompleto",
                            "Ensino fundamental completo",
                            "Ensino médio incompleto",
                            "Ensino médio completo",
                            "Ensino superior completo",
                        ].map((item) => (
                            <label key={item} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="escolaridade"
                                    value={item}
                                    checked={paciente.escolaridade === item}
                                    onChange={handlePacienteChange}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </section>


                {/* DADOS DA ANAMNESE */}
                <section className="flex flex-col gap-7">
                    <h2 className="text-xl font-bold text-center border-2 border-black">DADOS DA ANAMNESE</h2>
                    <div className="flex gap-10">
                        <div className="w-1/2 flex flex-col gap-2">
                            <p>1. Motivo do exame*</p>
                            {["Rastreamento", "Repetição (exame alterado ASCUS/Baixo grau)", "Seguimento (pós diagnóstico colposcópico/tratamento)"].map((item) => (
                                <label key={item} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="motivo_exame"
                                        value={item}
                                        checked={ficha.dados_anamnese.motivo_exame === item}
                                        onChange={handleAnamneseChange}
                                    />
                                    {item}
                                </label>
                            ))}

                            <p>2. Fez o exame preventivo (Papanicolau) alguma vez?*</p>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="data_exame_preventivo"
                                    value="sim"
                                    checked={ficha.dados_anamnese.data_exame_preventivo !== null && ficha.dados_anamnese.data_exame_preventivo != ""}
                                    onChange={handleAnamneseChange}
                                />
                                Sim. Quando fez o último exame?
                                <input
                                    type="date"
                                    name="data_exame_preventivo"
                                    value={ficha.dados_anamnese.data_exame_preventivo || ""}
                                    onChange={handleAnamneseChange}
                                    className="border-b border-black w-30"
                                />
                            </label>
                            {["Não", "Não sabe"].map((item) => (
                                <label key={item} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="data_exame_preventivo"
                                        value=""
                                    />
                                    {item}
                                </label>
                            ))}

                            {[
                                { q: "3. Usa DIU?*", name: "diu" },
                                { q: "4. Está grávida?", name: "gravida" },
                                { q: "5. Usa pílula anticoncepcional?*", name: "anticoncepcional" },
                                { q: "6. Usa hormônio/remédio para tratar a menopausa?*", name: "hormonio_menopausa" },
                                { q: "7. Já fez tratamento por radioterapia?*", name: "fez_radioterapia" },
                            ].map(({ q, name }) => (
                                <div key={name}>
                                    <p>{q}</p>
                                    {["Sim", "Não", "Não sabe"].map((option) => (
                                        <label key={option} className="mr-4">
                                            <input
                                                type="radio"
                                                name={name}
                                                value={option == "Sim" ? true : false}
                                                onChange={handleAnamneseChange}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="w-1/2 flex flex-col gap-2">
                            <p>8. Data da última menstruação/regra*</p>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="ultima_menstruacao"
                                    value="sim"
                                    checked={ficha.dados_anamnese.ultima_menstruacao !== "" && ficha.dados_anamnese.ultima_menstruacao !== null}
                                    onChange={handleAnamneseChange}
                                />
                                Sei
                                <input
                                    type="date"
                                    name="ultima_menstruacao"
                                    value={ficha.dados_anamnese.ultima_menstruacao || ""}
                                    onChange={handleAnamneseChange}
                                    className="border-b border-black w-30"
                                />
                            </label>
                            {["Não sabe", "Não lembra"].map((option) => (
                                <label key={option} className="flex gap-2">
                                    <input
                                        type="radio"
                                        name="ultima_menstruacao"
                                        value=""
                                    />
                                    {option}
                                </label>
                            ))}

                            <p>9. Tem ou teve algum sangramento após relações sexuais?*</p>
                            {["Sim", "Não", "Não sabe", "Não lembra"].map((option) => (
                                <label key={option} className="flex gap-2">
                                    <input
                                        type="radio"
                                        name="sangramento_relacoes"
                                        value={option == "Sim" ? true : false}
                                        onChange={handleAnamneseChange}
                                    />
                                    {option}
                                </label>
                            ))}

                            <p>10. Tem ou teve algum sangramento após a menopausa?*</p>
                            {["Sim", "Não", "Não sabe/Não lembra", "Não está na menopausa"].map((option) => (
                                <label key={option} className="flex gap-2">
                                    <input
                                        type="radio"
                                        name="sangramento_menopausa"
                                        value={option == "Sim" ? true : false}
                                        onChange={handleAnamneseChange}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>



                {/* EXAME CLÍNICO */}
                <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-center border-2 border-black">EXAME CLÍNICO</h2>
                    <div className="flex gap-10">
                        <div className="w-1/2">
                            <p>11. Inspeção do colo*</p>
                            {[
                                "Normal",
                                "Ausente (anomalias congênitas ou retirado cirurgicamente",
                                "Alterado",
                                "Colo não visualizado"
                            ].map((option) => (
                                <label key={option} className="block">
                                    <input
                                        type="radio"
                                        name="inspecao_colo"
                                        value={option}
                                        checked={ficha.exame_clinico.inspecao_colo === option}
                                        onChange={handleExameClinicoChange}
                                        className="mr-1"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>

                        <div className="w-1/2">
                            <p>12. Sinais sugestivos de doenças sexualmente transmissíveis?</p>
                            {["Sim", "Não"].map((option) => (
                                <label key={option} className="mr-4">
                                    <input
                                        type="radio"
                                        name="sinais_dst"
                                        value={option == "Sim" ? true : false}
                                        onChange={handleExameClinicoChange}
                                    />
                                    {option}
                                </label>
                            ))}

                            <div className="bg-[#D9D9D9] px-3 py-2 mt-3">
                                NOTA: Na presença de colo alterado, com lesão sugestiva de câncer, não aguardar <br /> o resultado do exame citopatológico para encaminhar a mulher para colposcopia.
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-5">
                        <Input
                            title="Data da coleta*"
                            name="data_coleta"
                            type="date"
                            className="w-1/4"
                            value={ficha.exame_clinico.data_coleta || ""}
                            onChange={handleExameClinicoChange}
                        />
                        <Input
                            title="Responsável*"
                            name="responsavel"
                            className="w-2/3"
                            value={ficha.exame_clinico.responsavel}
                            onChange={handleExameClinicoChange}
                        />
                    </div>
                </section>

                {/* IDENTIFICAÇÃO DO LABORATÓRIO */}
                <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-center border-2 border-black">IDENTIFICAÇÃO DO LABORATÓRIO</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5">
                            <Input
                                title="CNES do Laboratório"
                                name="cnes_laboratorio"
                                value={ficha.identificacao_laboratorio.cnes_laboratorio}
                                onChange={handleIdentificacaoLabChange}
                            />
                            <Input
                                title="Nome do Laboratório"
                                name="nome"
                                value={ficha.identificacao_laboratorio.nome}
                                onChange={handleIdentificacaoLabChange}
                            />
                        </div>

                        <div className="flex gap-5">
                            <Input
                                title="Número do Exame"
                                name="numero_exame"
                                value={ficha.identificacao_laboratorio.numero_exame}
                                onChange={handleIdentificacaoLabChange}
                            />
                            <Input
                                title="Recebido em"
                                type="date"
                                name="recebido_em"
                                value={ficha.identificacao_laboratorio.recebido_em || ""}
                                onChange={handleIdentificacaoLabChange}
                            />
                        </div>
                    </div>
                </section>


                {/* RESULTADO DO EXAME */}
                <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-center border-2 border-black">
                        RESULTADO DO EXAME CITOPATOLÓGICO – COLO DE ÚTERO
                    </h2>

                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <h2 className="font-semibold">AVALIAÇÃO PRÉ-ANALÍTICA</h2>
                            <p>Amostra rejeitada por:</p>
                            {[
                                { label: "Ausência ou erro na identificação da lâmina, frasco ou formulário", value: "erro_identificacao" },
                                { label: "Lâmina danificada ou ausente", value: "lamina_danificada" }
                            ].map(({ label, value }) => (
                                <label key={value} className="block">
                                    <input
                                        type="checkbox"
                                        name="amostra_rejeitada"
                                        value={label}
                                        onChange={handleResultadoChange}
                                        checked={ficha.resultado.amostra_rejeitada?.includes(label)}
                                        className="mr-1"
                                    /> {label}
                                </label>
                            ))}


                            <p className="mt-3">Epitélios representados na amostra*:</p>
                            {["Escamoso", "Glandular", "Metaplásico"].map((label) => {
                                const value = label.toLowerCase();
                                return (
                                    <label key={value} className="block">
                                        <input
                                            type="checkbox"
                                            name="epitelios"
                                            value={value}
                                            checked={ficha.resultado.epitelios?.includes(value)}
                                            onChange={handleResultadoChange}
                                            className="mr-1"
                                        /> {label}
                                    </label>
                                );
                            })}
                        </div>

                        <div>
                            <h2 className="font-semibold">ADEQUABILIDADE DO MATERIAL*</h2>
                            {[
                                "Satisfatória",
                                "Material acelular ou hipocelular em menos de 10% do esfregaço",
                                "Sangue em mais de 75% do esfregaço",
                                "Picócitos em mais de 75% do esfregaço",
                                "Artefatos de dessecamento em mais de 75% do esfregaço",
                                "Contaminantes externos em mais de 75% do esfregaço",
                                "Intensa superposição celular em mais de 75% do esfregaço"
                            ].map((label) => {
                                const value = label.toLowerCase().replace(/\s+/g, "_");
                                return (
                                    <label key={value} className="block">
                                        <input
                                            type="checkbox"
                                            name="adequabilidade"
                                            value={label}
                                            checked={ficha.resultado.adequabilidade?.includes(label)}
                                            onChange={handleResultadoChange}
                                            className="mr-1"
                                        /> {label}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </section>


                {/* DIAGNÓSTICO DESCRITIVO */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-center border-b-2 border-black">DIAGNÓSTICO DESCRITIVO</h2>

                    <div className="flex gap-10">
                        <div className="w-1/2 flex flex-col gap-2">
                            <label className="font-medium">DENTRO DOS LIMITES DA NORMALIDADE NO MATERIAL EXAMINADO?</label>
                            {["sim", "nao"].map((val) => (
                                <label key={val}>
                                    <input
                                        type="checkbox"
                                        name="normalidade"
                                        value={val == "Sim" ? true : false}
                                        onChange={handleResultadoChange}
                                    /> {val === "sim" ? "Sim" : "Não"}
                                </label>
                            ))}

                            <label className="font-medium mt-2">ALTERAÇÕES CELULARES BENIGNAS REATIVAS OU REPARATIVAS</label>
                            {["inflamação", "metaplasia escamosa imatura", "reparação", "atrofia com inflamação", "radiação"].map((val) => (
                                <label key={val}>
                                    <input
                                        type="checkbox"
                                        name="alteracoes_calulares"
                                        value={val}
                                        checked={ficha.resultado.alteracoes_calulares?.includes(val)}
                                        onChange={handleResultadoChange}
                                    /> {val.charAt(0).toUpperCase() + val.slice(1)}
                                </label>
                            ))}

                            <label className="font-medium mt-2">MICROBIOLOGIA</label>
                            {[
                                "lactobacillus sp", "cocos", "sugestivo de chlamydia sp", "actinomyces sp",
                                "candida sp", "trichomonas vaginalis",
                                "efeito citopático compatível com vírus do grupo herpes",
                                "bacilos supracitoplasmáticos (sugestivos de gardnerella/ mobiluncus)",
                                "outros bacilos"
                            ].map((val) => (
                                <label key={val}>
                                    <input
                                        type="checkbox"
                                        name="microbiologia"
                                        value={val}
                                        checked={ficha.resultado.microbiologia?.includes(val)}
                                        onChange={handleResultadoChange}
                                    /> {val.charAt(0).toUpperCase() + val.slice(1)}
                                </label>
                            ))}
                            
                        </div>

                        <div className="w-1/2 flex flex-col gap-2">
                            <label className="font-medium">CÉLULAS ATÍPICAS DE SIGNIFICADO INDETERMINADO</label>
                            {[
                                "Escamosas: Possivelmente não neoplásicas",
                                "Escamosas: Não se pode afastar lesão de alto grau (ASC-H)",
                                "Glandulares: Possivelmente não neoplásicas",
                                "Glandulares: Não se pode afastar lesão de alto grau",
                                "De origem indefinida: Possivelmente não neoplásicas",
                                "De origem indefinida: Não se pode afastar lesão de alto grau"
                            ].map(val => (
                                <label key={val}>
                                    <input
                                        type="checkbox"
                                        name="celulas_atipicas"
                                        value={val.toLowerCase()}
                                        checked={ficha.resultado.celulas_atipicas?.includes(val.toLowerCase())}
                                        onChange={handleResultadoChange}
                                    /> {val}
                                </label>
                            ))}

                            <label className="font-medium mt-2">ATIPIAS EM CÉLULAS ESCAMOSAS</label>
                            {[
                                "Lesão intra-epitelial de baixo grau (compreendendo efeito citopático pelo HPV e neoplasia intra-epitelial cervical grau I)",
                                "Lesão intra-epitelial de alto grau (compreendendo neoplasias intraepiteliais cervicais graus II e III)",
                                "Lesão intra-epitelial de alto grau,não podendo excluir micro-invasão",
                                "Carcinoma epidermóide invasor"
                            ].map(label => (
                                <label key={label}>
                                    <input
                                        type="checkbox"
                                        name="atipia_escamosa"
                                        value={label.toLowerCase()}
                                        checked={ficha.resultado.atipia_escamosa?.includes(label.toLowerCase())}
                                        onChange={handleResultadoChange}
                                    /> {label}
                                </label>
                            ))}

                            <label className="font-medium mt-2">ATIPIAS EM CÉLULAS GLANDULARES</label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="atipia_glandular"
                                    value="adenocarcinoma_in_situ"
                                    checked={ficha.resultado.atipia_glandular?.includes("adenocarcinoma_in_situ")}
                                    onChange={handleResultadoChange}
                                /> Adenocarcinoma "in situ"
                            </label>
                            <label>Adenocarcinoma invasor:</label>
                            <div className="pl-4">
                                {["cervical", "endometrial", "sem outras especificações"].map(op => (
                                    <label key={op}>
                                        <input
                                            type="checkbox"
                                            name="atipia_glandular"
                                            value={op}
                                            checked={ficha.resultado.atipia_glandular?.includes(op)}
                                            onChange={handleResultadoChange}
                                        /> {op.charAt(0).toUpperCase() + op.slice(1)}
                                    </label>
                                ))}
                            </div>

                            <label className="font-medium mt-2">OUTRAS NEOPLASIAS MALIGNAS:</label>
                            <input
                                type="text"
                                name="neoplasias_malignas"
                                value={ficha.resultado.neoplasias_malignas || ""}
                                onChange={handleResultadoChange}
                                className="border-b border-black"
                            />

                            <label>
                                <input
                                    type="checkbox"
                                    name="celulas_endometriais"
                                    value={true}
                                    onChange={handleResultadoChange}
                                /> PRESENÇA DE CÉLULAS ENDOMETRIAIS (NA PÓS-MENOPAUSA OU ACIMA DE 40 ANOS, FORA DO PERÍODO MENSTRUAL)
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="observacoes_gerais">Observações Gerais:</label>
                        <input
                            type="text"
                            id="observacoes_gerais"
                            name="observacoes_gerais"
                            value={ficha.resultado.observacoes_gerais}
                            onChange={handleResultadoChange}
                            className="w-full border-b border-black"
                        />
                    </div>

                    <div>
                        <p>RISCO DA PACIENTE:</p>
                        <div className="flex flex-col gap-2">
                            {[
                                {risco: "Baixo", color: "#4CAF50"},
                                {risco: "Médio", color: "#FFC107"},
                                {risco: "Alto", color: "#F44236"}
                            ].map((item, index) => (
                                <div className="flex gap-2" key={index}>
                                    <input 
                                        type="radio" 
                                        name="risco"
                                        value={item.risco}
                                        onChange={handleFichaChange}
                                    />
                                    <div>{item.risco}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-5 mt-4">
                        <Input
                            title="Screening pelo citotécnico"
                            name="screening_citotecnico"
                            value={ficha.resultado.screening_citotecnico}
                            onChange={handleResultadoChange}
                            className="w-1/3"
                        />
                        <Input
                            title="Responsável"
                            name="responsavel"
                            value={ficha.resultado.responsavel}
                            onChange={handleResultadoChange}
                            className="w-1/3"
                        />
                        <Input
                            title="Data do Resultado"
                            name="data_resultado"
                            type="date"
                            value={ficha.resultado.data_resultado || ""}
                            onChange={handleResultadoChange}
                            className="w-1/3"
                        />
                    </div>
                </section>



                <div className="w-full fixed bottom-2 -mx-20 px-10 flex justify-center">
                    <button
                        type="button"
                        className="w-full px-10 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                        onClick={saveInformations}
                    >
                        Salvar informações
                    </button>
                </div>
            </form>
        </div >
    );
}