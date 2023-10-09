CREATE TABLE "ProductTypeormEntity" (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    stock INTEGER,
    price DOUBLE PRECISION
);

INSERT INTO "ProductTypeormEntity" (id, name, stock, price) VALUES
    ('2f2c84d7-4d9a-4d5a-aae1-4db5de9e6f21', 'Guitar', 10, 500),
    ('5f12db72-8f70-4a78-8163-9b86f2000b8d', 'Lute', 5, 1500);
