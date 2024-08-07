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

import {Observable} from "rxjs";
import {Status, errorResponseToStatus} from "./status";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {QueryResult} from './queryResult.model';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';

@Injectable({providedIn: "root"})
export class Extract {
  constructor(private http: HttpClient) {
  }

  get status(): Observable<Status> {
    return this.http.get<string>(
      `${environment.API_HOSTNAME}portal/service/pscextract/v1/check`,
      {headers: {'Accept': 'application/json'}, responseType: 'text' as 'json'}
    ).pipe(
      map(
        (message: string) => new Status(true, message)
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToStatus(err)
      )
    );
  }

  getExtractGenerationState(state: QueryResult<ProcessState | null>): Observable<ProcessState[]> {
    return this.http.get<boolean>(
      `${environment.API_HOSTNAME}portal/service/pscextract/v1/busy-check`
    ).pipe(
      map((isBusy: boolean) => {
          const activeStates: ProcessState[] = [];
          if (state.body !== null && state.body !== undefined) {
            activeStates.push(state.body);
          }
          if (isBusy && !activeStates.includes(processStateEnum[5])) {
            activeStates.push(processStateEnum[5]);
          }
          return activeStates;
        }
      )
    );
  }
}
