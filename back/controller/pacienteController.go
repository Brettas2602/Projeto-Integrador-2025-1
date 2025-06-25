package controller

import (
	"back/model"
	"back/useCase"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type PacienteController struct {
	useCase useCase.PacienteUseCase
}

func NewPacienteController(usecase useCase.PacienteUseCase) PacienteController {
	return PacienteController{
		useCase: usecase,
	}
}

func (pc *PacienteController) CreatePaciente(ctx *gin.Context) {
	var paciente model.Paciente
	err := ctx.BindJSON(&paciente)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	createdPaciente, err := pc.useCase.CreatePaciente(&paciente)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdPaciente)
}

func (pc *PacienteController) UpdatePaciente(ctx *gin.Context) {
	var paciente model.Paciente
	err := ctx.BindJSON(&paciente)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Erro ao fazer bind do JSON: " + err.Error(),
		})
		return
	}

	err = pc.useCase.UpdatePaciente(&paciente)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Erro ao atualizar paciente: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, paciente)
}

func (pc *PacienteController) GetAllPacientes(ctx *gin.Context) {
	pacientes, err := pc.useCase.GetAllPacientes()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if pacientes == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetPacienteById(ctx *gin.Context) {
	pacienteIdStr := ctx.Param("pacienteId")
	pacienteId, err := strconv.Atoi(pacienteIdStr)

	if pacienteId <= 0 || err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id inválido",
		})
		return
	}

	paciente, err := pc.useCase.GetPacienteById(pacienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if paciente == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, paciente)
}
func (pc *PacienteController) GetPacienteByCpf(ctx *gin.Context) {
	pacienteCpf := ctx.Param("pacienteCpf")
	if strings.TrimSpace(pacienteCpf) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Cpf não pode ser nulo",
		})
		return
	}

	paciente, err := pc.useCase.GetPacienteByCpf(pacienteCpf)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if paciente == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, paciente)
}

func (pc *PacienteController) GetLastFourPacientes(ctx *gin.Context) {
	pacientes, err := pc.useCase.GetLastFourPacientes()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if pacientes == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetAllPacienteByName(ctx *gin.Context) {
	pacienteNome := ctx.Param("pacienteNome")
	if strings.TrimSpace(pacienteNome) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Nome não pode ser nulo",
		})
		return
	}

	pacientes, err := pc.useCase.GetAllPacienteByName(pacienteNome)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if pacientes == nil {
		ctx.JSON(http.StatusAccepted, pacientes)
		return
	}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetAllPacienteByAge(ctx *gin.Context) {
	idadeInicialStr := ctx.Param("idadeMin")
	idadeFinalStr := ctx.Param("idadeMax")

	idadeInicialPaciente, err := strconv.Atoi(idadeInicialStr)
	idadeFinalPaciente, err2 := strconv.Atoi(idadeFinalStr)

	if err != nil || err2 != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Idades inválidas",
		})
	}

	if idadeInicialPaciente < 0 || idadeFinalPaciente < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Idades inválidas",
		})
		return
	}

	if idadeInicialPaciente > idadeFinalPaciente {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Idade inicial não pode ser maior que a final",
		})
		return
	}

	pacientes, err := pc.useCase.GetAllPacienteByAge(idadeInicialPaciente, idadeFinalPaciente)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if pacientes == nil {
		ctx.JSON(http.StatusAccepted, pacientes)
		return
	}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetAllPacienteByRisk(ctx *gin.Context) {
	risco := ctx.Param("risco")
	if strings.TrimSpace(risco) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Risco não pode ser nulo",
		})
		return
	}

	pacientes, err := pc.useCase.GetAllPacienteByRisk(risco)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if pacientes == nil {
		ctx.JSON(http.StatusAccepted, pacientes)
		return
	}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetCountPacienteByRisk(ctx *gin.Context) {
	riscos, err := pc.useCase.GetCountPacienteByRisk()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if riscos == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, riscos)
}

func (pc *PacienteController) GetResultadosByPacienteId(ctx *gin.Context) {
	pacienteIdStr := ctx.Param("pacienteId")
	pacienteId, err := strconv.Atoi(pacienteIdStr)

	if err != nil || pacienteId <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id inválido",
		})
		return
	}

	resultadosFichas, err := pc.useCase.GetResultadosByPacienteId(pacienteId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if resultadosFichas == nil {
		ctx.JSON(http.StatusAccepted, resultadosFichas)
		return
	}

	ctx.JSON(http.StatusOK, resultadosFichas)
}

func (pc *PacienteController) GetLastConsultationByIdPaciente(ctx *gin.Context) {
	pacienteIdStr := ctx.Param("pacienteId")
	pacienteId, err := strconv.Atoi(pacienteIdStr)

	if pacienteId <= 0 || err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id inválido",
		})
		return
	}

	consulta, err := pc.useCase.GetLastConsultationByIdPaciente(pacienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, consulta)
}

func (pu *PacienteController) GetLastFichaWithRiskByIdPaciente(ctx *gin.Context) {
	pacienteIdStr := ctx.Param("pacienteId")
	pacienteId, err := strconv.Atoi(pacienteIdStr)

	if pacienteId <= 0 || err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id inválido",
		})
		return
	}

	paciente, err := pu.useCase.GetLastFichaWithRiskByIdPaciente(pacienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, paciente)
}

func (pu *PacienteController) GetAllConsultasByIdPaciente(ctx *gin.Context) {
	pacienteIdStr := ctx.Param("pacienteId")
	pacienteId, err := strconv.Atoi(pacienteIdStr)

	if pacienteId <= 0 || err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id paciente inválido",
		})
		return
	}

	consultas, err := pu.useCase.GetAllConsultasByIdPaciente(pacienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, consultas)
}
