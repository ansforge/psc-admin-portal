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

/*
 *  Copyright (c) 2020 - 2024 Henix, henix.fr
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { QueryResult } from "./queryResult.model";
import { QueryStatusEnum } from "./queryStatus.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { errorResponseToQueryResult } from "./queryResult";

@Injectable({providedIn: "root"})
export class AlertManager {
  
  constructor(private http: HttpClient){}
  
  hasLoaderAlerts(): Observable<QueryResult<boolean>> {
    return this.http.get<any[]>(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=web.hook`
    ).pipe(
      map(
        (alerts: any[]) => {
          return {
            status: QueryStatusEnum.OK,
            message: alerts.length >0 ? "Alerts detected":"No alerts",
            body: alerts.length > 0
          };
        }
      ),
      catchError(
        (err: HttpErrorResponse) => errorResponseToQueryResult<boolean>(err)
      )
    );
  }
}
