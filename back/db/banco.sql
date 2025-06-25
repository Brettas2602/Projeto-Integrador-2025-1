
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

INSERT INTO endereco (logradouro, numero, complemento, bairro, cidade, uf, cep, referencia) VALUES
('Rua das Palmeiras', '123', 'Apto 101', 'Jardim América', 'Goiânia', 'GO', '74000-001', 'Próximo ao mercado'),
('Avenida Goiás', '456', '', 'Centro', 'Goiânia', 'GO', '74000-002', 'Em frente à praça'),
('Rua 7', '789', 'Sala 2', 'Setor Oeste', 'Goiânia', 'GO', '74000-003', 'Ao lado da farmácia'),
('Rua 15', '321', '', 'Setor Bueno', 'Goiânia', 'GO', '74000-004', 'Próximo ao shopping'),
('Avenida Tocantins', '654', 'Apto 302', 'Setor Marista', 'Goiânia', 'GO', '74000-005', 'Em frente ao colégio'),
('Rua 24', '987', '', 'Setor Leste', 'Goiânia', 'GO', '74000-006', 'Próximo ao posto de saúde'),
('Avenida 85', '159', 'Bloco B', 'Jardim Guanabara', 'Goiânia', 'GO', '74000-007', 'Ao lado da padaria');

INSERT INTO ubs (endereco_id, nome, cnes, prontuario) VALUES
(1, 'UBS Central', '1234567', 'UBS001'),
(2, 'UBS Setor Oeste', '2345678', 'UBS002'),
(3, 'UBS Setor Bueno', '3456789', 'UBS003'),
(4, 'UBS Setor Marista', '4567890', 'UBS004'),
(5, 'UBS Jardim América', '5678901', 'UBS005');

INSERT INTO medico (id_ubs, crm, email, cpf, senha, nome) VALUES
(1, '12345-GO', 'dr.silva@email.com', '11111111111', 'senha123', 'Dr. João Silva'),
(1, '54321-GO', 'dra.oliveira@email.com', '22222222222', 'senha456', 'Dra. Maria Oliveira'),
(2, '67890-GO', 'dr.santos@email.com', '33333333333', 'senha789', 'Dr. Carlos Santos'),
(3, '09876-GO', 'dra.costa@email.com', '44444444444', 'senha012', 'Dra. Ana Costa'),
(4, '13579-GO', 'dr.pereira@email.com', '55555555555', 'senha345', 'Dr. Luiz Pereira');

INSERT INTO enfermeiro (id_ubs, coren, email, cpf, senha, nome) VALUES
(1, '12345-GO', 'enf.souza@email.com', '66666666666', 'senha123', 'Enf. Carla Souza'),
(1, '54321-GO', 'enf.rodrigues@email.com', '77777777777', 'senha456', 'Enf. Pedro Rodrigues'),
(2, '67890-GO', 'enf.almeida@email.com', '88888888888', 'senha789', 'Enf. Juliana Almeida'),
(3, '09876-GO', 'enf.ferreira@email.com', '99999999999', 'senha012', 'Enf. Marcos Ferreira'),
(4, '13579-GO', 'enf.gomes@email.com', '10101010101', 'senha345', 'Enf. Patricia Gomes');

INSERT INTO paciente (endereco_id, id_ubs, cartao_sus, nome, nome_mae, apelido, cpf, senha, nacionalidade, data_nascimento, cor, telefone, escolaridade) VALUES
(6, 1, '70000000001', 'Ana Paula Mendes', 'Maria Mendes', 'Ana', '12345678901', 'senha1', 'Brasileira', '1985-03-15', 'Branca', '(62) 91111-1111', 'Ensino superior completo'),
(7, 2, '70000000002', 'Carlos Eduardo Lima', 'Joana Lima', 'Carlos', '23456789012', 'senha2', 'Brasileira', '1990-08-22', 'Parda', '(62) 92222-2222', 'Ensino médio completo'),
(6, 3, '70000000003', 'Fernanda Costa Silva', 'Marta Silva', 'Fê', '34567890123', 'senha3', 'Brasileira', '1978-11-30', 'Negra', '(62) 93333-3333', 'Ensino fundamental completo'),
(7, 4, '70000000004', 'Ricardo Alves Pereira', 'Sonia Pereira', 'Ricardo', '45678901234', 'senha4', 'Brasileira', '1995-05-10', 'Branca', '(62) 94444-4444', 'Ensino superior incompleto'),
(6, 5, '70000000005', 'Patricia Oliveira Santos', 'Lucia Santos', 'Paty', '56789012345', 'senha5', 'Brasileira', '1982-07-20', 'Amarela', '(62) 95555-5555', 'Ensino médio completo');

INSERT INTO ficha_citopatologica (paciente_id, numero_protocolo, risco) VALUES
(1, 10001, 'Baixo'),
(2, 10002, 'Alto'),
(3, 10003, 'Médio'),
(4, 10004, 'Baixo'),
(5, 10005, 'Alto');

INSERT INTO dados_anamnese (ficha_id, motivo_exame, data_exame_preventivo, diu, gravida, usa_anticoncepcional, hormonio_menopausa, fez_radioterapia, ultima_menstruacao, sangramento_relacoes, sangramento_menopausa) VALUES
(1, 'Rotina', '2024-05-20', false, false, true, false, false, '2025-06-10', false, false),
(2, 'Sangramento', '2024-04-15', true, false, false, true, false, '2025-05-15', true, false),
(3, 'Follow-up', '2024-03-10', false, true, false, false, true, NULL, false, true),
(4, 'Rotina', '2024-06-01', false, false, true, false, false, '2025-06-05', false, false),
(5, 'Dor pélvica', '2024-02-28', false, false, false, false, false, '2025-05-28', true, false);

INSERT INTO exame_clinico (ficha_id, inspecao_colo, sinais_dst, data_coleta, responsavel) VALUES
(1, 'Normal', false, '2025-06-15', 'Dra. Maria Oliveira'),
(2, 'Alterado', true, '2025-06-10', 'Dr. Carlos Santos'),
(3, 'Normal', false, '2025-06-05', 'Dra. Ana Costa'),
(4, 'Normal', false, '2025-06-20', 'Dr. Luiz Pereira'),
(5, 'Alterado', false, '2025-06-12', 'Dr. João Silva');

INSERT INTO identificacao_laboratorio (ficha_id, cnes_laboratorio, nome, numero_exame, recebido_em) VALUES
(1, '7654321', 'Lab Diagnóstico', 'EX12026', '2025-06-16'),
(2, '7654322', 'Lab Saúde', 'EX12027', '2025-06-11'),
(3, '7654323', 'Lab Central', 'EX12028', '2025-06-06'),
(4, '7654324', 'Lab Citopatologia', 'EX12029', '2025-06-21'),
(5, '7654325', 'Lab Análises', 'EX12030', '2025-06-13');

INSERT INTO resultado_exame_citopatologico (
    ficha_id,
    amostra_rejeitada_por,
    epitelios,
    adequabilidade,
    normalidade,
    alteracoes_calulares,
    microbiologia,
    celulas_atipicas,
    atipia_escamosa,
    atipia_glandular,
    neoplasias_malignas,
    celulas_endometriais,
    observacoes_gerais,
    screening_citotecnico,
    responsavel,
    data_resultado
) VALUES 
(1, '', 'Escamoso', 'Satisfatória', true, '', '', '', '', '', '', false, '', '', 'Técnico A', '2025-06-18'),
(2, 'Amostra insuficiente', 'Escamoso', 'Insatisfatória', false, 'Alterações inflamatórias', 'Presença de fungos', 'Presentes', 'ASC-US', '', '', false, 'Recomenda-se repetir exame', '', 'Técnico B', '2025-06-13'),
(3, '', 'Escamoso e glandular', 'Satisfatória', false, '', '', 'Presentes', 'LSIL', '', '', false, 'Encaminhar para colposcopia', '', 'Técnico C', '2025-06-08'),
(4, '', 'Escamoso', 'Satisfatória', true, '', '', '', '', '', '', false, '', '', 'Técnico A', '2025-06-22'),
(5, 'Sangue', 'Escamoso', 'Parcialmente satisfatória', false, 'Alterações inflamatórias', '', 'Presentes', 'ASC-H', '', '', false, 'Recomenda-se nova coleta', '', 'Técnico B', '2025-06-15');

INSERT INTO exames (paciente_id) VALUES
(1),
(2),
(3),
(4),
(5);

-- Consultas para Abril 2025 (realizadas)
INSERT INTO consultas (paciente_id, data, ubs_id) VALUES
(1, '2025-04-02 08:30:00', 1),
(2, '2025-04-03 10:00:00', 2),
(3, '2025-04-09 14:30:00', 3),
(4, '2025-04-10 09:15:00', 4),
(5, '2025-04-16 11:45:00', 5),
(1, '2025-04-17 08:00:00', 1),
(2, '2025-04-23 10:30:00', 2),
(3, '2025-04-24 13:15:00', 3),
(4, '2025-04-30 09:45:00', 4);

-- Consultas para Maio 2025 (algumas realizadas, outras não comparecimento)
INSERT INTO consultas (paciente_id, data, ubs_id) VALUES
(5, '2025-05-07 11:00:00', 5),
(1, '2025-05-08 14:00:00', 1),
(2, '2025-05-14 08:30:00', 2),
(3, '2025-05-15 10:15:00', 3),
(4, '2025-05-21 14:30:00', 4),
(5, '2025-05-22 09:00:00', 5),
(1, '2025-05-28 11:30:00', 1),
(2, '2025-05-29 13:45:00', 2);

-- Consultas para Junho 2025 (realizadas recentemente)
INSERT INTO consultas (paciente_id, data, ubs_id) VALUES
(3, '2025-06-04 08:15:00', 3),
(4, '2025-06-05 10:45:00', 4),
(5, '2025-06-11 14:00:00', 5),
(1, '2025-06-12 09:30:00', 1),
(2, '2025-06-18 11:15:00', 2),
(3, '2025-06-19 08:45:00', 3),
(4, '2025-06-25 10:30:00', 4),
(5, '2025-06-26 13:15:00', 5);

-- Consultas para Julho 2025
INSERT INTO consultas (paciente_id, data, ubs_id) VALUES
(1, '2025-07-08 08:30:00', 1),
(2, '2025-07-09 10:00:00', 2),
(3, '2025-07-10 14:30:00', 3),
(4, '2025-07-15 09:15:00', 4),
(5, '2025-07-22 11:45:00', 5);

-- Consultas para Agosto 2025
INSERT INTO consultas (paciente_id, data, ubs_id) VALUES
(1, '2025-08-05 08:00:00', 1),
(2, '2025-08-12 10:30:00', 2),
(3, '2025-08-18 13:15:00', 3),
(4, '2025-08-19 09:45:00', 4),
(5, '2025-08-26 11:00:00', 5),
(1, '2025-08-28 14:00:00', 1);
