-- ==========================================
-- 5 CATEGORIAS
-- ==========================================

INSERT INTO categoria (nome, ativo)
VALUES
    ('Alimentos', TRUE),
    ('Bebidas', TRUE),
    ('Produtos de Limpeza', TRUE),
    ('Higiene Pessoal', TRUE),
    ('Material de Escritório', TRUE);


-- ==========================================
-- 5 UNIDADES DE MEDIDA
-- ==========================================

INSERT INTO unidade_medida (nome, sigla, ativo)
VALUES
    ('Unidade', 'UN', TRUE),
    ('Quilograma', 'KG', TRUE),
    ('Litro', 'L', TRUE),
    ('Caixa', 'CX', TRUE),
    ('Pacote', 'PCT', TRUE);


-- ==========================================
-- 20 PRODUTOS
-- ==========================================

INSERT INTO produtos (
    nome,
    unidade_medida_id,
    categoria_id,
    estoque,
    est_min,
    est_max,
    valor_unitario,
    ativo
)
VALUES

-- ALIMENTOS - categoria_id = 1

('Arroz 5kg', 2, 1, 50, 10, 100, 29.90, TRUE),
('Feijão 1kg', 2, 1, 80, 20, 150, 8.99, TRUE),
('Açúcar 1kg', 2, 1, 60, 15, 120, 5.49, TRUE),
('Macarrão 500g', 2, 1, 100, 20, 200, 4.99, TRUE),


-- BEBIDAS - categoria_id = 2

('Refrigerante 2L', 3, 2, 40, 10, 80, 8.50, TRUE),
('Suco de Laranja 1L', 3, 2, 35, 10, 70, 7.90, TRUE),
('Água Mineral 500ml', 1, 2, 150, 30, 300, 2.50, TRUE),
('Café 500g', 2, 2, 45, 10, 90, 16.90, TRUE),


-- PRODUTOS DE LIMPEZA - categoria_id = 3

('Detergente 500ml', 1, 3, 100, 20, 200, 2.99, TRUE),
('Sabão em Pó 1kg', 2, 3, 60, 15, 120, 12.90, TRUE),
('Desinfetante 2L', 3, 3, 50, 10, 100, 9.90, TRUE),
('Água Sanitária 1L', 3, 3, 70, 15, 150, 6.50, TRUE),


-- HIGIENE PESSOAL - categoria_id = 4

('Sabonete', 1, 4, 120, 30, 250, 3.50, TRUE),
('Shampoo 400ml', 1, 4, 50, 10, 100, 18.90, TRUE),
('Creme Dental 90g', 1, 4, 80, 20, 160, 6.99, TRUE),
('Papel Higiênico 12un', 4, 4, 40, 10, 80, 19.90, TRUE),


-- MATERIAL DE ESCRITÓRIO - categoria_id = 5

('Caneta Azul', 1, 5, 200, 50, 400, 2.00, TRUE),
('Caderno 200 Folhas', 1, 5, 60, 15, 120, 22.90, TRUE),
('Papel A4 500 Folhas', 4, 5, 30, 10, 60, 29.90, TRUE),
('Lápis Preto', 1, 5, 150, 30, 300, 1.50, TRUE);