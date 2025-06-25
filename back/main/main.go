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
	server.GET("/ubs/getallubs", UbsController.GetAllUbs)

	ConsultaRepository := repository.NewConsultasRepository(dbConnection)
	ConsultaUseCase := useCase.NewConsultaUseCase(ConsultaRepository)
	ConsultaController := controller.NewConsultaController(ConsultaUseCase)

	server.GET("/consulta/getallconsultas", ConsultaController.GetAllConsultas)
	server.GET("/consulta/getcountconsultasbyallmonths", ConsultaController.GetCountConsultasByAllMonths)
	server.GET("/consulta/getallconsultasagendadas", ConsultaController.GetAllConsultasAgendadas)
	server.POST("/consulta/createconsulta", ConsultaController.CreateConsulta)

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
	server.PUT("/ficha", FichaController.UpdateFicha)

	PacienteRepository := repository.NewPacienteRepository(dbConnection)
	PacienteUseCase := useCase.NewPacienteUseCase(
		PacienteRepository, 
		EnderecoRepository, 
		FichaRepository, 
		AnamneseRepository, 
		ExameClinicoRepository, 
		IdentificacaoLabRepository, 
		ResultadoRepository,
		ConsultaRepository,
	)
	PacienteController := controller.NewPacienteController(PacienteUseCase)

	server.GET("/paciente/:pacienteCpf", PacienteController.GetPacienteByCpf)
	server.GET("/paciente/getbyid/:pacienteId", PacienteController.GetPacienteById)
	server.GET("/pacientes", PacienteController.GetAllPacientes)
	server.GET("/paciente/getlastfour", PacienteController.GetLastFourPacientes)
	server.GET("/paciente/getbyname/:pacienteNome", PacienteController.GetAllPacienteByName)
	server.GET("/paciente/getbyage/:idadeMin/:idadeMax", PacienteController.GetAllPacienteByAge)
	server.GET("/paciente/getbyrisk/:risco", PacienteController.GetAllPacienteByRisk)
	server.GET("/paciente/getcountbyrisk", PacienteController.GetCountPacienteByRisk)
	server.GET("/paciente/resultadosbyid/:pacienteId", PacienteController.GetResultadosByPacienteId)
	server.GET("/paciente/getlastconsultationbyid/:pacienteId", PacienteController.GetLastConsultationByIdPaciente)
	server.GET("/paciente/getlastfichawhithriskbyid/:pacienteId", PacienteController.GetLastFichaWithRiskByIdPaciente)
	server.GET("/paciente/getallconsultasbyid/:pacienteId", PacienteController.GetAllConsultasByIdPaciente)
	server.POST("/paciente", PacienteController.CreatePaciente)
	server.PUT("/paciente", PacienteController.UpdatePaciente)

	server.Run(":8000")
}