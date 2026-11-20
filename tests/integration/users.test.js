const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db');
describe('API mini-boutique', () => {
  afterAll(async () => { await pool.end(); });
  test('identifiant invalide renvoie 400', async () => {
    const res = await request(app).get('/users/abc');
    expect(res.status).toBe(400);
    expect(res.body.erreur).toBe('id invalide');
  });
  test('utilisateur present renvoie 200', async () => {
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('demo@boutique.test');
  });
  test('utilisateur absent renvoie 404', async () => {
    const res = await request(app).get('/users/99999');
    expect(res.status).toBe(404);
  });
  test('mauvais mot de passe renvoie 401', async () => {
    const res = await request(app).post('/login').send({ email: 'demo@boutique.test', password: 'faux' });
    expect(res.status).toBe(401);
  });
});
