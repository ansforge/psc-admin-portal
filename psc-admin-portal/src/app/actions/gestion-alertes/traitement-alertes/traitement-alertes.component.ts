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
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { Pscload } from '../../../api/pscload.service';
import { Operation, Operations } from '../../../api/psload.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-traitement-alertes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './traitement-alertes.component.html',
  styleUrl: './traitement-alertes.component.scss'
})
export class TraitementAlertesComponent {
  qs: typeof QueryStatusEnum=QueryStatusEnum;
  queryStatus: QueryStatus|null=null;
  excludeCheckModel: {operation: Operation,selected: boolean}[]=[];
  excludesVisible: boolean=false;
  
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
  
  forceContinue(): void {
    this.queryStatus={status: QueryStatusEnum.PENDING,message:"C'est parti!"};

    const excludes: Operation[]=this.excludeCheckModel
      .filter(checkbox => checkbox.selected)
      .map(checkbox => checkbox.operation);

    this.loaderApi.forceContinue(excludes).subscribe(
      (status: QueryStatus) => this.queryStatus=status
    );
  }
}
