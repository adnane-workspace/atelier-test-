function estIdValide(value) {
  return /^[1-9]\d*$/.test(String(value));
}
function normaliserEmail(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}
module.exports = { estIdValide, normaliserEmail };
