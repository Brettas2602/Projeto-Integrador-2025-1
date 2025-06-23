package useCase

import (
	"back/model"
	"back/repository"
)

type UbsUseCase struct {
	repository repository.UbsRepository
	enderecoRepository repository.EnderecoRepository
}

func NewUbsUseCase(repo repository.UbsRepository, enderecoRepo repository.EnderecoRepository) UbsUseCase  {
	return UbsUseCase{
		repository: repo,
		enderecoRepository: enderecoRepo,
	}
}

func (uu *UbsUseCase) GetUbsByID(id int) (*model.Ubs, error) {
	ubs, err := uu.repository.GetUbsByID(id)
	if err != nil {
		return nil, err
	}

	ubs.Endereco, err = uu.enderecoRepository.GetEnderecoByID(*ubs.EnderecoID)
	if err != nil {
		return nil, err
	}

	return ubs, nil
}

func (uu *UbsUseCase) GetAllUbs()([]model.Ubs, error){
	ubs, err := uu.repository.GetAllUbs()
	if err != nil{
		return nil,err
	}

	return ubs, nil
}