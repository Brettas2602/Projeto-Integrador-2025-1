package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type DadosAnamneseRepository struct {
	connection *sql.DB
}

func NewDadosAnamneseRepository(conn *sql.DB) DadosAnamneseRepository {
	return DadosAnamneseRepository{
		connection: conn,
	}
}

func (dr *DadosAnamneseRepository) GetDadosAnamneseByFichaID(fichaID int) (*model.DadosAnamnese, error) {
	query, err := dr.connection.Prepare(`SELECT id, ficha_id, motivo_exame, data_exame_preventivo, diu, gravida, usa_anticoncepcional, hormonio_menopausa,
		fez_radioterapia, ultima_menstruacao, sangramento_relacoes, sangramento_menopausa
		FROM dados_anamnese WHERE ficha_id = $1`)
	if err != nil {
		return nil, err
	}

	var res model.DadosAnamnese

	err = query.QueryRow(fichaID).Scan(
		&res.ID, &res.FichaID, &res.MotivoExame, &res.DataExamePreventivo, &res.Diu, &res.Gravida,
		&res.Anticoncepcional, &res.HormonioMenopausa, &res.FezRadioterapia,
		&res.UltimaMenstruacao, &res.SangramentoRelacoes, &res.SangramentoMenopausa,
	)
	if err != nil {
		return nil, err
	}
	
	return &res, nil
}

func (dr *DadosAnamneseRepository) CreateDadosAnamnese(dados *model.DadosAnamnese) (*model.DadosAnamnese, error) {
	query := `
		INSERT INTO dados_anamnese (
			ficha_id, motivo_exame, data_exame_preventivo, diu, gravida,
			usa_anticoncepcional, hormonio_menopausa, fez_radioterapia, ultima_menstruacao,
			sangramento_relacoes, sangramento_menopausa
		) VALUES (
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9,
			$10, $11
		) RETURNING id`

	err := dr.connection.QueryRow(
		query,
		dados.FichaID,
		dados.MotivoExame,
		dados.DataExamePreventivo,
		dados.Diu,
		dados.Gravida,
		dados.Anticoncepcional,
		dados.HormonioMenopausa,
		dados.FezRadioterapia,
		dados.UltimaMenstruacao,
		dados.SangramentoRelacoes,
		dados.SangramentoMenopausa,
	).Scan(&dados.ID)

	if err != nil {
		return nil, err
	}

	return dados, nil
}

func (dr *DadosAnamneseRepository) UpdateDadosAnamnese(dados *model.DadosAnamnese) error {
	query := `
		UPDATE dados_anamnese SET
			ficha_id = $1,
			motivo_exame = $2,
			data_exame_preventivo = $3,
			diu = $4,
			gravida = $5,
			usa_anticoncepcional = $6,
			hormonio_menopausa = $7,
			fez_radioterapia = $8,
			ultima_menstruacao = $9,
			sangramento_relacoes = $10,
			sangramento_menopausa = $11
		WHERE id = $12
	`

	_, err := dr.connection.Exec(
		query,
		dados.FichaID,
		dados.MotivoExame,
		dados.DataExamePreventivo,
		dados.Diu,
		dados.Gravida,
		dados.Anticoncepcional,
		dados.HormonioMenopausa,
		dados.FezRadioterapia,
		dados.UltimaMenstruacao,
		dados.SangramentoRelacoes,
		dados.SangramentoMenopausa,
		dados.ID,
	)

	return err
}

func (dr *DadosAnamneseRepository) DeleteDadosAnamneseByID(id *int) error {
	query, err := dr.connection.Prepare("DELETE FROM dados_anamnese WHERE id = $1")
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
		return fmt.Errorf("a anamnese com o id %v não foi encontrada", id )
	}

	return nil
}