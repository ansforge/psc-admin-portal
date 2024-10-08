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

import {Extract} from './extract.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {QueryResult} from './queryResult.model';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';
import {QueryStatus, QueryStatusEnum} from './queryStatus.model';
import {environment} from '../../environments/environment';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ASYNCHRONOUS_LAUNCH_SUCCESS_MSG} from './toggle.service';

describe('ExtractService', () => {
  let service: Extract;
  let httpMock: HttpTestingController;
  const baseApiUrl: string = `${environment.API_HOSTNAME}portal/service/pscextract/v1`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ Extract ]
    });

    service = TestBed.inject(Extract);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add pscload states to activeStates if state.body is not null or undefined and isBusy is false', () => {
    const mockState: QueryResult<ProcessState | null> = {
      status: QueryStatusEnum.OK,
      message: 'Success',
      body: processStateEnum[1]
    };
    const expectedActiveStates: ProcessState[] = [processStateEnum[1]];
    const mockResponse: boolean = false;

    callGetExtractGenerationStateAndExpect(mockState, expectedActiveStates, mockResponse);
  });

  it('should add processStateEnum[5] to activeStates if isBusy is true and processStateEnum[5] is not already included', () => {
    const mockState: QueryResult<ProcessState | null> = {
      status: QueryStatusEnum.OK,
      message: 'Success',
      body: processStateEnum[2]
    };
    const expectedActiveStates: ProcessState[] = [processStateEnum[2], processStateEnum[5]];
    const mockResponse: boolean = true;

    callGetExtractGenerationStateAndExpect(mockState, expectedActiveStates, mockResponse);
  });

  it('should not modify activeStates if state.body is null or undefined', () => {
    const mockState: QueryResult<ProcessState | null> = {
      status: QueryStatusEnum.OK,
      message: 'Success',
      body: null
    };
    const expectedActiveStates: ProcessState[] = [];
    const mockResponse: boolean = false;

    callGetExtractGenerationStateAndExpect(mockState, expectedActiveStates, mockResponse);
  });

  it('should not add processStateEnum[5] if it is already included in activeStates', () => {
    const mockState: QueryResult<ProcessState | null> = {
      status: QueryStatusEnum.OK,
      message: 'Success',
      body: processStateEnum[5]
    };
    const expectedActiveStates: ProcessState[] = [processStateEnum[5]];
    const mockResponse: boolean = true;

    callGetExtractGenerationStateAndExpect(mockState, expectedActiveStates, mockResponse);
  });

  function callGetExtractGenerationStateAndExpect(mockState: QueryResult<ProcessState | null>, expectedActiveStates: ProcessState[], mockResponse: boolean) {
    service.getExtractGenerationState(mockState).subscribe((states: ProcessState[]): void => {
      expect(states).toEqual(expectedActiveStates);
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/busy-check`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  }

  it('should return OK status and message on file generation success', () => {
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.OK,
      message: 'Le fichier a été généré correctement.'
    };

    service.generateSecureFile().subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual(mockResponse);
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/generate-extract`);
    expect(req.request.method).toBe('POST');

    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should return KO status and error message on file generation failure', () => {
    const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({
      status: 502,
      statusText: 'Ok',
    });

    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: 'Http failure response for /portal/service/pscextract/v1/generate-extract: 502 Ok'
    };


    service.generateSecureFile().subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual(mockResponse);
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/generate-extract`);
    expect(req.request.method).toBe('POST');

    req.flush({message: '502 Ok'}, mockErrorResponse);
  });

  it('should return correct result when HTTP download request is successful', () => {
    const mockBlob: Blob = new Blob(['test data'], { type: 'application/zip' });
    const mockResponse: HttpResponse<Blob> = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({
        'Content-Disposition': 'attachment; filename="testfile.zip"'
      }),
      status: 200,
      statusText: 'OK'
    });

    service.downloadExtract(`${baseApiUrl}/download`).subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual({
        status: QueryStatusEnum.OK,
        message: 'Téléchargement réussi',
        body: { blob: mockBlob, filename: 'testfile.zip' }
      });
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/download`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse.body, { headers: mockResponse.headers });
  });

  it('should return correct result when HTTP download request is successful but Content-Disposition has no filename', () => {
    const mockBlob: Blob = new Blob(['test data'], { type: 'application/zip' });
    const mockResponse: HttpResponse<Blob> = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({}),
      status: 200,
      statusText: 'OK'
    });

    service.downloadExtract(`${baseApiUrl}/download`).subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual({
        status: QueryStatusEnum.OK,
        message: 'Téléchargement réussi',
        body: { blob: mockBlob, filename: 'Extraction_Pro_sante_connect.zip' }
      });
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/download`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse.body, { headers: mockResponse.headers });
  });

  it('should return an error result when HTTP download request fails', () => {
    const mockError: ErrorEvent = new ErrorEvent('Network error', {
      message: 'Something went wrong'
    });

    service.downloadExtract(`${baseApiUrl}/download`).subscribe((result: QueryResult<any>): void => {
      expect(result).toEqual({
        status: QueryStatusEnum.KO,
        message: 'Erreur technique non-identifiée.'
      });
    });

    const req: TestRequest = httpMock.expectOne(`${baseApiUrl}/download`);
    expect(req.request.method).toBe('GET');
    req.error(mockError);
  });

  it('should send upload request with test file to server', () => {
    const mockFile: File = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const expectedUrl: string = `${environment.API_HOSTNAME}portal/service/pscextract/v1/upload/test`;
    const expectedResponse: QueryStatus = {
      status: QueryStatusEnum.OK,
      message: ASYNCHRONOUS_LAUNCH_SUCCESS_MSG,
    };

    service.uploadTestFile(mockFile).subscribe((result: QueryStatus) => {
      expect(result).toEqual(expectedResponse);
    });

    const req: TestRequest = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData: FormData = req.request.body as FormData;
    expect(formData.has('testFile')).toBeTrue();

    const fileEntry = formData.get('testFile');
    expect(fileEntry instanceof File).toBeTrue();
    expect(fileEntry).toEqual(mockFile);

    req.flush(null);
  });

  it('should handle testfile upload error response and return the error status', () => {
    const mockBlob: Blob = new Blob(['test content'], { type: 'text/plain' });
    const expectedUrl: string = `${environment.API_HOSTNAME}portal/service/pscextract/v1/upload/test`;
    const mockErrorResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: 'Http failure response for /portal/service/pscextract/v1/upload/test: 502 Bad Gateway'
    };

    service.uploadTestFile(mockBlob).subscribe((status: QueryStatus): void => {
      expect(status).toEqual(mockErrorResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');

    req.flush({ message: '502 Bad Gateway' },
      { status: 502, statusText: 'Bad Gateway' });
  });
})
