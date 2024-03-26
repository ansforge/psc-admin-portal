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

export class Status {
  constructor(private isAvailable: boolean, private statusMessage: string){}
  
  get available(){
    return this.isAvailable;
  }
  
  get message() {
    return (this.isAvailable?'OK':'KO')+' : '+this.statusMessage;
  }
}

export function errorResponseToStatus(err: HttpErrorResponse): Observable<Status> {
  if (err.status === 0 || err.status === null || err.status === undefined) {
    return of(new Status(false, `Backend unreachable: ${err.statusText}`))
  } else if (err.status === 404 || err.status===406) {
    // For some reason, we were faced with OK as a 404 status text...
    return of(new Status(false, 'Target not found ('+err.status+')'))
  } else {
    return of(new Status(false, err.statusText))
  }
}