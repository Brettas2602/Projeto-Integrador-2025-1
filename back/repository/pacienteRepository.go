package repository

import (
	"back/model"
	"database/sql"
	"fmt"
)

type PacienteRepository struct {
	connection *sql.DB
}

func NewPacienteRepository(conn *sql.DB) PacienteRepository {
	return PacienteRepository{
		connection: conn,
	}
}

func (pr *PacienteRepository) CreatePaciente(paciente *model.Paciente) (*model.Paciente, error) {
	query, err := pr.connection.Prepare("INSERT INTO paciente (endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	err = query.QueryRow(paciente.EnderecoID, paciente.IdUbs, paciente.CartaoSUS, paciente.Nome, paciente.NomeMae, paciente.Apelido, paciente.CPF, paciente.Nacionalidade, paciente.DataNascimento, paciente.Cor, paciente.Telefone, paciente.Nacionalidade).Scan(
		&paciente.ID,
	)
	if err != nil {
		return nil, err
	}

	return paciente, nil
}

func (pr *PacienteRepository) GetPacienteByCpf(cpf string) (*model.Paciente, error) {
	query, err := pr.connection.Prepare("SELECT * FROM paciente WHERE cpf = $1")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	var paciente model.Paciente

	err = query.QueryRow(cpf).Scan(
		&paciente.ID,
		&paciente.EnderecoID,
		&paciente.IdUbs,
		&paciente.CartaoSUS,
		&paciente.Nome,
		&paciente.NomeMae,
		&paciente.Apelido,
		&paciente.CPF,
		&paciente.Nacionalidade,
		&paciente.DataNascimento,
		&paciente.Cor,
		&paciente.Telefone,
		&paciente.Escolaridade,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}

	return &paciente, nil
}

func (pc *PacienteRepository) DeletePacienteByID(id int) error {
	query, err := pc.connection.Prepare("DELETE FROM paciente WHERE id = $1")
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

func (pr * PacienteRepository) GetAllPacienteByName(nome string) ([]model.Paciente, error){
    query, err := pr.connection.Prepare("SELECT * FROM paciente WHERE nome ILIKE $1")


    if err != nil{
        return nil, err
    }


    defer query.Close()


    rows, err := query.Query("%"+nome+"%")

    var pacientes []model.Paciente


    for rows.Next(){
        var paciente model.Paciente


        err := rows.Scan(
            &paciente.ID,
            &paciente.EnderecoID,
            &paciente.IdUbs,
            &paciente.CartaoSUS,
            &paciente.Nome,
            &paciente.NomeMae,
            &paciente.Apelido,
            &paciente.CPF,
            &paciente.Nacionalidade,
            &paciente.DataNascimento,
            &paciente.Cor,
            &paciente.Telefone,
            &paciente.Escolaridade,
        )


        if err!= nil{
            if err == sql.ErrNoRows{
                return nil, nil
            }
            return nil, err
        }


        pacientes = append(pacientes, paciente)
    }


    if err = rows.Err(); err != nil {
        return nil, err
    }


    return pacientes, nil
}


func (pu *PacienteRepository) GetAllPacienteByAge(idadeInicial, idadeFinal int) ([]model.Paciente, error){
    query, err := pu.connection.Prepare("SELECT * FROM paciente WHERE DATE_PART('year', AGE(data_nascimento)) BETWEEN $1 AND $2")
    if err != nil{
        return nil, err
    }


    defer query.Close()


    rows, err := query.Query(idadeInicial, idadeFinal)

    var pacientes[]model.Paciente


    for rows.Next(){
        var paciente model.Paciente


        err := rows.Scan(
            &paciente.ID,
            &paciente.EnderecoID,
            &paciente.IdUbs,
            &paciente.CartaoSUS,
            &paciente.Nome,
            &paciente.NomeMae,
            &paciente.Apelido,
            &paciente.CPF,
            &paciente.Nacionalidade,
            &paciente.DataNascimento,
            &paciente.Cor,
            &paciente.Telefone,
            &paciente.Escolaridade,
        )


        if err!= nil{
            if err == sql.ErrNoRows{
                return nil, nil
            }
            return nil, err
        }


        pacientes = append(pacientes, paciente)
    }


    if err = rows.Err(); err != nil {
        return nil, err
    }


    return pacientes, nil
}