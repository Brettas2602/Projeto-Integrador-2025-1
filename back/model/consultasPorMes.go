package model

type ConsultasPorMes struct {
	Mes            *string `json:"mes"`
	TotalConsultas *int    `json:"total_consultas"`
}

