package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type ExameClinicoRepository struct {
	connection *sql.DB
}

func NewExameClinicoRepository(conn *sql.DB) ExameClinicoRepository {
	return ExameClinicoRepository{connection: conn}
}

func (er *ExameClinicoRepository) GetExameClinicoByFichaID(fichaID int) (*model.ExameClinico, error) {
	query, err := er.connection.Prepare(`SELECT id, ficha_id, inspecao_colo, sinais_dst, data_coleta, responsavel FROM exame_clinico WHERE ficha_id = $1`)
	if err != nil {
		return nil, err
	}

	var res model.ExameClinico

	err = query.QueryRow(fichaID).Scan(&res.ID, &res.FichaID, &res.InspecaoColo, &res.SinaisDST, &res.DataColeta, &res.Responsavel)
	if err != nil {
		return nil, err
	}

	return &res, nil
}

func (er *ExameClinicoRepository) CreateExameClinico(exame *model.ExameClinico) (*model.ExameClinico, error) {
	query := `
		INSERT INTO exame_clinico (
			ficha_id, inspecao_colo, sinais_dst, data_coleta, responsavel
		) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	err := er.connection.QueryRow(
		query,
		exame.FichaID,
		exame.InspecaoColo,
		exame.SinaisDST,
		exame.DataColeta,
		exame.Responsavel,
	).Scan(&exame.ID)

	if err != nil {
		return nil, err
	}

	return exame, nil
}

func (er *ExameClinicoRepository) UpdateExameClinico(exame *model.ExameClinico) error {
	query := `
		UPDATE exame_clinico SET
			ficha_id = $1,
			inspecao_colo = $2,
			sinais_dst = $3,
			data_coleta = $4,
			responsavel = $5
		WHERE id = $6
	`

	_, err := er.connection.Exec(
		query,
		exame.FichaID,
		exame.InspecaoColo,
		exame.SinaisDST,
		exame.DataColeta,
		exame.Responsavel,
		exame.ID,
	)

	return err
}

func (er *ExameClinicoRepository) DeleteExameClinicoByID (id *int) error {
	query, err := er.connection.Prepare("DELETE FROM exame_clinico WHERE id = $1")
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
		return fmt.Errorf("O exame clínico com o id %v não foi encontrado", id )
	}

	return nil
}