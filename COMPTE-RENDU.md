# Atelier 2 — Qualité et sécurité de la mini-boutique

Branche de travail `atelier2`. La mini-boutique combine l’analyse statique SonarQube, l’audit des dépendances npm et le scan de l’image Docker. La CI lance les tests unitaires et l’audit à chaque push et pull request. Les tests PostgreSQL s’exécutent sur les pull requests.

## Comparaison des contrôles

| Contrôle | Périmètre | Cas du TP | Durée mesurée | Condition d’échec | Exécution |
| --- | --- | --- | --- | --- | --- |
| SonarQube | Code JavaScript et couverture LCOV | Couverture de `utils.js` et en-tête Express | À relever | Conditions de la Quality Gate sur le code nouveau | En local dans cet atelier |
| npm audit | Dépendances directes et transitives du lockfile | Version ancienne de lodash dans l’expérience | 6,80 s sur le projet | Au moins un avis de niveau HIGH ou CRITICAL | Chaque push et pull request |
| Trivy | Paquets système et dépendances présents dans l’image | Comparaison des images Node 16 et Node 22 Alpine | À relever | Au moins une vulnérabilité HIGH ou CRITICAL avec un correctif disponible | Après les tests unitaires |

## Analyse statique

1. Un bug produit un comportement incorrect. Une vulnérabilité compromet une propriété de sécurité. Un hotspot signale un usage sensible dont la sécurité dépend du contexte et demande une revue.
2. La gate sur le code nouveau évite d’accumuler de la dette à chaque changement. L’équipe peut traiter les défauts historiques progressivement tout en appliquant les critères aux nouvelles contributions.
3. Le token représente les droits de son propriétaire ou du projet. Le versionner l’expose aux lecteurs du dépôt et de son historique. Le scanner le lit depuis la variable d’environnement `SONAR_TOKEN`.

## Dépendances

1. Une dépendance directe figure dans `package.json`. Une transitive est tirée par une autre dépendance. Sa correction exige souvent une mise à jour du paquet parent compatible avec l’application.
2. L’audit associe un avis à une version installée, même si le code concerné reste inutilisé. On vérifie les conditions d’exposition, la présence en production et les solutions de mise à jour avant de documenter la décision.

## Image Docker

1. L’image inclut des composants indépendants du code métier. Les bibliothèques du système de base et le runtime Node.js constituent deux sources possibles de CVE.
2. `--exit-code 1` transforme la détection au seuil configuré en échec CI. Une gate trop stricte peut bloquer une livraison sans correctif disponible. Une gate trop souple peut laisser passer une faille grave et réparable.
3. Alpine réduit le nombre de composants système. La construction multi-stage livre uniquement les dépendances de production. L’utilisateur `node` réduit les privilèges du processus en cas de compromission.

## Pipeline CI

1. `image-scan` attend `unit` parce que construire puis scanner l’image coûte davantage de temps et de ressources. Un échec rapide des tests suffit à arrêter cette partie du pipeline.
2. SonarQube peut repérer une condition dupliquée dans le code. npm audit peut signaler une dépendance de test vulnérable absente de l’image. Trivy peut repérer un paquet système vulnérable dans l’image.
3. Un faux positif se vérifie avec le contexte technique et une revue. Si une exception ciblée s’impose, on consigne la preuve, le responsable et une échéance de réexamen.

## Résultats locaux vérifiés

- Les 12 tests unitaires passent.
- Le test Playwright de connexion passe avec Chromium.
- Sur la mini-boutique, `npm audit --audit-level=high` a trouvé 0 vulnérabilité.
- `npm ls qs` confirme que `qs` est apporté par Express et Superagent.
- Dans un projet temporaire, lodash 4.17.15 a déclenché 1 vulnérabilité HIGH et un code de retour 1. Après retrait, le nombre de vulnérabilités et le code de retour sont revenus à 0.

## Preuves à joindre

- SonarQube — Quality Gate rouge et verte, avec la durée du scan et la couverture du code nouveau.
- npm audit — audit de l’expérience avant et après correction, avec les codes de retour.
- Trivy — sorties des scans des deux images, nombres HIGH et CRITICAL et tailles mesurées.
- GitHub — lien de pull request, capture des quatre jobs verts et capture du job SCA rouge.

## Relancer les contrôles sous PowerShell

```powershell
docker compose up -d --wait db
npm ci
npm run test:cov
npm audit --audit-level=high
docker build -t atelier-app:1.0 .
docker run --rm atelier-app:1.0 whoami
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ aquasec/trivy:latest image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed atelier-app:1.0
```

Pour SonarQube, démarrer `docker compose up -d sonar-db sonarqube`, attendre le statut `UP` sur `http://localhost:9000/api/system/status` et définir `SONAR_TOKEN` dans le terminal. Pour la référence du TP, passer `-Dsonar.projectVersion=1.0` au scanner depuis l’état de départ. Utiliser la version `1.1` pour comparer les scans rouge et vert de l’exercice.

```powershell
docker run --rm --add-host=host.docker.internal:host-gateway -e SONAR_HOST_URL=http://host.docker.internal:9000 -e SONAR_TOKEN -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli
```
