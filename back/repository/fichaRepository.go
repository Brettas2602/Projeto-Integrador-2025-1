package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type FichaRepository struct {
	connection *sql.DB
}

func NewFichaRepository(conn *sql.DB) FichaRepository {
	return FichaRepository{
		connection: conn,
	}
}

func (fr *FichaRepository) CreateFicha(ficha *model.FichaCitopatologica) (*model.FichaCitopatologica, error) {
	query, err := fr.connection.Prepare("INSERT INTO ficha_citopatologica (paciente_id, numero_protocolo, risco) VALUES ($1, $2, $3) RETURNING id, data_criacao, risco")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	err = query.QueryRow(ficha.PacienteID, ficha.NumeroProtocolo, ficha.Risco).Scan(
		&ficha.ID,
		&ficha.DataCriacao,
		&ficha.Risco,
	)
	if err != nil {
		return nil, err
	}

	return ficha, nil
}

func (fr *FichaRepository) UpdateFicha(ficha *model.FichaCitopatologica) error {
	query, err := fr.connection.Prepare(`
		UPDATE ficha_citopatologica
		SET 
			paciente_id = $1,
			numero_protocolo = $2,
			risco = $3
		WHERE id = $4
	`)
	if err != nil {
		return err
	}
	defer query.Close()

	_, err = query.Exec(
		ficha.PacienteID,
		ficha.NumeroProtocolo,
		ficha.Risco,
		ficha.ID,
	)

	return err
}

func (fr *FichaRepository) GetFichasByPaciente(idPaciente int) ([]model.FichaCitopatologica, error) {
	query, err := fr.connection.Prepare("SELECT * FROM ficha_citopatologica WHERE paciente_id = $1")
	if err != nil {
		return []model.FichaCitopatologica{}, err
	}

	defer query.Close()

	rows, err := query.Query(idPaciente)
	if err != nil {
		return []model.FichaCitopatologica{}, err
	}

	var fichaList []model.FichaCitopatologica
	var fichaObj model.FichaCitopatologica

	for rows.Next() {
		err = rows.Scan(
			&fichaObj.ID,
			&fichaObj.PacienteID,
			&fichaObj.DataCriacao,
			&fichaObj.NumeroProtocolo,
			&fichaObj.Risco,
		)

		if err != nil {
			return []model.FichaCitopatologica{}, err
		}

		fichaList = append(fichaList, fichaObj)
	}

	return fichaList, nil
}

func (fr *FichaRepository) DeleteFichaByID(id *int) error {
	query, err := fr.connection.Prepare("DELETE FROM ficha_citopatologica WHERE id = $1")
	if err != nil {
		return err
	}
	defer query.Close()

	result, err := query.Exec(id)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("Nenhuma ficha com o id %v foi encontrada", id)
	}

	return nil
}

func (fr *FichaRepository) GetLastFichaWithRiskByIdPaciente(idPaciente int) (*model.FichaCitopatologica, error) {
	query, err := fr.connection.Prepare("SELECT * FROM ficha_citopatologica WHERE paciente_id = $1 AND risco IS NOT NULL ORDER BY id DESC LIMIT 1")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	var fichaObj model.FichaCitopatologica

	err = query.QueryRow(idPaciente).Scan(
		&fichaObj.ID,
		&fichaObj.PacienteID,
		&fichaObj.DataCriacao,
		&fichaObj.NumeroProtocolo,
		&fichaObj.Risco,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &fichaObj, nil

}
