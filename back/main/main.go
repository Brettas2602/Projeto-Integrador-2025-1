package main

import (
	"back/controller"
	"back/db"
	"back/repository"
	"back/useCase"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time")

func main() {
	server := gin.Default()

	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // permite o frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	dbConnection, err := db.ConnectDB()
	if err != nil {
		panic(err)
	}

	EnderecoRepository := repository.NewEnderecoRepository(dbConnection)

	UbsRepository := repository.NewUbsRepository(dbConnection)
	UbsUseCase := useCase.NewUbsUseCase(UbsRepository, EnderecoRepository)
	UbsController := controller.NewUbsController(UbsUseCase)

	server.GET("/ubs/:ubsId", UbsController.GetUbsByID)

	MedicoRepository := repository.NewMedicoRepository(dbConnection)
	MedicoUseCase := useCase.NewMedicoUseCase(MedicoRepository, UbsRepository)
	MedicoController := controller.NewMedicoController(MedicoUseCase)
	
	server.GET("/medico/:medicoCpf", MedicoController.GetMedicoByCpf)
	server.POST("/medico", MedicoController.CreateMedico)

	EnfermeiroRepository := repository.NewEnfermeiroRepository(dbConnection)
	EnfermeiroUsecase := useCase.NewEnfermeiroUseCase(EnfermeiroRepository, UbsRepository)
	EnfermeiroController := controller.NewEnfermeiroController(EnfermeiroUsecase)

	server.GET("/enfermeiro/:enfermeiroCpf", EnfermeiroController.GetEnfermeiroByID)
	server.POST("/enfermeiro", EnfermeiroController.CreateEnfermeiro)

	AnamneseRepository := repository.NewDadosAnamneseRepository(dbConnection)
	ExameClinicoRepository := repository.NewExameClinicoRepository(dbConnection)
	IdentificacaoLabRepository := repository.NewIdentificacaoLabRepository(dbConnection)
	ResultadoRepository := repository.NewResultadoRepository(dbConnection)
	
	FichaRepository := repository.NewFichaRepository(dbConnection)
	FichaUseCase := useCase.NewFichaUseCase(
		FichaRepository,
		AnamneseRepository, 
		ExameClinicoRepository, 
		IdentificacaoLabRepository, 
		ResultadoRepository,
	)
	FichaController := controller.NewFichaRepository(FichaUseCase)

	server.POST("/ficha", FichaController.CreateFichaByPaciente)

	PacienteRepository := repository.NewPacienteRepository(dbConnection)
	PacienteUseCase := useCase.NewPacienteUseCase(
		PacienteRepository, 
		EnderecoRepository, 
		FichaRepository, 
		AnamneseRepository, 
		ExameClinicoRepository, 
		IdentificacaoLabRepository, 
		ResultadoRepository,
	)
	PacienteController := controller.NewPacienteController(PacienteUseCase)

	server.GET("/paciente/:pacienteCpf", PacienteController.GetPacienteByCpf)
	server.GET("/paciente/getbyname/:pacienteNome", PacienteController.GetAllPacienteByName)
	server.GET("/paciente/getbyage/:idadeMin/:idadeMax", PacienteController.GetAllPacienteByAge)
	server.POST("/paciente", PacienteController.CreatePaciente)

	server.Run(":8000")
}
