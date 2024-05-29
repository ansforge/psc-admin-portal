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

import { HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { QueryResult } from "./queryResult.model";
import { QueryStatusEnum } from "./queryStatus.model";

export function errorResponseToQueryResult<T>(err: HttpErrorResponse): Observable<QueryResult<T>> {
  if(err.status===0) { //No request happened. No way to diagnose more
    return of({status: QueryStatusEnum.KO, message: 'Erreur technique non-identifiée.'});
  } else if(err.status>=502 && err.status <= 504) {
    // Error reporting from the proxy is HTML. Just use the text.
    return of({status: QueryStatusEnum.KO, message: err.message});
  } else if(err.error){
    // Other error reporting, when error data is provided
    return of({status: QueryStatusEnum.KO, message: err.error.error /*sic[k] ... */ });
  } else {
    // Other error reporting when no error data is provided
    return of({status: QueryStatusEnum.KO, message: `Failure code ${err.status}`});
  }
}
