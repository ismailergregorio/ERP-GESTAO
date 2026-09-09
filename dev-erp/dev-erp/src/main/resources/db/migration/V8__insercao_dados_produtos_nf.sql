-- ============================================================
-- V8 - Inserção dos produtos registrados nas Notas Fiscais
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo,
    descricao,
    data_criacao,
    ativo,
    unidade,
    quant,
    valor_unitario,
    valor_total,
    nf_id
)
SELECT
    'FER001',
    'Furadeira de Impacto 650W',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    10,
    189.90,
    1899.00,
    nf.id
FROM nf
WHERE nf.numero = '100001';


INSERT INTO produtos_registro_nf (
    codigo,
    descricao,
    data_criacao,
    ativo,
    unidade,
    quant,
    valor_unitario,
    valor_total,
    nf_id
)
SELECT
    'FER002',
    'Parafusadeira 12V',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    15,
    159.90,
    2398.50,
    nf.id
FROM nf
WHERE nf.numero = '100001';


INSERT INTO produtos_registro_nf (
    codigo,
    descricao,
    data_criacao,
    ativo,
    unidade,
    quant,
    valor_unitario,
    valor_total,
    nf_id
)
SELECT
    'FER003',
    'Jogo de Chaves de Fenda 6 peças',
    CURRENT_TIMESTAMP,
    TRUE,
    'JG',
    20,
    49.90,
    998.00,
    nf.id
FROM nf
WHERE nf.numero = '100001';


-- ============================================================
-- NF 100002
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'FER004',
    'Martelo de Unha 25mm',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    30,
    35.90,
    1077.00,
    nf.id
FROM nf
WHERE nf.numero = '100002';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'FER005',
    'Alicate Universal 8 Polegadas',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    25,
    42.50,
    1062.50,
    nf.id
FROM nf
WHERE nf.numero = '100002';


-- ============================================================
-- NF 200001
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'ELE001',
    'Cabo HDMI 2 Metros',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    50,
    29.90,
    1495.00,
    nf.id
FROM nf
WHERE nf.numero = '200001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'ELE002',
    'Teclado USB',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    30,
    59.90,
    1797.00,
    nf.id
FROM nf
WHERE nf.numero = '200001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'ELE003',
    'Mouse USB Óptico',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    40,
    35.90,
    1436.00,
    nf.id
FROM nf
WHERE nf.numero = '200001';


-- ============================================================
-- NF 200002
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'ELE004',
    'Monitor LED 24 Polegadas',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    10,
    649.90,
    6499.00,
    nf.id
FROM nf
WHERE nf.numero = '200002';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'ELE005',
    'Webcam Full HD',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    15,
    189.90,
    2848.50,
    nf.id
FROM nf
WHERE nf.numero = '200002';


-- ============================================================
-- NF 300001
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'CON001',
    'Cimento CP II 50KG',
    CURRENT_TIMESTAMP,
    TRUE,
    'SC',
    100,
    38.90,
    3890.00,
    nf.id
FROM nf
WHERE nf.numero = '300001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'CON002',
    'Argamassa AC II 20KG',
    CURRENT_TIMESTAMP,
    TRUE,
    'SC',
    80,
    29.90,
    2392.00,
    nf.id
FROM nf
WHERE nf.numero = '300001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'CON003',
    'Tijolo Cerâmico 8 Furos',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    1000,
    1.20,
    1200.00,
    nf.id
FROM nf
WHERE nf.numero = '300001';


-- ============================================================
-- NF 300002
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'CON004',
    'Areia Média',
    CURRENT_TIMESTAMP,
    TRUE,
    'M3',
    20,
    145.00,
    2900.00,
    nf.id
FROM nf
WHERE nf.numero = '300002';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'CON005',
    'Brita Nº 1',
    CURRENT_TIMESTAMP,
    TRUE,
    'M3',
    15,
    160.00,
    2400.00,
    nf.id
FROM nf
WHERE nf.numero = '300002';


-- ============================================================
-- NF 400001
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'MOV001',
    'Mesa para Escritório',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    10,
    459.90,
    4599.00,
    nf.id
FROM nf
WHERE nf.numero = '400001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'MOV002',
    'Cadeira de Escritório',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    20,
    389.90,
    7798.00,
    nf.id
FROM nf
WHERE nf.numero = '400001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'MOV003',
    'Armário de Escritório',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    5,
    699.90,
    3499.50,
    nf.id
FROM nf
WHERE nf.numero = '400001';


-- ============================================================
-- NF 400002
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'MOV004',
    'Estante de Aço',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    10,
    549.90,
    5499.00,
    nf.id
FROM nf
WHERE nf.numero = '400002';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'MOV005',
    'Gaveteiro para Escritório',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    15,
    299.90,
    4498.50,
    nf.id
FROM nf
WHERE nf.numero = '400002';


-- ============================================================
-- NF 500001
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'AUT001',
    'Óleo Lubrificante 5W30 1L',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    50,
    39.90,
    1995.00,
    nf.id
FROM nf
WHERE nf.numero = '500001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'AUT002',
    'Filtro de Óleo',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    30,
    28.90,
    867.00,
    nf.id
FROM nf
WHERE nf.numero = '500001';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'AUT003',
    'Filtro de Ar',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    30,
    35.90,
    1077.00,
    nf.id
FROM nf
WHERE nf.numero = '500001';


-- ============================================================
-- NF 500002
-- ============================================================

INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'AUT004',
    'Pastilha de Freio Dianteira',
    CURRENT_TIMESTAMP,
    TRUE,
    'JG',
    20,
    129.90,
    2598.00,
    nf.id
FROM nf
WHERE nf.numero = '500002';


INSERT INTO produtos_registro_nf (
    codigo, descricao, data_criacao, ativo, unidade,
    quant, valor_unitario, valor_total, nf_id
)
SELECT
    'AUT005',
    'Palheta Limpador de Para-brisa',
    CURRENT_TIMESTAMP,
    TRUE,
    'UN',
    40,
    45.90,
    1836.00,
    nf.id
FROM nf
WHERE nf.numero = '500002';