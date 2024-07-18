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

import { TestBed } from '@angular/core/testing';
import {PsApi} from './psApi.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {QueryStatusEnum} from './queryStatus.model';
import {environment} from '../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {QueryResult} from './queryResult.model';

describe('PsApi', () => {
  let service: PsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PsApi]
    });
    service = TestBed.inject(PsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch PS data on successful API call', () => {
    const idNatPS: string = '12345';
    const mockResponse = {
      "idType":"8"
      ,"id":"10104869978",
      "nationalId":"810104869978",
      "lastName":"MOREL",
      "firstNames":[{"firstName":"CAROLE","order":0}],
      "dateOfBirth":"23/05/1984",
      "birthAddressCode":"76451",
      "birthCountryCode":"99000",
      "birthAddress":"MONT-SAINT-AIGNAN",
      "genderCode":"F",
      "phone":"0033661725511",
      "email":"IDE_MOREL_CAROLE@LIVE.FR",
      "salutationCode":"MME",
      "professions":[],
      "ids":["810104869978"],
      "activated":1718284735,
      "deactivated":null
    };

    const expectedResponse = {
      status: QueryStatusEnum.OK,
      message: 'Recherche effectuée avec succès',
      data: mockResponse
    };

    service.getPSByIDNat(idNatPS).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/${idNatPS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle 410 error when fetching PS data by ID Nat', () => {
    const idNatPS = '12345';
    const mockErrorResponse = new HttpErrorResponse({
      status: 410,
      statusText: 'Gone'
    });

    const expectedResponse = {
      status: QueryStatusEnum.KO,
      message: `Le PS avec l'id ${idNatPS} n'a pas été trouvé.`
    };

    service.getPSByIDNat(idNatPS).subscribe(response => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps/${idNatPS}`);
    expect(req.request.method).toBe('GET');
    req.flush({}, mockErrorResponse);
  });

  it('should return a successful response when PS is updated', () => {
    const mockJsonPS: JSON = {
      "idType": "8",
      "id": "11111111111",
      "nationalId": "811111111111",
      "lastName": "FISCHER",
      "firstNames": [
        {
          "firstName": "MARIE",
          "order": 0
        }
      ],
      "dateOfBirth": "27/01/1979",
      "birthAddressCode": "67544",
      "birthCountryCode": "99000",
      "birthAddress": "WISSEMBUOURG",
      "genderCode": "F",
      "phone": "0033663065418",
      "email": "MARIECH1@HOTMAIL.COM",
      "salutationCode": "MME",
      "professions": [],
      "ids": [
        "811111111111"
      ],
      "deactivated": null
    } as unknown as JSON;
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.OK,
      message: 'Mise à jour effectuée avec succès',
    };

    service.updatePS(mockJsonPS).subscribe((response: QueryResult<any>) => {
      expect(response).toEqual(mockResponse);
    });

    const req: TestRequest = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockJsonPS);
  });

  it('should return a 410 error response when the PS is not found', () => {
    const mockJsonPS: JSON = {
      "idType": "8",
      "id": "11111111111",
      "nationalId": "811111111111",
      "lastName": "FISCHER",
      "firstNames": [
        {
          "firstName": "MARIE",
          "order": 0
        }
      ],
      "dateOfBirth": "27/01/1979",
      "birthAddressCode": "67544",
      "birthCountryCode": "99000",
      "birthAddress": "WISSEMBUOURG",
      "genderCode": "F",
      "phone": "0033663065418",
      "email": "MARIECH1@HOTMAIL.COM",
      "salutationCode": "MME",
      "professions": [],
      "ids": [
        "811111111111"
      ],
      "deactivated": null
    } as unknown as JSON;
    const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 410,
      statusText: 'Gone',
    });
    const expectedResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: `Le PS n'a pas été trouvé.`,
    };

    service.updatePS(mockJsonPS).subscribe((response: QueryResult<any>) => {
      expect(response).toEqual(expectedResponse);
    });

    const req: TestRequest = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/ps-api/api/v2/ps`);
    expect(req.request.method).toBe('PUT');
    req.flush(null, mockErrorResponse);
  });
});
