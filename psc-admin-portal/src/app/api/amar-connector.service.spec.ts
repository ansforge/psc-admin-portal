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

import {AmarConnectorService} from './amar-connector.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ProcessState, processStateEnum} from '../shared/process-state-widget/process.model';
import {environment} from '../../environments/environment';

describe('AmarConnectorService', () => {
  let service : AmarConnectorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AmarConnectorService ]
    });

    service = TestBed.inject(AmarConnectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add send message state to active states', () => {
    const activeStates: ProcessState[] = [processStateEnum[4]];
    const expectedActiveStates: ProcessState[] = [...activeStates, processStateEnum[6]];
    const mockResponse: boolean = true;

    service.getMessageState(activeStates).subscribe((states: ProcessState[]) => {
      expect(states).toEqual(expectedActiveStates);
    });

    const req: TestRequest = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/psc-amar-connector/check-pending-messages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(activeStates).toEqual(expectedActiveStates);
  });

  it('should not modify activeStates if hasPendingMsg is false', () => {
    const activeStates: ProcessState[] = [processStateEnum[1], processStateEnum[2]];
    const expectedActiveStates: ProcessState[] = [...activeStates];
    const mockResponse: boolean = false;

    service.getMessageState(activeStates).subscribe((states: ProcessState[]) => {
      expect(states).toEqual(activeStates);
    });

    const req = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/psc-amar-connector/check-pending-messages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(activeStates).toEqual(expectedActiveStates);
  });

  it('should not add send message if it is already included in activeStates', () => {
    const activeStates: ProcessState[] = [processStateEnum[1], processStateEnum[6]];
    const expectedActiveStates: ProcessState[] = [...activeStates];
    const mockResponse: boolean = true;

    service.getMessageState(activeStates).subscribe((states: ProcessState[]) => {
      expect(states).toEqual(expectedActiveStates);
    });

    const req = httpMock.expectOne(`${environment.API_HOSTNAME}portal/service/psc-amar-connector/check-pending-messages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(activeStates).toEqual(expectedActiveStates);
  });

})
