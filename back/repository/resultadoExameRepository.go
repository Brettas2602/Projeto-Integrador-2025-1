package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type ResultadoRepository struct {
	connection *sql.DB
}

func NewResultadoRepository(conn *sql.DB) ResultadoRepository {
	return ResultadoRepository{connection: conn}
}

func (rr *ResultadoRepository) GetResultadoByFichaID(fichaID int) (*model.ResultadoExameCitopatologico, error) {
	query, err := rr.connection.Prepare(`SELECT id, ficha_id, amostra_rejeitada_por, epitelios, adequabilidade, normalidade,
		alteracoes_calulares, microbiologia, celulas_atipicas, atipia_escamosa,
		atipia_glandular, neoplasias_malignas, celulas_endometriais,
		observacoes_gerais, screening_citotecnico, responsavel, data_resultado
		FROM resultado_exame_citopatologico WHERE ficha_id = $1`)
	if err != nil {
		return nil, err
	}

	var res model.ResultadoExameCitopatologico

	err = query.QueryRow(fichaID).Scan(
		&res.ID, &res.FichaID, &res.AmostraRejeitada, &res.Epitelios, &res.Adequabilidade,
		&res.Normalidade, &res.AlteracoesCalulares, &res.MicroBiologia, &res.CelulasAtipicas,
		&res.AtipiaEscamosa, &res.AtipiaGlandular, &res.NeoplasiasMalignas, &res.CelulasEndometriais,
		&res.ObservacoesGerais, &res.ScreeningCitotecnico, &res.Responsavel, &res.DataResultado,
	)
	if err != nil {
		return nil, err
	}
	
	return &res, nil
}

func (rr *ResultadoRepository) CreateResultado(resultado *model.ResultadoExameCitopatologico) (*model.ResultadoExameCitopatologico, error) {
	query := `
		INSERT INTO resultado_exame_citopatologico (
			ficha_id, amostra_rejeitada_por, epitelios, adequabilidade, normalidade,
			alteracoes_calulares, microbiologia, celulas_atipicas, atipia_escamosa,
			atipia_glandular, neoplasias_malignas, celulas_endometriais,
			observacoes_gerais, screening_citotecnico, responsavel, data_resultado
		) VALUES (
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9,
			$10, $11, $12,
			$13, $14, $15, $16
		) RETURNING id`

	err := rr.connection.QueryRow(
		query,
		resultado.FichaID,
		resultado.AmostraRejeitada,
		resultado.Epitelios,
		resultado.Adequabilidade,
		resultado.Normalidade,
		resultado.AlteracoesCalulares,
		resultado.MicroBiologia,
		resultado.CelulasAtipicas,
		resultado.AtipiaEscamosa,
		resultado.AtipiaGlandular,
		resultado.NeoplasiasMalignas,
		resultado.CelulasEndometriais,
		resultado.ObservacoesGerais,
		resultado.ScreeningCitotecnico,
		resultado.Responsavel,
		resultado.DataResultado,
	).Scan(&resultado.ID)

	if err != nil {
		return nil, err
	}

	return resultado, nil
}

func (rr *ResultadoRepository) UpdateResultado(resultado *model.ResultadoExameCitopatologico) error {
	query := `
		UPDATE resultado_exame_citopatologico SET
			ficha_id = $1,
			amostra_rejeitada_por = $2,
			epitelios = $3,
			adequabilidade = $4,
			normalidade = $5,
			alteracoes_calulares = $6,
			microbiologia = $7,
			celulas_atipicas = $8,
			atipia_escamosa = $9,
			atipia_glandular = $10,
			neoplasias_malignas = $11,
			celulas_endometriais = $12,
			observacoes_gerais = $13,
			screening_citotecnico = $14,
			responsavel = $15,
			data_resultado = $16
		WHERE id = $17
	`

	_, err := rr.connection.Exec(
		query,
		resultado.FichaID,
		resultado.AmostraRejeitada,
		resultado.Epitelios,
		resultado.Adequabilidade,
		resultado.Normalidade,
		resultado.AlteracoesCalulares,
		resultado.MicroBiologia,
		resultado.CelulasAtipicas,
		resultado.AtipiaEscamosa,
		resultado.AtipiaGlandular,
		resultado.NeoplasiasMalignas,
		resultado.CelulasEndometriais,
		resultado.ObservacoesGerais,
		resultado.ScreeningCitotecnico,
		resultado.Responsavel,
		resultado.DataResultado,
		resultado.ID,
	)

	return err
}

func (ur *ResultadoRepository) DeleteResultadoExameByID (id int) error {
	query, err := ur.connection.Prepare("DELETE FROM resultado_exame_citopatologico WHERE id = $1")
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
		return fmt.Errorf("Nenhum resultado de exame foi encontrado com o id %v", id)
	}

	return nil
}
