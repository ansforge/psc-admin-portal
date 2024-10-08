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

import {BehaviorSubject, finalize, Observable, of} from "rxjs";
import {Status, errorResponseToStatus} from "./status";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {QueryResult} from './queryResult.model';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';
import {errorResponseToQueryResult} from './queryResult';
import {QueryStatus, QueryStatusEnum} from './queryStatus.model';
import {ASYNCHRONOUS_LAUNCH_SUCCESS_MSG} from './toggle.service';

enum ActionType {
  NONE,
  RUNNING_PROCESS,
  RUNNING_SEPARATE_ACTION,
}

interface ServiceState {
  isBusy: boolean;
  actionType: ActionType;
}

@Injectable({providedIn: "root"})
export class Extract {

  private serviceStateSubject: BehaviorSubject<ServiceState> = new BehaviorSubject<ServiceState>({
    isBusy: false,
    actionType: ActionType.NONE
  });

  constructor(private http: HttpClient) {
  }

  private updateServiceState(isBusy: boolean, actionType: ActionType): void {
    this.serviceStateSubject.next({isBusy, actionType});
  }

  private resetServiceState(): void {
    this.serviceStateSubject.next({isBusy: false, actionType: ActionType.NONE});
  }

  private resetServiceStateIfServerIsDone(): void {
    this.http.get<boolean>(
      `${environment.API_HOSTNAME}portal/service/pscextract/v1/busy-check`
    ).pipe(
      map((serverStillBusy: boolean) => {
        if (serverStillBusy) {
          setTimeout(() => {
            this.resetServiceState();
          }, 2000);
        } else {
          this.resetServiceState();
        }
      })
    ).subscribe();
  }

  get status(): Observable<Status> {
    this.updateServiceState(true, ActionType.RUNNING_SEPARATE_ACTION);
    return this.http.get<string>(
      `${environment.API_HOSTNAME}portal/service/pscextract/v1/check`,
      {headers: {'Accept': 'application/json'}, responseType: 'text' as 'json'}
    ).pipe(
      map(
        (message: string) => new Status(true, message)
      ),
      finalize(() => {
        this.resetServiceState();
      }),
      catchError(
        (err: HttpErrorResponse) => errorResponseToStatus(err)
      )
    );
  }

  getExtractGenerationState(state: QueryResult<ProcessState | null>): Observable<ProcessState[]> {
    const activeStates: ProcessState[] = [];
    if (state.body !== null && state.body !== undefined) {
      activeStates.push(state.body);
    }

    if (this.serviceStateSubject.getValue().actionType !== ActionType.RUNNING_SEPARATE_ACTION) {
      this.updateServiceState(true, ActionType.RUNNING_PROCESS);
      return this.http.get<boolean>(
        `${environment.API_HOSTNAME}portal/service/pscextract/v1/busy-check`
      ).pipe(
        map((isServerBusy: boolean) => {
            if (isServerBusy && !activeStates.includes(processStateEnum[5])) {
              activeStates.push(processStateEnum[5]);
            }
            return activeStates;
          }
        ),
        finalize(() => this.resetServiceState())
      );
    } else {
      return of(activeStates);
    }
  }

  generateSecureFile() {
    this.updateServiceState(true, ActionType.RUNNING_SEPARATE_ACTION);
    return this.http.post<any>(`${environment.API_HOSTNAME}portal/service/pscextract/v1/generate-extract`, null, {observe: 'response'}).pipe(
      map(() => {
        return {
          status: QueryStatusEnum.OK,
          message: 'Le fichier a été généré correctement.',
        } as QueryResult<any>;
      }),
      finalize(() => {
        this.resetServiceStateIfServerIsDone();
      }),
      catchError(
        (err: HttpErrorResponse) => {
          return errorResponseToQueryResult<any>(err);
        }
      )
    );
  }

  downloadExtract(url: string): Observable<QueryResult<any>> {
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob|null>) => {
        if (response.body != null) {
          const contentDisposition: string|null = response.headers.get('Content-Disposition');
          let filename: string = 'Extraction_Pro_sante_connect.zip';
          if (contentDisposition) {
            const matches: RegExpMatchArray|null = /filename=["']?([^";\r\n]*)["']?/.exec(contentDisposition);
            if (matches?.[1]) {
              filename = matches[1];
            }
          }
          return {
            status: QueryStatusEnum.OK,
            message: 'Téléchargement réussi',
            body: {blob: response.body, filename},
          }
        } else {
          return {
            status: QueryStatusEnum.KO,
            message: 'Téléchargement impossible',
            body: null,
          }
        }
      }),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult<any>(err)
      )
    );
  }

  uploadTestFile(data: Blob): Observable<QueryStatus> {
    const testFile: FormData = new FormData();
    testFile.append('testFile', data);
    return this.http.post<void>(
      `${environment.API_HOSTNAME}portal/service/pscextract/v1/upload/test`,
      testFile
    ).pipe(
      map(
        () => ({status: QueryStatusEnum.OK, message: ASYNCHRONOUS_LAUNCH_SUCCESS_MSG})
      ),
      catchError(
        (err: HttpErrorResponse) => of({status: QueryStatusEnum.KO, message: err.message} as QueryStatus)
      )
    );
  }
}
