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

import { Observable, of, throwError } from "rxjs";
import { Status } from "./status";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class PsApi {
  constructor(private http: HttpClient){}
  
  get status(): Observable<Status> {
    return this.http.get<string>(
        `${environment.API_HOSTNAME}portal/service/ps-api/v1/check`,
      {headers: {'Accept':'text/plain'},responseType: 'text' as 'json'}
    ).pipe(
      map(
        (message: string) => new Status(true,message)
      ),
      catchError(
        (err: HttpErrorResponse) => 
        {
          if (err.status===0 || err.status===null || err.status===undefined) {
            return of(new Status(false, `Backend unreachable: ${err.statusText}`))
          } else {
            return of(new Status(false, err.statusText))
          }
        }
      )
    );
  }
}