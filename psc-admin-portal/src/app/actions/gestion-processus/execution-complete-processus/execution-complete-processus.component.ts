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
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { QueryStatusPanelComponent } from '../../../shared/query-status-panel/query-status-panel.component';
import { Pscload } from '../../../api/pscload.service';
import { State, processStates, stateFromCode } from './process.model';

@Component({
  selector: 'app-execution-complete-processus',
  standalone: true,
  imports: [FormsModule,QueryStatusPanelComponent],
  templateUrl: './execution-complete-processus.component.html',
  styleUrl: './execution-complete-processus.component.scss'
})
export class ExecutionCompleteProcessusComponent {
  Confirm: typeof Confirm=Confirm;
  supprimerExtraction: Confirm=Confirm.NO;
  executionStatus: QueryStatus|null=null;
  processState: State|undefined|null=null;
  
  constructor(private loader: Pscload){}
  
  executer(): void {
    this.executionStatus={status:QueryStatusEnum.PENDING,message:"Requête d'exécution envoyée"};
    this.processState=processStates[3];
    this.loader.executerProcessusComplet()
        .subscribe(
          (status: QueryStatus) => this.executionStatus=status
        );
  }
}
enum Confirm {
  YES='Oui',
  NO='Non'
}