const { total, formaterPrix } = require('../../src/prix');
describe('prix', () => {
  test('calcule un total', () => expect(total(12.5, 2)).toBe(25));
  test('refuse une quantite negative', () => expect(() => total(12, -1)).toThrow());
  test('formate le prix en MAD', () => expect(formaterPrix(15)).toBe('15.00 MAD'));
});
