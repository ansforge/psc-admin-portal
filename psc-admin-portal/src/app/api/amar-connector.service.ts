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

import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {errorResponseToStatus, Status} from './status';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';

@Injectable({
  providedIn: 'root'
})
export class AmarConnectorService {

  constructor(private http: HttpClient) {
  }

  get status(): Observable<Status> {
    return this.http.get<string>(
      `${environment.API_HOSTNAME}portal/service/psc-amar-connector/check`,
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

  getMessageState(activeStates: ProcessState[]): Observable<ProcessState[]> {
    return this.http.get<boolean>(
      `${environment.API_HOSTNAME}portal/service/psc-amar-connector/check-pending-messages`
    ).pipe(
      map((hasPendingMsg: boolean) => {
          if (hasPendingMsg && !activeStates.includes(processStateEnum[6])) {
            activeStates.push(processStateEnum[6]);
          }
          return activeStates;
        }
      )
    );
  }

}
