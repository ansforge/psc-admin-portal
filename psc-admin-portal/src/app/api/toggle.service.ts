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
import {QueryStatus, QueryStatusEnum} from "./queryStatus.model";
import {errorResponseToQueryResult} from "./queryResult";

export interface IdType {
  readonly value: number | ''; //May be empty
  readonly displayName: string;
  readonly code: string;
}

export const idTypeEnum: IdType[] = [
  {value: 0, displayName: 'ADELI', code: 'ADELI'},
  {value: 1, displayName: 'Cabinet ADELI/Rang', code: 'CAB_ADELI'},
  {value: 2, displayName: 'DRASS(SIRIUS)', code: 'DRASS'},
  {value: 3, displayName: 'FINESS/Rang', code: 'FINESS'},
  {value: 4, displayName: 'SIREN/Rang', code: 'SIREN'},
  {value: 6, displayName: 'Cabinet RPPS/Rang', code: 'CAB_RPPS'},
  {value: 8, displayName: 'RPPS', code: 'RPPS'},
  {value: 9, displayName: 'Etudiant', code: 'ETUDIANT'}
]

export enum CsvFileOperations {
  INSERT = 'insert',
  DELETE = 'delete'
}

export const ASYNCHRONOUS_LAUNCH_SUCCESS_MSG: string = "L’opération a démarré avec succès.";

@Injectable({providedIn: "root"})
export class Toggle {
  constructor(private http: HttpClient){}

  get status(): Observable<Status> {
    return this.http.get<string>(
      `${environment.API_HOSTNAME}portal/service/toggle/v1/check`,
      {headers: {'Accept': 'text/plain'}, responseType: 'text' as 'json'}
    ).pipe(
      map(
        (message: string) => new Status(true, message)
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToStatus(err)
      )
    );
  }

  handleOtherIds(source: IdType, destination: IdType, list: Blob, operation: CsvFileOperations): Observable<QueryStatus> {
    let url: string;
    const toggleFile: FormData = new FormData();
    toggleFile.append('toggleFile', list);
    toggleFile.append('from', '' + source.code);
    toggleFile.append('to', '' + destination.code);

    if (CsvFileOperations.INSERT === operation) {
      url = `${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`
    } else {
      url = `${environment.API_HOSTNAME}portal/service/toggle/v1/remove`;
    }

    return this.http.post<void>(url, toggleFile).pipe(
      map(
        () => ({status: QueryStatusEnum.OK, message: ASYNCHRONOUS_LAUNCH_SUCCESS_MSG})
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult<void>(err)
      )
    );
  }
}
