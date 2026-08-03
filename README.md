# MV DESIGN

Application de gestion commerciale (devis & factures) — Next.js + Supabase.

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # puis remplir avec tes vraies valeurs Supabase
npm run dev
```

## Déploiement

Ce projet est fait pour être déployé sur [Vercel](https://vercel.com), connecté à ce dépôt GitHub.
Les variables d'environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) doivent être renseignées dans les réglages du projet Vercel.
