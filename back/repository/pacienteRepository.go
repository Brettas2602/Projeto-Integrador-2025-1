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
	query, err := pr.connection.Prepare("INSERT INTO paciente (endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id")	
	if err != nil {
		return nil, err
	}

	defer query.Close()

	err = query.QueryRow(paciente.EnderecoID, paciente.IdUbs, paciente.CartaoSUS, paciente.Nome, paciente.NomeMae, paciente.Apelido, paciente.CPF, paciente.Nacionalidade, paciente.DataNascimento, paciente.Cor, paciente.Telefone, paciente.Escolaridade, paciente.Senha).Scan(
		&paciente.ID,
	)
	if err != nil {
		return nil, err
	}

	return paciente, nil
}

func (pr *PacienteRepository) UpdatePaciente(paciente *model.Paciente) error {
	query, err := pr.connection.Prepare(`
		UPDATE paciente 
		SET 
			endereco_id = $1,
			id_ubs = $2,
			cartao_sus = $3,
			nome = $4,
			nome_mae = $5,
			apelido = $6,
			cpf = $7,
			nacionalidade = $8,
			data_nascimento = $9,
			cor = $10,
			telefone = $11,
			escolaridade = $12,
			senha = $13
		WHERE cpf = $14
	`)
	if err != nil {
		return err
	}
	defer query.Close()

	_, err = query.Exec(
		paciente.EnderecoID,
		paciente.IdUbs,
		paciente.CartaoSUS,
		paciente.Nome,
		paciente.NomeMae,
		paciente.Apelido,
		paciente.CPF,
		paciente.Nacionalidade,
		paciente.DataNascimento,
		paciente.Cor,
		paciente.Telefone,
		paciente.Escolaridade,
		paciente.Senha,
		paciente.CPF,
	)

	return err
}

func (pr *PacienteRepository) GetAllPacientes() ([]model.Paciente, error) {
	rows, err := pr.connection.Query("SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, senha, nacionalidade, data_nascimento, cor, telefone, escolaridade, EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento))::int AS idade FROM paciente")

	if err != nil {
		return nil, err
	}

	var pacientes []model.Paciente

	for rows.Next() {
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
			&paciente.Senha,
			&paciente.Nacionalidade,
			&paciente.DataNascimento,
			&paciente.Cor,
			&paciente.Telefone,
			&paciente.Escolaridade,
			&paciente.Idade,
		)

		if err != nil {
			if err == sql.ErrNoRows {
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

func (pr *PacienteRepository) GetPacienteById(id int) (*model.Paciente, error){
	query, err := pr.connection.Prepare(`SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade FROM paciente WHERE id= $1`)
	if err != nil {
		return nil, err
	}

	defer query.Close()

	var paciente model.Paciente

	err = query.QueryRow(id).Scan(
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

func (pr *PacienteRepository) GetPacienteByCpf(cpf string) (*model.Paciente, error) {
	query, err := pr.connection.Prepare(`SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, senha, nacionalidade, data_nascimento, cor, telefone, escolaridade FROM paciente WHERE cpf = $1`)
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
		&paciente.Senha,
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

func (pr *PacienteRepository) GetLastFourPacientes() ([]model.Paciente, error) {
	rows, err := pr.connection.Query("SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade FROM paciente ORDER BY id DESC LIMIT 4")

	if err != nil {
		return nil, err
	}

	var pacientes []model.Paciente

	for rows.Next() {
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

		if err != nil {
			if err == sql.ErrNoRows {
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

func (pr *PacienteRepository) GetAllPacienteByName(nome string) ([]model.Paciente, error) {
	query, err := pr.connection.Prepare("SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade, EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento))::int AS idade FROM paciente WHERE nome ILIKE $1")

	if err != nil {
		return nil, err
	}

	defer query.Close()

	rows, err := query.Query("%" + nome + "%")

	var pacientes []model.Paciente

	for rows.Next() {
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
			&paciente.Idade,
		)

		if err != nil {
			if err == sql.ErrNoRows {
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

func (pr *PacienteRepository) GetAllPacienteByAge(idadeInicial, idadeFinal int) ([]model.Paciente, error) {
	query, err := pr.connection.Prepare("SELECT id, endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, nacionalidade, data_nascimento, cor, telefone, escolaridade, EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento))::int AS idade FROM paciente WHERE DATE_PART('year', AGE(data_nascimento)) BETWEEN $1 AND $2")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	rows, err := query.Query(idadeInicial, idadeFinal)

	var pacientes []model.Paciente

	for rows.Next() {
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
			&paciente.Idade,
		)

		if err != nil {
			if err == sql.ErrNoRows {
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

func (pr *PacienteRepository) GetAllPacienteByRisk(risco string) ([]model.Paciente, error) {
	query, err := pr.connection.Prepare("SELECT p.id, p.endereco_id, p.id_ubs, p.cartao_sus, p.nome, p.nome_mae, p.apelido, p.cpf, p.nacionalidade, p.data_nascimento, p.cor, p.telefone, p.escolaridade, EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento))::int AS idade FROM paciente p JOIN ficha_citopatologica f ON f.id = (SELECT id FROM ficha_citopatologica WHERE paciente_id = p.id ORDER BY id DESC LIMIT 1) WHERE f.risco = $1 ORDER BY p.nome ASC")
	if err != nil {
		return nil, err
	}

	defer query.Close()

	rows, err := query.Query(risco)
	if err != nil {
		return nil, err
	}

	var pacientes []model.Paciente

	for rows.Next() {
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
			&paciente.Idade,
		)

		if err != nil {
			if err == sql.ErrNoRows {
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

func (pr *PacienteRepository) GetCountPacienteByRisk() ([]model.RiscoQuantidade, error) {
	query, err := pr.connection.Prepare("SELECT f.risco, COUNT(*) AS total_pacientes FROM (SELECT DISTINCT ON (paciente_id) * FROM ficha_citopatologica WHERE risco IS NOT NULL ORDER BY paciente_id, id DESC) AS f GROUP BY f.risco ORDER BY total_pacientes DESC")

	if err != nil {
		return nil, err
	}

	defer query.Close()

	rows, err := query.Query()
	if err != nil {
		return nil, err
	}

	var riscos []model.RiscoQuantidade

	for rows.Next() {
		var risco model.RiscoQuantidade

		err := rows.Scan(
			&risco.Risco,
			&risco.Quantidade,
		)

		if err != nil {
			if err == sql.ErrNoRows {
				return nil, nil
			}
			return nil, err
		}

		riscos = append(riscos, risco)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return riscos, nil
}