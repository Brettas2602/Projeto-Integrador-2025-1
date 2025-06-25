package model

type Paciente struct {
	ID             *int                   `json:"id"`
	EnderecoID     *int                   `json:"endereco_id"`
	IdUbs          *int                   `json:"id_ubs"`
	CartaoSUS      *string                `json:"cartao_sus"`
	Nome           *string                `json:"nome"`
	NomeMae        *string                `json:"nome_mae"`
	Apelido        *string                `json:"apelido"`
	CPF            *string                `json:"cpf"`
	Senha          *string                `json:"senha"`
	Nacionalidade  *string                `json:"nacionalidade"`
	DataNascimento *DateOnly              `json:"data_nascimento"`
	Cor            *string                `json:"cor"`
	Telefone       *string                `json:"telefone"`
	Escolaridade   *string                `json:"escolaridade"`
	Idade          *int                   `json:"idade"`
	Endereco       *Endereco              `json:"endereco"`
	Fichas         *[]FichaCitopatologica `json:"fichas"`
	Exames         *[]Exames              `json:"exames"`
	Consultas      *[]Consultas           `json:"consultas"`
}
