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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HeaderComponent } from './ds/header/header.component';
import { Toggle } from './api/toggle.service';
import { Status } from './api/status';
import { PsApi } from './api/psApi.service';
import { Pscload } from './api/pscload.service';
import { Extract } from './api/extract.service';
import { DsService } from './ds/ds.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  psApiState: string='Unknown';
  toggleState: string='Unknown';
  pscloadState: string='Unknown';
  extractState: string='Unknown';
  location: Location;
  
  constructor(
    private dsService: DsService,
    private toggle: Toggle,
    private psApi: PsApi,
    private pscload: Pscload,
    private extract: Extract
  ){
     this.location = window.location
  }
    ngOnInit(): void {
      this.toggle.status
        .subscribe(
          {
            next: (status: Status) => this.toggleState=status.message
          }
        );
      this.psApi.status
        .subscribe(
          {
            next: (status: Status) => this.psApiState=status.message
          }
        );
      this.pscload.status
        .subscribe(
          {
            next: (status: Status) => this.pscloadState=status.message
          }
        );
      this.extract.status
        .subscribe(
          {
            next: (status: Status) => this.extractState=status.message
          }
        );
    }
    
    clicked(event: any) {
      this.dsService.hideAllPopups(event);
    }
}
