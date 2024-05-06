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
import { Toggle } from '../api/toggle.service';
import { PsApi } from '../api/psApi.service';
import { Pscload } from '../api/pscload.service';
import { Extract } from '../api/extract.service';
import { Status } from '../api/status';

@Component({
  selector: 'app-etat-composants',
  standalone: true,
  imports: [],
  templateUrl: './etat-composants.component.html',
  styleUrl: './etat-composants.component.scss'
})
export class EtatComposantsComponent implements OnInit{
  psApiState: Status=Status.unknown;
  toggleState: Status=Status.unknown;
  pscloadState: Status=Status.unknown;
  extractState: Status=Status.unknown;
  
  constructor(
    private toggle: Toggle,
    private psApi: PsApi,
    private pscload: Pscload,
    private extract: Extract
  ){}
  ngOnInit(): void {
    this.toggle.status
      .subscribe(
        {
          next: (status: Status) => this.toggleState=status
        }
      );
    this.psApi.status
      .subscribe(
        {
          next: (status: Status) => this.psApiState=status
        }
      );
    this.pscload.status
      .subscribe(
        {
          next: (status: Status) => this.pscloadState=status
        }
      );
    this.extract.status
      .subscribe(
        {
          next: (status: Status) => this.extractState=status
        }
      );
  }
}
