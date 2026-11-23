const express = require('express');
const path = require('path');
const { estIdValide } = require('./validation');
const { getUserById } = require('./db');
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/users/:id', async (req, res) => {
  if (!estIdValide(req.params.id)) return res.status(400).json({ erreur: 'id invalide' });
  try {
    const user = await getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ erreur: 'utilisateur introuvable' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ erreur: 'base de donnees indisponible' });
  }
});
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'demo@boutique.test' && password === 'demo123') {
    return res.json({ message: 'connexion reussie' });
  }
  return res.status(401).json({ erreur: 'identifiants invalides' });
});
module.exports = app;
