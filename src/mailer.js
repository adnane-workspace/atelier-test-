async function envoyerEmailFictif(destination, sujet) {
  return { simulated: true, destination, sujet };
}
module.exports = { envoyerEmailFictif };
