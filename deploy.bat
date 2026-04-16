@echo off
echo Déploiement en cours...
git add .
git commit -m "Mise à jour du site"
git push
echo Site mis à jour sur Vercel !
pause
