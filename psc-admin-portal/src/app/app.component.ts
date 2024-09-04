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

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {HeaderComponent} from './ds/header/header.component';
import {Toggle} from './api/toggle.service';
import {Status} from './api/status';
import {PsApi} from './api/psApi.service';
import {Pscload} from './api/pscload.service';
import {Extract} from './api/extract.service';
import {DsService} from './ds/ds.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HeaderComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  currentPage: string = '/';

  constructor(private dsService: DsService, private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.url;
      }
    });
  }

  clicked(event: any) {
    this.dsService.hideAllPopups(event);
  }

  navigateToHomePage(): void {
    this.router.navigate(['/']);
  }

  isHomePage(): boolean {
    return this.currentPage === '/';
  }
}
