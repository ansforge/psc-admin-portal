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

@Component({
  selector: 'app-process-state-widget',
  standalone: true,
  imports: [],
  templateUrl: './process-state-widget.component.html',
  styleUrl: './process-state-widget.component.scss'
})
export class ProcessStateWidgetComponent implements OnInit, OnDestroy {
  processState: ProcessState|null=null;
  
  constructor(private procesService: ProcessService){}
  
  ngOnInit(): void {
    this.procesService
      .getProcessState()
      .subscribe(
        (state: ProcessState|null) => this.processState = state
      );
  }
  
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
