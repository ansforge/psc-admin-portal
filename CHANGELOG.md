# Changelog — psc-admin-portal

## [2026-03-31]

### Modifié

#### Interrogation PS — recherche par nom/prénom
- Affichage des résultats enrichis depuis `psc-ps-api /v2/ps/search/name` :
  - Le **code profession** (`professionCode`) est affiché une fois par résultat
  - Les **raisons sociales** (`workLocations`) sont listées avec `companyName` et `companyCedexOffice`
- Remplacement de l'ancien modèle `companyNames: string[]` par le format `psc-ps-api` :
  - `professionCode: string | null` (niveau racine du résultat)
  - `workLocations: { companyName, companyCedexOffice }[]`

#### Fichiers modifiés
- `src/app/api/psApi.service.ts` — type de retour `searchPsByName` mis à jour
- `src/app/interrogation-ps/interrogation-ps.component.ts` — type `nameResults` aligné
- `src/app/interrogation-ps/interrogation-ps.component.html` — template mis à jour pour itérer sur `workLocations`
