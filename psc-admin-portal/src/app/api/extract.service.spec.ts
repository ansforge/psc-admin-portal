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
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {QueryResult} from './queryResult.model';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';
import {QueryStatusEnum} from './queryStatus.model';
import {environment} from '../../environments/environment';

describe('ExtractService', () => {
  let service: Extract;
  let httpMock: HttpTestingController;

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
    service.getExtractGenerationState(mockState).subscribe((states: ProcessState[]) => {
      expect(states).toEqual(expectedActiveStates);
    });

    const req = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/pscextract/v1/busy-check`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  }
})
