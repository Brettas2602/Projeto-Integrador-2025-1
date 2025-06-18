package useCase

import (
	"back/model"
	"back/repository"
	"database/sql"
)

type PacienteUseCase struct {
	repository repository.PacienteRepository
	enderecoRepository repository.EnderecoRepository
	fichaRepository repository.FichaRepository
	anamneseRepository repository.DadosAnamneseRepository
	exameClinicoRepository repository.ExameClinicoRepository
	identificacaoLabRepository repository.IdentificacaoLabRepository
	resultadoRepository repository.ResultadoRepository
}

func NewPacienteUseCase(
	repo repository.PacienteRepository,
	enderecoRepo repository.EnderecoRepository,
	fichaRepo repository.FichaRepository,
	anamnseRepo repository.DadosAnamneseRepository,
	exameClinicoRepo repository.ExameClinicoRepository,
	identificacaoRepo repository.IdentificacaoLabRepository,
	resultadoRepo repository.ResultadoRepository,
) PacienteUseCase {
	return PacienteUseCase{
		repository: repo,
		enderecoRepository: enderecoRepo,
		fichaRepository: fichaRepo,
		anamneseRepository: anamnseRepo,
		exameClinicoRepository: exameClinicoRepo,
		identificacaoLabRepository: identificacaoRepo,
		resultadoRepository: resultadoRepo,
	}
}

func (pu *PacienteUseCase) CreatePaciente(paciente *model.Paciente) (*model.Paciente, error) {
	endereco, err := pu.enderecoRepository.CreateEndereco(paciente.Endereco)
	if err != nil {
		return nil, err
	}

	paciente.EnderecoID = endereco.ID

	createdPaciente, err := pu.repository.CreatePaciente(paciente)
	if err != nil {
		return nil, err
	}

	return createdPaciente, nil
}

func (pu *PacienteUseCase) GetPacienteByCpf(cpf string) (*model.Paciente, error) {
	paciente, err := pu.repository.GetPacienteByCpf(cpf)
	if err != nil {
		return nil, err
	}

	paciente.Endereco, err = pu.enderecoRepository.GetEnderecoByID(*paciente.EnderecoID)
	if err != nil {
		return nil, err
	}

	fichas, err := pu.fichaRepository.GetFichasByPaciente(*paciente.ID)
	if err != nil {
		return nil, err
	}

	if fichas != nil {
		for i := range fichas {
			fichas[i].DadosAnamnese, err = pu.anamneseRepository.GetDadosAnamneseByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].ExameClinico, err = pu.exameClinicoRepository.GetExameClinicoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].IdentificacaoLaboratorio, err = pu.identificacaoLabRepository.GetIdentificacaoLabByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].Resultado, err = pu.resultadoRepository.GetResultadoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
		}
	}

	paciente.Fichas = &fichas
	return paciente, nil
}

func (pu *PacienteUseCase) GetAllPacienteByName(nome string) ([]model.Paciente, error){
	pacientes, err := pu.repository.GetAllPacienteByName(nome)
	if err != nil{
		return nil, err
	}

	for i, paciente := range pacientes{
		fichas, err := pu.fichaRepository.GetFichasByPaciente(*paciente.ID)
	if err != nil {
		return nil, err
	}

	if fichas != nil {
		for i := range fichas {
			fichas[i].DadosAnamnese, err = pu.anamneseRepository.GetDadosAnamneseByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].ExameClinico, err = pu.exameClinicoRepository.GetExameClinicoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].IdentificacaoLaboratorio, err = pu.identificacaoLabRepository.GetIdentificacaoLabByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].Resultado, err = pu.resultadoRepository.GetResultadoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
		}
	}

		pacientes[i].Fichas = &fichas
	}

	return pacientes, nil
}

func (pu *PacienteUseCase) GetAllPacienteByAge(idadeInicial, idadeFinal int) ([]model.Paciente, error){
	pacientes, err := pu.repository.GetAllPacienteByAge(idadeInicial, idadeFinal)
	if err != nil{
		return nil, err
	}

	for i, paciente := range pacientes{
		fichas, err := pu.fichaRepository.GetFichasByPaciente(*paciente.ID)
	if err != nil {
		return nil, err
	}

	if fichas != nil {
		for i := range fichas {
			fichas[i].DadosAnamnese, err = pu.anamneseRepository.GetDadosAnamneseByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].ExameClinico, err = pu.exameClinicoRepository.GetExameClinicoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].IdentificacaoLaboratorio, err = pu.identificacaoLabRepository.GetIdentificacaoLabByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
	
			fichas[i].Resultado, err = pu.resultadoRepository.GetResultadoByFichaID(*fichas[i].ID)
			if err != nil && err != sql.ErrNoRows {
				return nil, err
			}
		}
	}

		pacientes[i].Fichas = &fichas
	}

	return pacientes, nil
}