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

import { Component } from '@angular/core';
import { ExecutionCompleteProcessusComponent } from './execution-complete-processus/execution-complete-processus.component';
import { EtatProcessusComponent } from './etat-processus/etat-processus.component';
import {GenerationExtractSecuriseComponent} from './generation-extract-securise/generation-extract-securise.component';
import {
  TelechargementFichierSecuriseComponent
} from './telechargement-fichier-securise/telechargement-fichier-securise.component';
import {TeleversementFichierTestComponent} from './televersement-fichier-test/televersement-fichier-test.component';

@Component({
  selector: 'app-gestion-processus',
  standalone: true,
  imports: [
    ExecutionCompleteProcessusComponent,
    EtatProcessusComponent,
    GenerationExtractSecuriseComponent,
    TelechargementFichierSecuriseComponent,
    TeleversementFichierTestComponent
  ],
  templateUrl: './gestion-processus.component.html',
  styleUrl: './gestion-processus.component.scss'
})
export class GestionProcessusComponent {

}
