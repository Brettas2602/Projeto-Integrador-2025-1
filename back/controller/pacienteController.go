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

func (pc *PacienteController) GetAllPacienteByName(ctx *gin.Context){
	pacienteNome := ctx.Param("pacienteNome")
	if strings.TrimSpace(pacienteNome) == ""{
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Nome não pode ser nulo",
		})
		return
	}

	pacientes, err := pc.useCase.GetAllPacienteByName(pacienteNome)
		if err != nil{
			ctx.JSON(http.StatusNotFound, gin.H{
				"message":err.Error(),
			})
			return
		}

		if pacientes == nil{
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "Item não encontrado na base de dados",
			})
			return
		}

	ctx.JSON(http.StatusOK, pacientes)
}

func (pc *PacienteController) GetAllPacienteByAge(ctx *gin.Context){
	idadeInicialStr := ctx.Param("idadeMin")
	idadeFinalStr := ctx.Param("idadeMax")

	idadeInicialPaciente, err := strconv.Atoi(idadeInicialStr)
	idadeFinalPaciente, err2 := strconv.Atoi(idadeFinalStr)

	if err != nil || err2 != nil{
		ctx.JSON(http.StatusBadRequest, gin.H{
		"message": "Idades inválidas",
		})
	}

	if idadeInicialPaciente < 0 || idadeFinalPaciente < 0{
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Idades inválidas",
		})
		return
	}

	pacientes, err := pc.useCase.GetAllPacienteByAge(idadeInicialPaciente, idadeFinalPaciente)
		if err != nil{
			ctx.JSON(http.StatusNotFound, gin.H{
				"message":err.Error(),
			})
			return
		}

		if pacientes == nil{
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "Item não encontrado na base de dados",
			})
			return
		}

	ctx.JSON(http.StatusOK, pacientes)
}