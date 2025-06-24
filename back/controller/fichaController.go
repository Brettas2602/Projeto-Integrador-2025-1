package controller

import (
	"back/model"
	"back/useCase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FichaController struct {
	useCase useCase.FichaUseCase
}

func NewFichaRepository(usecase useCase.FichaUseCase) FichaController {
	return FichaController{
		useCase: usecase,
	}
}

func (fc *FichaController) CreateFichaByPaciente(ctx *gin.Context) {
	var ficha model.FichaCitopatologica
	err := ctx.BindJSON(&ficha)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	createdFicha, err := fc.useCase.CreateFichaByPaciente(&ficha)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdFicha)
}

func (fc *FichaController) UpdateFicha(ctx *gin.Context) {
	var ficha model.FichaCitopatologica
	err := ctx.BindJSON(&ficha)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Erro ao fazer bind do JSON: " + err.Error(),
		})
		return
	}

	err = fc.useCase.UpdateFicha(&ficha)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Erro ao atualizar paciente: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, ficha)
}