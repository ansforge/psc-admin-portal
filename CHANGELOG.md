<!--

    Copyright © 2022-2026 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
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
