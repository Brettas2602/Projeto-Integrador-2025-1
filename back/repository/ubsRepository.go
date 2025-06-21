package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type UbsRepository struct {
	connection *sql.DB
}

func NewUbsRepository(conn *sql.DB) UbsRepository {
	return UbsRepository{
		connection: conn,
	}
}

func (ur *UbsRepository) GetUbsByID(id int) (*model.Ubs, error) {
	query, err := ur.connection.Prepare("SELECT id, endereco_id, nome, cnes, prontuario FROM ubs WHERE id = $1")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	var ubs model.Ubs

	err = query.QueryRow(id).Scan(
		&ubs.ID,
		&ubs.EnderecoID,
		&ubs.Nome,
		&ubs.CNES,
		&ubs.Prontuario,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &ubs, nil
}

func (ur *UbsRepository) DeleteUbsByID (id int) error {
	query, err := ur.connection.Prepare("DELETE FROM ubs WHERE id = $1")
	if err != nil {
		return err
	}
	defer query.Close()

	result, err := query.Exec(id)
	if err != nil {
		return err
	}

	affectedRows, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if affectedRows == 0 {
		return fmt.Errorf("Nenhuma UBS foi encontrada com o id %v", id)
	}

	return nil
}

func (ur *UbsRepository) GetAllUbs()([]model.Ubs, error){
	rows, err := ur.connection.Query("SELECT * FROM ubs")
	if err != nil{
		return nil	, err
	}

	var ubsList[]model.Ubs

	for rows.Next(){
		var ubs model.Ubs
		err := rows.Scan(
			&ubs.ID,
			&ubs.EnderecoID,
			&ubs.Nome,
			&ubs.CNES,
			&ubs.Prontuario,
		)

		if err != nil{
			if err == sql.ErrNoRows{
				return nil,nil
			}

			return nil, err	
		}

		ubsList = append(ubsList, ubs)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return ubsList, nil
}