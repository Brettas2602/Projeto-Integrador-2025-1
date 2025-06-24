package useCase

import (
	"back/model"
	"back/repository"
)

type FichaUseCase struct {
	repository                 repository.FichaRepository
	anamneseRepository         repository.DadosAnamneseRepository
	exameClinicoRepository     repository.ExameClinicoRepository
	identificacaoLabRepository repository.IdentificacaoLabRepository
	resultadoRepository        repository.ResultadoRepository
}

func NewFichaUseCase(
	repo repository.FichaRepository,
	anamnseRepo repository.DadosAnamneseRepository,
	exameClinicoRepo repository.ExameClinicoRepository,
	identificacaoRepo repository.IdentificacaoLabRepository,
	resultadoRepo repository.ResultadoRepository,
) FichaUseCase {
	return FichaUseCase{
		repository: repo,
		anamneseRepository: anamnseRepo,
		exameClinicoRepository: exameClinicoRepo,
		identificacaoLabRepository: identificacaoRepo,
		resultadoRepository: resultadoRepo,
	}
}

func (fu *FichaUseCase) CreateFichaByPaciente(ficha *model.FichaCitopatologica) (*model.FichaCitopatologica, error) {
	createdFicha, err := fu.repository.CreateFicha(ficha)
	if err != nil {
		return nil, err
	}

	createdFicha.DadosAnamnese.FichaID = createdFicha.ID
	createdFicha.DadosAnamnese, err = fu.anamneseRepository.CreateDadosAnamnese(createdFicha.DadosAnamnese)
	if err != nil {
		return nil, err
	}

	createdFicha.ExameClinico.FichaID = createdFicha.ID
	createdFicha.ExameClinico, err = fu.exameClinicoRepository.CreateExameClinico(createdFicha.ExameClinico)
	if err != nil {
		return nil, err
	}

	createdFicha.IdentificacaoLaboratorio.FichaID = createdFicha.ID
	createdFicha.IdentificacaoLaboratorio, err = fu.identificacaoLabRepository.CreateIdentificacaoLab(createdFicha.IdentificacaoLaboratorio)
	if err != nil {
		return nil, err
	}

	createdFicha.Resultado.FichaID = createdFicha.ID
	createdFicha.Resultado, err = fu.resultadoRepository.CreateResultado(createdFicha.Resultado)
	if err != nil {
		return nil, err
	}

	return ficha, nil
}

func (fu *FichaUseCase) UpdateFicha(ficha *model.FichaCitopatologica) error {
	err := fu.repository.UpdateFicha(ficha)

	err = fu.anamneseRepository.UpdateDadosAnamnese(ficha.DadosAnamnese)

	err = fu.exameClinicoRepository.UpdateExameClinico(ficha.ExameClinico)

	err = fu.identificacaoLabRepository.UpdateIdentificacaoLab(ficha.IdentificacaoLaboratorio)

	err = fu.resultadoRepository.UpdateResultado(ficha.Resultado)

	return err
}