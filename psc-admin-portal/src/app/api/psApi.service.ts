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

import { Observable, of } from "rxjs";
import { Status, errorResponseToStatus} from "./status";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {QueryStatusEnum} from './queryStatus.model';
import {errorResponseToQueryResult} from './queryResult';
import {QueryResult} from './queryResult.model';

@Injectable({providedIn: "root"})
export class PsApi {
  constructor(private http: HttpClient){}

  get status(): Observable<Status> {
    return this.http.get<any>(
        `${environment.API_HOSTNAME}portal/service/ps-api/`
    ).pipe(
      map(
        (message: any) => new Status(true,'Ps-Api is running')
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToStatus(err)
      )
    );
  }

  getPSByIDNat(idNatPS: string, includeDeactivated: boolean = false): Observable<any> {
    var encodedIdNatPS = encodeURIComponent(idNatPS);
    const params = includeDeactivated ? `?includeDeactivated=true` : '';
    return this.http.get(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/${encodedIdNatPS}${params}`).pipe(
      map(response => {
        return {
          status: QueryStatusEnum.OK,
          message: 'Recherche effectuée avec succès',
          data: response
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (410 === err.status) {
          return of({status: QueryStatusEnum.KO, message: `Le PS avec l'id ${idNatPS} n'a pas été trouvé.`});
        } else {
          return errorResponseToQueryResult<void>(err);
        }
      })
    );
  }

  searchPsByName(lastName?: string, firstNames?: string): Observable<QueryResult<{nationalId: string, companyNames: string[]}[]>> {
    let params = new HttpParams();
    if (lastName) params = params.set('lastName', lastName);
    if (firstNames) params = params.set('firstNames', firstNames);
    return this.http.get<{nationalId: string, companyNames: string[]}[]>(
      `${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/search/name`,
      { params }
    ).pipe(
      map(response => ({
        status: QueryStatusEnum.OK,
        message: 'Recherche effectuée avec succès',
        body: response
      })),
      catchError((err: HttpErrorResponse) => errorResponseToQueryResult<{nationalId: string, companyNames: string[]}[]>(err))
    );
  }

  deactivatePS(idNatPS: string): Observable<QueryResult<void>> {
    const encodedId = encodeURIComponent(idNatPS);
    return this.http.delete<void>(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/${encodedId}`).pipe(
      map(() => ({ status: QueryStatusEnum.OK, message: 'PS désactivé avec succès' })),
      catchError((err: HttpErrorResponse) => {
        if (410 === err.status) {
          return of({ status: QueryStatusEnum.KO, message: `Le PS avec l'id ${idNatPS} n'a pas été trouvé.` });
        } else {
          return errorResponseToQueryResult<void>(err);
        }
      })
    );
  }

  forceDeletePS(idNatPS: string): Observable<QueryResult<void>> {
    const encodedId = encodeURIComponent(idNatPS);
    return this.http.delete<void>(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/force/${encodedId}`).pipe(
      map(() => ({ status: QueryStatusEnum.OK, message: 'PS supprimé définitivement' })),
      catchError((err: HttpErrorResponse) => {
        if (403 === err.status) {
          return of({ status: QueryStatusEnum.KO, message: 'La suppression définitive est désactivée.' });
        } else if (410 === err.status) {
          return of({ status: QueryStatusEnum.KO, message: `Le PS avec l'id ${idNatPS} n'a pas été trouvé.` });
        } else {
          return errorResponseToQueryResult<void>(err);
        }
      })
    );
  }

  updatePS(jsonPS: JSON): Observable<QueryResult<any>> {
    return this.http.put<JSON>(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps`, jsonPS).pipe(
      map(() => {
        return {
          status: QueryStatusEnum.OK,
          message: 'Mise à jour effectuée avec succès',
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (410 === err.status) {
          return of({status: QueryStatusEnum.KO, message: `Le PS n'a pas été trouvé.`});
        } else {
          return errorResponseToQueryResult<void>(err);
        }
      })
    );
  }
}
