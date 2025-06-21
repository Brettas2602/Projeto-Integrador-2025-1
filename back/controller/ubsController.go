package controller

import (
	"back/useCase"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type UbsController struct {
	useCase useCase.UbsUseCase
}

func NewUbsController(usecase useCase.UbsUseCase) UbsController {
	return UbsController{
		useCase: usecase,
	}
}

func (uc *UbsController) GetUbsByID(ctx *gin.Context)  {
	id := ctx.Param("ubsId")
	if strings.TrimSpace(id) == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id não pode ser nulo",
		})
		return
	}

	ubsId, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Id deve ser um numero",
		})
		return
	}

	ubs, err := uc.useCase.GetUbsByID(ubsId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if ubs == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Item não encontrado na base de dados",
		})
		return
	}

	ctx.JSON(http.StatusOK, ubs)
}

func (uc *UbsController) GetAllUbs(ctx *gin.Context){
	ubs, err := uc.useCase.GetAllUbs()
	if err != nil{
		ctx.JSON(http.StatusNotFound, gin.H{
				"message":err.Error(),
			})
			return
	}

	if ubs == nil{
		ctx.JSON(http.StatusNotFound, gin.H{
				"message": "Item não encontrado na base de dados",
			})
			return
	}

	ctx.JSON(http.StatusOK, ubs)
}