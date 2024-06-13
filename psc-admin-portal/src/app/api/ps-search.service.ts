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
