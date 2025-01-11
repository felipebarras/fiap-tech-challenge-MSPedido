CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255),
    itens JSONB,
    status VARCHAR(50)
)