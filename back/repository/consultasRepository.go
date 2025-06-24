package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type ConsultasRepository struct {
	connection *sql.DB
}

func NewConsultasRepository (conn *sql.DB) ConsultasRepository {
	return ConsultasRepository{
		connection: conn,
	}
}

func (cr *ConsultasRepository) CreateConsultas (consultas *model.Consultas) (*model.Consultas, error) {
	query, err := cr.connection.Prepare("INSERT INTO consultas (paciente_id, data, ubs_id) VALUES ($1, $2, $3) RETURNING id")
	if err != nil {
		return nil, err
	}
	defer query.Close()
	err = query.QueryRow(consultas.PacienteID, consultas.Data, consultas.UbsID).Scan(&consultas.ID)
	if err != nil {
		return nil, err
	}
	return consultas, nil
}

func (cr *ConsultasRepository) GetConsultaByID (id int) (*model.Consultas, error) {
	query, err := cr.connection.Prepare("SELECT * FROM consultas WHERE id = $1")
	if err != nil {
		return nil, err
	}
	defer query.Close()
	var consulta model.Consultas

	err = query.QueryRow(id).Scan(
		&consulta.ID,
		&consulta.PacienteID,
		&consulta.Data,
		&consulta.UbsID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &consulta, nil
}

func (cr *ConsultasRepository) DeleteConsultaByID (id int) error {
	query, err := cr.connection.Prepare("DELETE FROM consultas WHERE id = $1")
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
		return fmt.Errorf("Não foi encontrada nenhuma consulta com o id %v", id)
	}
	return nil
}

func (cr *ConsultasRepository) GetAllConsultas() ([]model.Consultas, error){
	rows, err := cr.connection.Query("SELECT * FROM consultas ORDER BY data ASC")
	if err != nil{
		return nil, err
	}

	var consultasList []model.Consultas

	for rows.Next(){
		var consulta model.Consultas

		err:= rows.Scan(
			&consulta.ID,
			&consulta.PacienteID,
			&consulta.Data,
			&consulta.UbsID,
		)

		if err != nil{
			if err == sql.ErrNoRows{
				return nil, nil
			}

			return nil, err
		}

		consultasList = append(consultasList, consulta)
	}

	if err = rows.Err(); err != nil{
		return nil, err
	}

	return consultasList, nil
}

func (cr *ConsultasRepository) GetLastConsultationByIdPaciente(id int) (*model.Consultas, error){
	query, err:= cr.connection.Prepare("SELECT * FROM consultas WHERE paciente_id = $1 ORDER BY id DESC LIMIT 1")
	if err != nil {
		return nil, err
	}
	defer query.Close()
	var consulta model.Consultas

	err = query.QueryRow(id).Scan(
		&consulta.ID,
		&consulta.PacienteID,
		&consulta.Data,
		&consulta.UbsID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	
	return &consulta, nil
}
func (cr *ConsultasRepository) GetAllConsultasByIdPaciente(paciente_id int) ([]model.Consultas, error){
	query, err := cr.connection.Prepare("SELECT * FROM consultas WHERE paciente_id = $1  AND data::date >= CURRENT_DATE ORDER BY data ASC")
	if err != nil{
		return nil, err
	}

	defer query.Close()
	var consultasList []model.Consultas

	rows, err := query.Query(paciente_id)
	

	for rows.Next(){
		var consulta model.Consultas

		err:= rows.Scan(
			&consulta.ID,
			&consulta.PacienteID,
			&consulta.Data,
			&consulta.UbsID,
		)

		if err != nil{
			if err == sql.ErrNoRows{
				return nil, nil
			}

			return nil, err
		}

		consultasList = append(consultasList, consulta)
	}

	if err = rows.Err(); err != nil{
		return nil, err
	}

	return consultasList, nil
}