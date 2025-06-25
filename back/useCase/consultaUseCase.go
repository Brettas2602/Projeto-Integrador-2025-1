package useCase

import (
	"back/model"
	"back/repository"
)

type ConsultaUseCase struct{
	repository repository.ConsultasRepository
}

func NewConsultaUseCase (repo repository.ConsultasRepository) ConsultaUseCase{
	return ConsultaUseCase{
		repository: repo,
	}
}

func (cu *ConsultaUseCase) CreateConsulta(consulta *model.Consultas) (*model.Consultas, error){
	createdConsulta, err := cu.repository.CreateConsultas(consulta)
	if err != nil{
		return nil, err
	}

	return createdConsulta, nil
}

func (cu *ConsultaUseCase) GetAllConsultas() ([]model.Consultas, error){
	consultas, err := cu.repository.GetAllConsultas()
	if err != nil{
		return nil, err
	}

	return consultas, nil
}

func (cu *ConsultaUseCase) GetAllConsultasAgendadas()([]model.Consultas, error){
		consultas, err := cu.repository.GetAllConsultasAgendadas()
	if err != nil{
		return nil, err
	}	

	return consultas, nil
}

func (cu *ConsultaUseCase) GetCountConsultasByAllMonths() ([]model.ConsultasPorMes, error) {
	consultas, err := cu.repository.GetCountConsultasByAllMonths()
	if err != nil {
		return nil, err
	}

	return consultas, err
}