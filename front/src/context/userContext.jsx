"use client"

const { createContext, useState, useEffect, useContext } = require("react");

const UserContext = createContext()

export function UserProvider({ children }) {
    const [medico, setMedico] = useState()
    const [enfermeiro, setEnfermeiro] = useState()
    const [paciente, setPaciente] = useState()

    useEffect(() => {
        const storedMedico = localStorage.getItem("medico")
        const storedEnfermeiro = localStorage.getItem("enfermeiro")
        const storedPaciente = localStorage.getItem("paciente")

        if (storedMedico) setMedico(JSON.parse(storedMedico))
        if (storedEnfermeiro) setEnfermeiro(JSON.parse(storedEnfermeiro))
        if (storedPaciente) setPaciente(JSON.parse(storedPaciente))
    }, [])

    useEffect(() => {
        if (medico) localStorage.setItem("medico", JSON.stringify(medico))
    }, [medico])

    useEffect(() => {
        if (enfermeiro) localStorage.setItem("enfermeiro", JSON.stringify(enfermeiro))
    }, [enfermeiro])

    useEffect(() => {
        if (paciente) localStorage.setItem("paciente", JSON.stringify(paciente))
    }, [paciente])

    function logout(user) {
        localStorage.removeItem(user)

        switch (user) {
            case "medico":
                setMedico(undefined)
                break;
        
            case "enfermeiro":
                setEnfermeiro(undefined)
                break;

            case "paciente":
                setPaciente(undefined)
                break;
        }
    }

    return (
        <UserContext.Provider value={{medico, setMedico, enfermeiro, setEnfermeiro, paciente, setPaciente, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}