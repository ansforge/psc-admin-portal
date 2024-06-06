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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-execution-complete-processus',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './execution-complete-processus.component.html',
  styleUrl: './execution-complete-processus.component.scss'
})
export class ExecutionCompleteProcessusComponent {
  Confirm: typeof Confirm=Confirm;
  supprimerExtraction: Confirm=Confirm.NO;
  
  executer(): void {
  }
}
enum Confirm {
  YES='Oui',
  NO='Non'
}