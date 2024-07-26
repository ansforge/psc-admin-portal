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

import {Component, OnDestroy} from '@angular/core';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {Subject, takeUntil} from 'rxjs';
import {Extract} from '../../../api/extract.service';
import {QueryResult} from '../../../api/queryResult.model';
import {QueryStatusPanelComponent} from '../../../shared/query-status-panel/query-status-panel.component';

@Component({
  selector: 'app-generation-extract-securise',
  standalone: true,
  imports: [
    QueryStatusPanelComponent
  ],
  templateUrl: './generation-extract-securise.component.html',
  styleUrl: './generation-extract-securise.component.scss'
})
export class GenerationExtractSecuriseComponent implements OnDestroy {
  executionStatus: QueryStatus | null = null;
  statusMessage: string = '';

  private unsub$: Subject<void> = new Subject<void>();

  constructor(private extractService: Extract) {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  generateFile(): void {
    this.extractService.generateSecureFile().pipe(
      takeUntil(this.unsub$),
    ).subscribe((response: QueryResult<any>) => {
      this.executionStatus = response;
      if (response.message) {
        this.statusMessage = response.status === QueryStatusEnum.KO ?
            'Échec du téléchargement de l\'extrait, une erreur est survenue : ' + response.message : response.message;
      }
    });
  }
}
