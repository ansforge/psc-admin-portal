///
/// Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

export interface IdType {
  id:  number;
  name: string;
}

export const idTypeEnum: IdType[]=[
  {id: 0, name: 'ADELI'},
  {id: 1, name: 'Cabinet ADELI/Rang'},
  {id: 2, name: 'DRASS(SIRIUS)'},
  {id: 3, name: 'FINESS/Rang'},
  {id: 4, name: 'SIREN/Rang'},
  {id: 6, name: 'Cabinet RPPS/Rang'},
  {id: 8, name: 'RPPS'},
  {id: 9, name: 'Etudiant'}
]