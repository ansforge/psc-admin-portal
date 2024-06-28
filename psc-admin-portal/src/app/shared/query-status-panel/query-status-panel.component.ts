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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { QueryStatus, QueryStatusEnum } from '../../api/queryStatus.model';

@Component({
  selector: 'app-query-status-panel',
  standalone: true,
  imports: [],
  templateUrl: './query-status-panel.component.html',
  styleUrl: './query-status-panel.component.scss'
})
export class QueryStatusPanelComponent {
  qs: typeof QueryStatusEnum=QueryStatusEnum;
  @Input() errorMessage: string='Erreur lors de la requête';
  @Input() queryStatus: QueryStatus|null=null;
  @Output() alertClosed: EventEmitter<void> = new EventEmitter<void>();

  forgetStatus() {
    this.queryStatus=null;
    this.alertClosed.emit()
  }
}
