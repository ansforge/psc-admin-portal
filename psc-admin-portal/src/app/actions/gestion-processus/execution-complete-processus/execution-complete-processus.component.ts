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

import {Component, EventEmitter, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { QueryStatusPanelComponent } from '../../../shared/query-status-panel/query-status-panel.component';
import { Pscload } from '../../../api/pscload.service';
import { ConfirmModalComponent } from '../../../ds/confirm-modal/confirm-modal.component';
import {QueryResult} from '../../../api/queryResult.model';
import {of, Subject, switchMap, takeUntil} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-execution-complete-processus',
  standalone: true,
  imports: [FormsModule,QueryStatusPanelComponent,ConfirmModalComponent],
  templateUrl: './execution-complete-processus.component.html',
  styleUrl: './execution-complete-processus.component.scss'
})
export class ExecutionCompleteProcessusComponent implements OnDestroy {
  RemoveRassExtract: typeof RemoveRassExtract=RemoveRassExtract;
  supprimerExtraction: RemoveRassExtract=RemoveRassExtract.NO;
  executionStatus: QueryStatus|null=null;
  removeWarningExecution: EventEmitter<void> = new EventEmitter();

  unsub$: Subject<void> = new Subject<void>();

  constructor(private loader: Pscload){}

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  askExecuter() {
    if(this.supprimerExtraction===RemoveRassExtract.YES) {
      this.removeWarningExecution.next();
    } else {
      this.executer();
    }
  }

  executer(): void {
    let executionStatus: QueryStatus = {status: QueryStatusEnum.PENDING, message: 'Requête d\'exécution envoyée'};

    if(this.supprimerExtraction===RemoveRassExtract.YES) {
      this.loader.removeRassExtract().pipe(
        takeUntil(this.unsub$),
        switchMap((result: QueryResult<any>) => {
          if (result.status === QueryStatusEnum.OK) {
            return this.executerProcessusComplet({status: QueryStatusEnum.PENDING, message: result.message + executionStatus.message});
          } else {
            return of(this.executionStatus = {status: QueryStatusEnum.KO, message: result.message});
          }
        })
      ).subscribe();
    } else {
      this.executerProcessusComplet(executionStatus).subscribe();
    }
  }

  private executerProcessusComplet(executionStatus: QueryStatus) {
    this.executionStatus=executionStatus;
    return this.loader.executerProcessusComplet().pipe(
      map((status: QueryStatus) => this.executionStatus=status)
    );
  }
}
export enum RemoveRassExtract {
  YES='Oui',
  NO='Non'
}
