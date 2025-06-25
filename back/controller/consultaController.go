package controller

import (
	"back/model"
	"back/useCase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ConsultaController struct {
	useCase useCase.ConsultaUseCase
}

func NewConsultaController(useCase useCase.ConsultaUseCase) ConsultaController {
	return ConsultaController{
		useCase: useCase,
	}
}

func (cc *ConsultaController) CreateConsulta(ctx *gin.Context) {
	var consulta model.Consultas

	err := ctx.BindJSON(&consulta)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	createdConsulta, err := cc.useCase.CreateConsulta(&consulta)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdConsulta)
}

func (cc *ConsultaController) GetAllConsultas(ctx *gin.Context) {
	consultas, err := cc.useCase.GetAllConsultas()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if consultas == nil {
		ctx.JSON(http.StatusAccepted, consultas)
		return
	}

	ctx.JSON(http.StatusOK, consultas)
}

func (cc *ConsultaController) GetAllConsultasAgendadas(ctx *gin.Context) {
	consultas, err := cc.useCase.GetAllConsultasAgendadas()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if consultas == nil {
		ctx.JSON(http.StatusAccepted, consultas)
		return
	}

	ctx.JSON(http.StatusOK, consultas)
}

func (cc *ConsultaController) GetCountConsultasByAllMonths(ctx *gin.Context) {
	consultas, err := cc.useCase.GetCountConsultasByAllMonths()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if consultas == nil {
		ctx.JSON(http.StatusAccepted, consultas)
		return
	}

	ctx.JSON(http.StatusOK, consultas)
}
