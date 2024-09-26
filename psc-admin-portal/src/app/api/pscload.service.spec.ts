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

import { Operations as OperationEnum } from "./pscload.model";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {Pscload} from './pscload.service';
import {TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {QueryStatusEnum} from './queryStatus.model';

describe('PsLoadService', () => {
  let service: Pscload;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Pscload],
    });

    service = TestBed.inject(Pscload);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('All operation codes should be unique', () => {
    let counters=new Map<string,number>();
    for(let operation of OperationEnum) {
      let operationCode: string=''+operation.code;
      let count: number|undefined=counters.get(operationCode);
      if(count){
        counters.set(operationCode,count+1);
      } else{
        counters.set(operationCode,1);
      }
    }

    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });

  it('All operation display names should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of OperationEnum) {
      let idName: string=''+idType.displayName;
      let count: number|undefined=counters.get(idName);
      if(count){
        counters.set(idName,count+1);
      } else{
        counters.set(idName,1);
      }
    }

    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });

  // test remove rass extract

  it('should return status OK and success message when delete request is successful', () => {
    const apiUrl: string = `${environment.API_HOSTNAME}portal/service/pscload/v2/process/clear-files`;

    service.removeRassExtract().subscribe((result) => {
      expect(result.status).toBe(QueryStatusEnum.OK);
      expect(result.message).toBe("L'extraction RASS a bien été supprimée. ");
    });

    const req: TestRequest = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should return status KO and conflict message when server responds with 409 error', () => {
    const apiUrl: string = `${environment.API_HOSTNAME}portal/service/pscload/v2/process/clear-files`;

    service.removeRassExtract().subscribe((result) => {
      expect(result.status).toBe(QueryStatusEnum.KO);
      expect(result.message).toBe("Suppression impossible lorsqu'un processus est en cours. Réessayez plus tard");
    });

    const req: TestRequest = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('DELETE');

    req.flush('Conflict error', { status: 409, statusText: 'Conflict' });
  });
});
