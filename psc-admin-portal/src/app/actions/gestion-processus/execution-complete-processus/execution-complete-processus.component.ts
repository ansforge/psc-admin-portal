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

import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { QueryStatusPanelComponent } from '../../../shared/query-status-panel/query-status-panel.component';
import { Pscload } from '../../../api/pscload.service';
import { ConfirmModalComponent } from '../../../ds/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-execution-complete-processus',
  standalone: true,
  imports: [FormsModule,QueryStatusPanelComponent,ConfirmModalComponent],
  templateUrl: './execution-complete-processus.component.html',
  styleUrl: './execution-complete-processus.component.scss'
})
export class ExecutionCompleteProcessusComponent {
  RemoveRassExtract: typeof RemoveRassExtract=RemoveRassExtract;
  supprimerExtraction: RemoveRassExtract=RemoveRassExtract.NO;
  executionStatus: QueryStatus|null=null;
  removeWarningExecution: EventEmitter<void> = new EventEmitter();
  
  constructor(private loader: Pscload){}
  
  askExecuter() {
    if(this.supprimerExtraction===RemoveRassExtract.YES) {
      this.removeWarningExecution.next();
    } else {
      this.executer();
    }
  }
  
  executer(): void {
    if(this.supprimerExtraction===RemoveRassExtract.YES) {
      
    }
    this.executionStatus={status:QueryStatusEnum.PENDING,message:"Requête d'exécution envoyée"};
    this.loader.executerProcessusComplet()
        .subscribe(
          (status: QueryStatus) => this.executionStatus=status
        );
  }
}
enum RemoveRassExtract {
  YES='Oui',
  NO='Non'
}
