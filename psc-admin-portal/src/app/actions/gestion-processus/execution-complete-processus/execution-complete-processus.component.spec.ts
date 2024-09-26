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

import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ExecutionCompleteProcessusComponent, RemoveRassExtract} from './execution-complete-processus.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import {Pscload} from '../../../api/pscload.service';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {of, Subject} from 'rxjs';
import {QueryResult} from '../../../api/queryResult.model';

describe('ExecutionCompleteProcessusComponent', () => {
  let component: ExecutionCompleteProcessusComponent;
  let fixture: ComponentFixture<ExecutionCompleteProcessusComponent>;
  let serviceMock: jasmine.SpyObj<Pscload>;
  let unsub$: Subject<void>;

  beforeEach(async () => {
    unsub$ = new Subject<void>();
    const spy = jasmine.createSpyObj('Pscload', ['removeRassExtract', 'executerProcessusComplet']);

    await TestBed.configureTestingModule({
      imports: [ExecutionCompleteProcessusComponent, HttpClientTestingModule],
      providers: [{provide: Pscload, useValue: spy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionCompleteProcessusComponent);
    TestBed.inject(HttpClient);
    component = fixture.componentInstance;
    serviceMock = TestBed.inject(Pscload) as jasmine.SpyObj<Pscload>;
    component.unsub$ = unsub$;
    fixture.detectChanges();
  });

  afterEach(() => {
    unsub$.next();
    unsub$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeRassExtract and execute process complet on success', fakeAsync(() => {
    const rassExtractResult: QueryResult<any> = { status: QueryStatusEnum.OK, message: 'Extraction removed successfully.' };
    const executionStatus: QueryStatus = { status: QueryStatusEnum.PENDING, message: 'Extraction removed successfully. Requête d\'exécution envoyée' };
    component.supprimerExtraction = RemoveRassExtract.YES;

    serviceMock.removeRassExtract.and.returnValue(of(rassExtractResult));
    serviceMock.executerProcessusComplet.and.returnValue(of(executionStatus));

    component.executer();
    tick();

    expect(serviceMock.removeRassExtract).toHaveBeenCalled();
    expect(serviceMock.executerProcessusComplet).toHaveBeenCalled();
    expect(component.executionStatus).toEqual(executionStatus);
  }));

  it('should set executionStatus to KO when removeRassExtract fails', fakeAsync(() => {
    const rassExtractResult: QueryResult<any> = { status: QueryStatusEnum.KO, message: 'Failed to remove extraction.' };
    component.supprimerExtraction = RemoveRassExtract.YES;

    serviceMock.removeRassExtract.and.returnValue(of(rassExtractResult));

    component.executer();
    tick();

    expect(serviceMock.removeRassExtract).toHaveBeenCalled();
    expect(component.executionStatus).toEqual(rassExtractResult);
  }));

  it('should call executerProcessusComplet directly when extraction is not to be removed', fakeAsync(() => {
    component.supprimerExtraction = RemoveRassExtract.NO;

    serviceMock.executerProcessusComplet.and.returnValue(of({ status: QueryStatusEnum.OK, message: 'Requête d\'exécution en succès' }));

    component.executer();
    tick();

    expect(serviceMock.executerProcessusComplet).toHaveBeenCalledWith();
  }));
});
