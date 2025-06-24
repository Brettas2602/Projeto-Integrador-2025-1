package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type IdentificacaoLabRepository struct {
	connection *sql.DB
}

func NewIdentificacaoLabRepository(conn *sql.DB) IdentificacaoLabRepository {
	return IdentificacaoLabRepository{connection: conn}
}

func (ir *IdentificacaoLabRepository) GetIdentificacaoLabByFichaID(fichaID int) (*model.IdentificacaoLaboratorio, error) {
	query, err := ir.connection.Prepare(`SELECT id, ficha_id, cnes_laboratorio, nome, numero_exame, recebido_em FROM identificacao_laboratorio WHERE ficha_id = $1`)
	if err != nil {
		return nil, err
	}

	var res model.IdentificacaoLaboratorio

	err = query.QueryRow(fichaID).Scan(&res.ID, &res.FichaID, &res.CnesLaboratorio, &res.Nome, &res.NumeroExame, &res.RecebidoEm)
	if err != nil {
		return nil, err
	}
	
	return &res, nil
}

func (ir *IdentificacaoLabRepository) CreateIdentificacaoLab(ident *model.IdentificacaoLaboratorio) (*model.IdentificacaoLaboratorio, error) {
	query := `
		INSERT INTO identificacao_laboratorio (
			ficha_id, cnes_laboratorio, nome, numero_exame, recebido_em
		) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	err := ir.connection.QueryRow(
		query,
		ident.FichaID,
		ident.CnesLaboratorio,
		ident.Nome,
		ident.NumeroExame,
		ident.RecebidoEm,
	).Scan(&ident.ID)

	if err != nil {
		return nil, err
	}

	return ident, nil
}

func (ir *IdentificacaoLabRepository) UpdateIdentificacaoLab(ident *model.IdentificacaoLaboratorio) error {
	query := `
		UPDATE identificacao_laboratorio SET
			ficha_id = $1,
			cnes_laboratorio = $2,
			nome = $3,
			numero_exame = $4,
			recebido_em = $5
		WHERE id = $6
	`

	_, err := ir.connection.Exec(
		query,
		ident.FichaID,
		ident.CnesLaboratorio,
		ident.Nome,
		ident.NumeroExame,
		ident.RecebidoEm,
		ident.ID,
	)

	return err
}

func (ur *IdentificacaoLabRepository) DeleteIdentificaçãoLabByCpf(id int) error {
	query, err := ur.connection.Prepare("DELETE FROM identificacao_laboratorio WHERE id = $1")
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
		return fmt.Errorf("Nenhum paciente foi encontrado com o id %v", id)
	}

	return nil
}