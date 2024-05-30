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
import { InformationDiffComponent } from './information-diff/information-diff.component';
import { AlertManager } from '../../api/alertmanager.service';
import { QueryResult } from '../../api/queryResult.model';
import { QueryStatusEnum } from '../../api/queryStatus.model';
import { TraitementAlertesComponent } from './traitement-alertes/traitement-alertes.component';

@Component({
  selector: 'app-gestion-alertes',
  standalone: true,
  imports: [InformationDiffComponent, TraitementAlertesComponent],
  templateUrl: './gestion-alertes.component.html',
  styleUrl: './gestion-alertes.component.scss'
})
export class GestionAlertesComponent implements OnInit {
  status: typeof QueryStatusEnum=QueryStatusEnum;
  hasAlerts: boolean=false;
  
  constructor(private alertApi: AlertManager){}
  ngOnInit(): void {
    this.alertApi.hasLoaderAlerts().subscribe(
      (res: QueryResult<boolean>) => {
        if(res.body!==undefined){
          this.hasAlerts=res.body
        }
      }
    );
  }
}
