const { estIdValide, normaliserEmail } = require('../../src/validation');
describe('validation', () => {
  test('accepte un identifiant positif', () => expect(estIdValide('12')).toBe(true));
  test('rejette un identifiant non numerique', () => expect(estIdValide('abc')).toBe(false));
  test('normalise un email', () => expect(normaliserEmail('  TEST@EXEMPLE.COM ')).toBe('test@exemple.com'));
});
