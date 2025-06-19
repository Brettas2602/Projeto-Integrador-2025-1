package model

type FichaCitopatologica struct {
	ID                       *int                          `json:"id"`
	PacienteID               *int                          `json:"paciente_id"`
	DataCriacao              *DateOnly                     `json:"data_criacao"`
	Risco                    *string                       `json:"risco"`
	NumeroProtocolo          *string                       `json:"numero_protocolo"`
	DadosAnamnese            *DadosAnamnese                `json:"dados_anamnese"`
	ExameClinico             *ExameClinico                 `json:"exame_clinico"`
	IdentificacaoLaboratorio *IdentificacaoLaboratorio     `json:"identificacao_laboratorio"`
	Resultado                *ResultadoExameCitopatologico `json:"resultado"`
}
