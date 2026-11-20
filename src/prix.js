function total(prix, quantite) {
  if (!Number.isFinite(prix) || !Number.isInteger(quantite) || prix < 0 || quantite < 0) {
    throw new Error('prix ou quantite invalide');
  }
  return Math.round(prix * quantite * 100) / 100;
}
function formaterPrix(montant) {
  return `${Number(montant).toFixed(2)} MAD`;
}
module.exports = { total, formaterPrix };
