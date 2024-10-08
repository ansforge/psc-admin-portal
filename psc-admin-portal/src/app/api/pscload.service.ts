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

import {Observable, of} from "rxjs";
import { Status, errorResponseToStatus } from "./status";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { QueryResult } from "./queryResult.model";
import { NO_DIFF, Operation, PsDiff, PscLoadStatus } from "./pscload.model";
import { QueryStatus, QueryStatusEnum } from "./queryStatus.model";
import { errorResponseToQueryResult } from "./queryResult";

@Injectable({providedIn: "root"})
export class Pscload {
  constructor(private http: HttpClient){}

  get status(): Observable<Status> {
    return this.http.get<string>(
        `${environment.API_HOSTNAME}portal/service/pscload/v2/check`,
      {headers: {'Accept':'text/plain'},responseType: 'text' as 'json'}
    ).pipe(
      map(
        (message: string) => new Status(true,message)
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToStatus(err)
      )
    );
  }

  executerProcessusComplet(): Observable<QueryStatus>{
    return this.http.post<void>(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/full-run`,''
    ).pipe(
      map(
        () => ({status: QueryStatusEnum.OK,message:"L'exécution a démarré avec succès."})
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult(err)
      )
    );
  }

  getPscLoadStatus(details: boolean=false): Observable<QueryResult<PscLoadStatus|null>> {
    return this.http.get<PscLoadStatus[]>(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/info?details=${details}`
    ).pipe(
      map(
        (statusTable: PscLoadStatus[]) => {
          if(statusTable.length>0) {
            return {
              status: QueryStatusEnum.OK,
              message: 'Status found',
              body:  statusTable.pop() as PscLoadStatus
            };
          } else {
            return {
              status: QueryStatusEnum.OK,
              message: 'No current status',
              body: null
            };
          }
        }
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult<PscLoadStatus>(err)
      )
    );
  }

  getDiff(): Observable<QueryResult<PsDiff>> {
    return this.http.get<PscLoadStatus[]>(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/info?details=true`,
    ).pipe(
      map(
        (statusTable: PscLoadStatus[]) => {
          if(statusTable.length>0){
            const status: PscLoadStatus=statusTable.pop() as PscLoadStatus;
            const created=status.psToCreateIds?status.psToCreateIds:[];
            const deleted=status.psToDeleteIds?status.psToDeleteIds:[];
            const updated=status.psToUpdateIds?status.psToUpdateIds:[];
            var diff={created: created, deleted: deleted, updated: updated};
          } else{
            var diff=NO_DIFF;
          }
          return {
            status: QueryStatusEnum.OK,
            message: "Diff downloaded",
            body: diff
          };
        }
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult<PsDiff>(err)
      )
    );
  }

  forceContinue(excludes: Operation[] = []): Observable<QueryStatus> {
    const excludeParm=excludes.map( (op: Operation) => op.code );
    return this.http.post<void>(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/continue?exclude=${excludeParm.toString()}`,
      ''
    ).pipe(
      map(
        () => ({status: QueryStatusEnum.OK,message: 'Processus successfully relaunched'})
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult(err)
      )
    );
  }

  removeRassExtract() {
    return this.http.delete<void>(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/clear-files`).pipe(
      map(() => ({status: QueryStatusEnum.OK, message: 'L\'extraction RASS a bien été supprimée. '})),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 409) {
          return of({status: QueryStatusEnum.KO, message: 'Suppression impossible lorsqu\'un processus est en cours. Réessayez plus tard' });
        } else {
          return errorResponseToQueryResult(err);
        }
      })
    );
  }
}
