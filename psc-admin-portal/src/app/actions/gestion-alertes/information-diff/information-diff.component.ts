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

import { Component, OnInit } from '@angular/core';
import { AlertManager } from '../../../api/alertmanager.service';
import { QueryResult } from '../../../api/queryResult.model';
import { QueryStatusEnum } from '../../../api/queryStatus.model';
import { Pscload } from '../../../api/pscload.service';
import { PsDiff } from '../../../api/psload.model';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-information-diff',
  standalone: true,
  imports: [],
  templateUrl: './information-diff.component.html',
  styleUrl: './information-diff.component.scss'
})
export class InformationDiffComponent implements OnInit{
  status: typeof QueryStatusEnum=QueryStatusEnum
  alertResult: QueryResult<boolean>={status: QueryStatusEnum.PENDING,message:""};
  psDiffError: string|null=null;
  
  constructor(
    private alertApi: AlertManager,
    private loaderApi: Pscload
  ){}
  
  ngOnInit(): void {
    this.alertApi.hasLoaderAlerts()
    .subscribe(
      (result: QueryResult<boolean>) => this.alertResult=result
    );
  }
  
  get alertes(): boolean|null {
    return this.alertResult?.body|| false;
  }
  
  forgetPsDiffError(): void {
    this.psDiffError=null;
  }
  
  onGetDiff(): void {
    this.loaderApi.getDiff().subscribe(
      (res: QueryResult<PsDiff>) => {
        if(res.status===this.status.KO) {
          this.psDiffError=res.message;
        } else{
          this.psDiffError=null;
          const psDiff=res.body as PsDiff
          var csvContent: string="Created;Updated;Deleted\n";
          var created=psDiff.created.slice();
          var updated=psDiff.updated.slice();
          var deleted=psDiff.deleted.slice();
          var tuple=[created.pop(),updated.pop(),deleted.pop()];
          while(tuple[0] || tuple[1] || tuple[2]) {
            csvContent+=this.tupleFormat(tuple)+"\n";
            tuple=[created.pop(),updated.pop(),deleted.pop()];
          }
          
          const diffBlob=new Blob([csvContent],{type: "application/csv"});
          FileSaver.saveAs(diffBlob, `pscload_diff_${new Date().valueOf()}.csv`);
        }
      }
    );
  }
  
  private tupleFormat(tuple: nullableString[]): string {
    return `${this.dataFormat(tuple[0])};${this.dataFormat(tuple[1])};${this.dataFormat(tuple[2])}`;
  }
  
  private dataFormat(value: nullableString): string {
    return value?`"${value}"`:"";
  }
}
type nullableString = string | undefined;
