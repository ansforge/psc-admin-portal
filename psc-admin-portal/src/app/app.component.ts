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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  toggleState: string='Unknown';
  location: Location;
  
  constructor(
    private http: HttpClient
  ){
     this.location = window.location
  }
    ngOnInit(): void {
      this.http.get<string>(
        `${environment.API_HOSTNAME}portal/service/toggle/v1/check`,
      {headers: {'Accept':'text/plain'},responseType: 'text' as 'json'}
      )
      .subscribe(
      {
        next: (status:string) => this.toggleState=status,
        error: (err: HttpErrorResponse) => 
        {
          if (err.status===503) {
            this.toggleState = err.statusText
            return err.statusText;
          } else {
            return throwError(err);
          }
        }
      }
      );
    }
}
