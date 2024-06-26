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
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { Pscload } from '../../../api/pscload.service';
import { Operation, Operations } from '../../../api/pscload.model';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../ds/confirm-modal/confirm-modal.component';
import { QueryStatusPanelComponent } from '../../../shared/query-status-panel/query-status-panel.component';
import { ProcessStateWidgetComponent } from '../../../shared/process-state-widget/process-state-widget.component';

@Component({
  selector: 'app-traitement-alertes',
  standalone: true,
  imports: [FormsModule,ConfirmModalComponent,QueryStatusPanelComponent,ProcessStateWidgetComponent],
  templateUrl: './traitement-alertes.component.html',
  styleUrl: './traitement-alertes.component.scss'
})
export class TraitementAlertesComponent {
  qs: typeof QueryStatusEnum=QueryStatusEnum;
  queryStatus: QueryStatus|null=null;
  excludeCheckModel: {operation: Operation,selected: boolean}[]=[];
  excludesVisible: boolean=false;
  forceContinueEmitter: EventEmitter<void>=new EventEmitter();
  
  constructor(private loaderApi: Pscload){
    for(let operation of Operations){
      this.excludeCheckModel.push({operation: operation,selected: false});
    }
  }
  
  forgetStatus(): void {
    this.queryStatus=null;
  }
  
  showExcludes(): void {
    this.excludesVisible=true;
  }
  
  showContinueConfirmModal(): void {
    this.forceContinueEmitter.next();
  }
  
  forceContinue(): void {
    this.queryStatus={status: QueryStatusEnum.PENDING,message:"Requête en cours."};

    const excludes: Operation[]=this.excludeCheckModel
      .filter(checkbox => checkbox.selected)
      .map(checkbox => checkbox.operation);

    this.loaderApi.forceContinue(excludes).subscribe(
      (status: QueryStatus) => this.queryStatus=status
    );
  }
}
