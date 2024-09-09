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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelechargementFichierSecuriseComponent } from './telechargement-fichier-securise.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Extract} from '../../../api/extract.service';
import {environment} from '../../../../environments/environment';
import {QueryResult} from '../../../api/queryResult.model';
import {QueryStatusEnum} from '../../../api/queryStatus.model';
import {of} from 'rxjs';

describe('TelechargementFichierSecuriseComponent', () => {
  let component: TelechargementFichierSecuriseComponent;
  let fixture: ComponentFixture<TelechargementFichierSecuriseComponent>;
  let extractService: jasmine.SpyObj<Extract>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const extractServiceSpy = jasmine.createSpyObj('ExtractService', ['downloadExtract']);

    await TestBed.configureTestingModule({
      imports: [TelechargementFichierSecuriseComponent, HttpClientTestingModule],
      providers: [
        { provide: Extract, useValue: extractServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelechargementFichierSecuriseComponent);
    component = fixture.componentInstance;
    extractService = TestBed.inject(Extract) as jasmine.SpyObj<Extract>;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('a').forEach(el => el.remove());
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate a file download with the correct URL and filename on success', () => {
    const mockBlob = new Blob(['mock file content'], { type: 'application/pdf' });
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.OK,
      message: 'Téléchargement réussi',
      body: {
        blob: mockBlob,
        filename: 'test-file.pdf'
      }
    };

    extractService.downloadExtract.and.returnValue(of(mockResponse));

    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:http://localhost');

    const appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
    const removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

    component.downloadFile();

    fixture.detectChanges();

    expect(extractService.downloadExtract).toHaveBeenCalledWith(`${environment.API_HOSTNAME}portal/service/pscextract/v1/download`);
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockResponse.body.blob);

    expect(appendChildSpy).toHaveBeenCalled();
    const anchor: HTMLAnchorElement = appendChildSpy.calls.mostRecent().args[0] as HTMLAnchorElement;

    expect(anchor.href).toBe('blob:http://localhost');
    expect(anchor.download).toBe('test-file.pdf');

    expect(anchor.click).toBeDefined();
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
  });

  it('should handle file download errors and set error message', () => {
    const mockErrorResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: 'Download failed'
    };

    extractService.downloadExtract.and.returnValue(of(mockErrorResponse));

    component.downloadFile();

    fixture.detectChanges();

    expect(component.executionStatus).toEqual(mockErrorResponse);
    expect(component.errorMessage).toBe(' Une erreur est survenue : Download failed');
  });

  it('should handle downloading a test file correctly', () => {
    const mockBlob = new Blob(['mock test file content'], { type: 'application/pdf' });
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.OK,
      message: 'Téléchargement réussi',
      body: {
        blob: mockBlob,
        filename: 'test-test-file.pdf'
      }
    };

    extractService.downloadExtract.and.returnValue(of(mockResponse));

    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:http://localhost');

    const appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
    const removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();


    component.downloadFile(true);

    fixture.detectChanges();

    const url = `${environment.API_HOSTNAME}portal/service/pscextract/v1/download/test`;
    expect(extractService.downloadExtract).toHaveBeenCalledWith(url);
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);

    expect(appendChildSpy).toHaveBeenCalled();
    const anchor: HTMLAnchorElement = appendChildSpy.calls.mostRecent().args[0] as HTMLAnchorElement;

    expect(anchor.href).toBe('blob:http://localhost');
    expect(anchor.download).toBe('test-test-file.pdf');

    expect(anchor.click).toBeDefined();
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
  });

  it('should handle file download errors with no specific message', () => {
    const mockErrorResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: 'Failure code 409'
    };

    extractService.downloadExtract.and.returnValue(of(mockErrorResponse));

    component.downloadFile();

    fixture.detectChanges();

    expect(component.executionStatus).toEqual(mockErrorResponse);
    expect(component.errorMessage).toBe(' Une erreur est survenue : Failure code 409');
  });
});
