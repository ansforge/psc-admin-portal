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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessState } from './process.model';
import { ProcessService } from './process.service';
import { QueryResult } from '../../api/queryResult.model';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-process-state-widget',
  standalone: true,
  imports: [],
  templateUrl: './process-state-widget.component.html',
  styleUrl: './process-state-widget.component.scss'
})
export class ProcessStateWidgetComponent implements OnInit, OnDestroy {
  processState: ProcessState|null=null;
  private updateSubscription: Subscription|null=null; 
  
  constructor(private procesService: ProcessService){}
  
  ngOnInit(): void {
    
    this.updateSubscription=timer(0,environment.UPDATE_PERIOD)
      .subscribe(
        () => {
          this.procesService
            .getProcessState()
            .subscribe(
              (state: QueryResult<ProcessState|null>) => this.updateState(state)
            );
        }
      );
  }
  
  private updateState(state: QueryResult<ProcessState|null>) {
    if(state.body || state.body===null) {
      this.processState = state.body
    }
  }
  
  ngOnDestroy(): void {
    if(this.updateSubscription!==null) {
      this.updateSubscription.unsubscribe();
      this.updateSubscription=null;
    }
  }
}
