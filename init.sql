CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);
INSERT INTO users (id, nom, email) VALUES (1, 'Demo', 'demo@boutique.test')
ON CONFLICT (id) DO NOTHING;
