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

import {ASYNCHRONOUS_LAUNCH_SUCCESS_MSG, CsvFileOperations, IdType, idTypeEnum, Toggle} from "./toggle.service";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {QueryStatusEnum} from './queryStatus.model';
import {QueryResult} from './queryResult.model';

describe('ToggleService', () => {
  let service: Toggle;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Toggle]
    });

    service = TestBed.inject(Toggle);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('All idType values should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of idTypeEnum) {
      let idName: string=''+idType.value;
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

  it('All idType codes should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of idTypeEnum) {
      let idCode: string=idType.code;
      let count: number|undefined=counters.get(idCode);
      if(count){
        counters.set(idCode,count+1);
      } else{
        counters.set(idCode,1);
      }
    }
    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });


  it('should handle toggle successfully', () => {
    const source: IdType = idTypeEnum[0];
    const destination: IdType = idTypeEnum[6];
    const file: File = new File(['test data'], 'test.csv', { type: 'text/csv' });
    const operation: CsvFileOperations = CsvFileOperations.INSERT;
    const expectedUrl: string = `${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`;

    service.handleOtherIds(source, destination, file, operation).subscribe(result => {
      expect(result).toEqual({ status: QueryStatusEnum.OK, message: ASYNCHRONOUS_LAUNCH_SUCCESS_MSG });
    });

    const req: TestRequest = httpMock.expectOne(expectedUrl);
    assertToggleRequestIsValid(source, destination, file, req);
    req.flush(null);
  });

  it('should remove toggle successfully', () => {
    const source: IdType = idTypeEnum[0];
    const destination: IdType = idTypeEnum[6];
    const file: File = new File(['test data'], 'test.csv', { type: 'text/csv' });
    const operation: CsvFileOperations = CsvFileOperations.DELETE;
    const expectedUrl:string = `${environment.API_HOSTNAME}portal/service/toggle/v1/remove`;

    service.handleOtherIds(source, destination, file, operation).subscribe(result => {
      expect(result).toEqual({ status: QueryStatusEnum.OK, message: ASYNCHRONOUS_LAUNCH_SUCCESS_MSG });
    });

    const req: TestRequest = httpMock.expectOne(expectedUrl);
    assertToggleRequestIsValid(source, destination, file, req);
    req.flush(null);
  });

  it('should handle errors in toggle', () => {
    const source: IdType = idTypeEnum[0];
    const destination: IdType = idTypeEnum[6];
    const file: File = new File(['test data'], 'test.csv', { type: 'text/csv' });
    const operation: CsvFileOperations = CsvFileOperations.INSERT;
    const expectedUrl: string = `${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`;

    const mockError: ErrorEvent = new ErrorEvent('Network error', {
      message: 'Something went wrong'
    });

    service.handleOtherIds(source, destination, file, operation).subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual({
          status: QueryStatusEnum.KO,
          message: 'Erreur technique non-identifiée.'
        });
      }
    );

    const req: TestRequest = httpMock.expectOne(expectedUrl);
    assertToggleRequestIsValid(source, destination, file, req);
    req.error(mockError);
  });

  function assertToggleRequestIsValid(source: IdType, destination: IdType, file: File, req: TestRequest): void {
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('toggleFile')).toEqual(file);
    expect(req.request.body.get('from')).toEqual(source.code);
    expect(req.request.body.get('to')).toEqual(destination.code);
  }
})
