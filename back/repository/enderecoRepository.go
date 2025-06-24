package repository

import (
	"back/model"
	"database/sql"
)

type EnderecoRepository struct {
	connection *sql.DB
}

func NewEnderecoRepository(conn *sql.DB) EnderecoRepository {
	return EnderecoRepository{
		connection: conn,
	}
}

func (er *EnderecoRepository) CreateEndereco(endereco *model.Endereco) (*model.Endereco, error) {
	query, err := er.connection.Prepare(`
		INSERT INTO endereco (logradouro, numero, complemento, bairro, cidade, uf, cep, referencia)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id`)
	if err != nil {
		return nil, err
	}
	
	defer query.Close()

	err = query.QueryRow(
		endereco.Logradouro,
		endereco.Numero,
		endereco.Complemento,
		endereco.Bairro,
		endereco.Cidade,
		endereco.Uf,
		endereco.CEP,
		endereco.Referencia,
	).Scan(&endereco.ID)

	if err != nil {
		return nil, err
	}

	return endereco, nil
}

func (er *EnderecoRepository) UpdateEndereco(endereco *model.Endereco) error {
	query, err := er.connection.Prepare(`
		UPDATE endereco 
		SET 
			logradouro = $1,
			numero = $2,
			complemento = $3,
			bairro = $4,
			cidade = $5,
			uf = $6,
			cep = $7,
			referencia = $8
		WHERE id = $9
	`)
	if err != nil {
		return err
	}
	defer query.Close()

	_, err = query.Exec(
		endereco.Logradouro,
		endereco.Numero,
		endereco.Complemento,
		endereco.Bairro,
		endereco.Cidade,
		endereco.Uf,
		endereco.CEP,
		endereco.Referencia,
		endereco.ID,
	)

	return err
}

func (er *EnderecoRepository) GetEnderecoByID(id int) (*model.Endereco, error) {
	query, err := er.connection.Prepare("SELECT id, logradouro, numero, complemento, bairro, cidade, uf, cep, referencia FROM endereco WHERE id = $1")
	if err != nil {
		return nil, err
	}

	var endereco model.Endereco

	err = query.QueryRow(id).Scan(
		&endereco.ID,
		&endereco.Logradouro,
		&endereco.Numero,
		&endereco.Complemento,
		&endereco.Bairro,
		&endereco.Cidade,
		&endereco.Uf,
		&endereco.CEP,
		&endereco.Referencia,
	)

	defer query.Close()

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &endereco, nil
}