
-- Tabela: endereco
CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    uf CHAR(2),
    cep CHAR(9),
    referencia VARCHAR(100)
);

-- Tabela: ubs
CREATE TABLE ubs (
    id SERIAL PRIMARY KEY,
    endereco_id INT REFERENCES endereco(id),
    nome VARCHAR(100),
    cnes CHAR(7),
    prontuario VARCHAR(10)
);

-- Tabela: medico
CREATE TABLE medico (
    id SERIAL PRIMARY KEY,
    id_ubs INT REFERENCES ubs(id),
    crm VARCHAR(15),
    email VARCHAR(256),
    cpf CHAR(11) UNIQUE,
    senha VARCHAR(250),
    nome VARCHAR(200)
);

-- Tabela: enfermeiro
CREATE TABLE enfermeiro (
    id SERIAL PRIMARY KEY,
    id_ubs INT REFERENCES ubs(id),
    coren VARCHAR(15),
    email VARCHAR(256),
    cpf CHAR(11) UNIQUE,
    senha VARCHAR(250),
    nome VARCHAR(200)
);

-- Tabela: paciente
CREATE TABLE paciente (
    id SERIAL PRIMARY KEY,
    endereco_id INT REFERENCES endereco(id),
    id_ubs INT REFERENCES ubs(id),
    cartao_sus VARCHAR(15) UNIQUE,
    nome VARCHAR(250),
    nome_mae VARCHAR(250),
    apelido VARCHAR(250),
    cpf CHAR(11) UNIQUE,
    senha VARCHAR(80),
    nacionalidade VARCHAR(50),
    data_nascimento DATE,
    cor VARCHAR(30),
    telefone VARCHAR(15),
    escolaridade VARCHAR(50)
);

-- Tabela: ficha_citopatologica
CREATE TABLE ficha_citopatologica (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES paciente(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    numero_protocolo INT,
    risco VARCHAR(5)
);

-- Tabela: dados_anamnese
CREATE TABLE dados_anamnese (
    id SERIAL PRIMARY KEY,
    ficha_id INT REFERENCES ficha_citopatologica(id) ON DELETE CASCADE,
    motivo_exame VARCHAR(100),
    data_exame_preventivo DATE,
    diu BOOLEAN,
    gravida BOOLEAN,
    usa_anticoncepcional BOOLEAN,
    hormonio_menopausa BOOLEAN,
    fez_radioterapia BOOLEAN,
    ultima_menstruacao DATE,
    sangramento_relacoes BOOLEAN,
    sangramento_menopausa BOOLEAN
);

-- Tabela: exame_clinico
CREATE TABLE exame_clinico (
    id SERIAL PRIMARY KEY,
    ficha_id INT REFERENCES ficha_citopatologica(id) ON DELETE CASCADE,
    inspecao_colo VARCHAR(50),
    sinais_dst BOOLEAN,
    data_coleta DATE,
    responsavel VARCHAR(250)
);

-- Tabela: identificacao_laboratorio
CREATE TABLE identificacao_laboratorio (
    id SERIAL PRIMARY KEY,
    ficha_id INT REFERENCES ficha_citopatologica(id) ON DELETE CASCADE,
    cnes_laboratorio CHAR(7),
    nome VARCHAR(100),
    numero_exame VARCHAR(20),
    recebido_em DATE
);

-- Tabela: resultado_exame_citopatologico
CREATE TABLE resultado_exame_citopatologico (
    id SERIAL PRIMARY KEY,
    ficha_id INT REFERENCES ficha_citopatologica(id) ON DELETE CASCADE,
    amostra_rejeitada_por VARCHAR(100),
    epitelios VARCHAR(100),
    adequabilidade VARCHAR(100),
    normalidade BOOLEAN,
    alteracoes_calulares VARCHAR(100),
    microbiologia VARCHAR(100),
    celulas_atipicas VARCHAR(100),
    atipia_escamosa VARCHAR(200),
    atipia_glandular VARCHAR(100),
    neoplasias_malignas VARCHAR(100),
    celulas_endometriais BOOLEAN,
    observacoes_gerais TEXT,
    screening_citotecnico VARCHAR(100),
    responsavel VARCHAR(150),
    data_resultado DATE
);

-- Tabela: exames
CREATE TABLE exames (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES paciente(id) ON DELETE CASCADE,
    imagem_exame BYTEA
);

-- Tabela: consultas
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES paciente(id) ON DELETE CASCADE,
    data TIMESTAMP,
    ubs_id INT REFERENCES ubs(id)
);

--Criar uma ubs com endereço
INSERT INTO endereco (logradouro, bairro, cidade, uf) VALUES (
	'Alameda Palmeiras', 
	'Chácaras Califórnia',
	'Goiânia',
	'GO'
);

INSERT INTO ubs (endereco_id, nome, cnes) VALUES (
	1,
	'Instituto de Informática',
	1234567
);
