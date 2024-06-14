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
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {errorResponseToQueryResult} from './queryResult';
import {environment} from '../../environments/environment';
import {QueryStatusEnum} from './queryStatus.model';

@Injectable({
  providedIn: 'root'
})
export class PsSearchService {

  constructor(private http: HttpClient) { }

  getPSByIDNat(idNatPS: string): Observable<any> {
    return this.http.get(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/${idNatPS}`).pipe(
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
}
