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

import { TeleversementFichierTestComponent } from './televersement-fichier-test.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Extract} from '../../../api/extract.service';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {of} from 'rxjs';

describe('TeleversementFichierTestComponent', () => {
  let component: TeleversementFichierTestComponent;
  let fixture: ComponentFixture<TeleversementFichierTestComponent>;
  let extractService: jasmine.SpyObj<Extract>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ExtractService', ['uploadTestFile']);

    await TestBed.configureTestingModule({
      imports: [TeleversementFichierTestComponent, HttpClientTestingModule],
      providers: [{provide: Extract, useValue: spy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeleversementFichierTestComponent);
    component = fixture.componentInstance;
    extractService = TestBed.inject(Extract) as jasmine.SpyObj<Extract>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection and update fichierTest', () => {
    const file: File = new File(['test content'], 'test.txt', { type: 'text/plain' });

    const fileList: FileList = {
      length: 1,
      item: (index: number) => {
        return index === 0 ? file : null;
      }
    } as unknown as FileList;

    const event: Event = {
      currentTarget: {
        files: fileList
      }
    } as unknown as Event;

    component.selectFile(event);

    expect(component.fichierTest).toEqual({
      name: 'test.txt',
      data: file
    });
  });

  it('should handle file selection when no files are provided', () => {
    const event = {
      currentTarget: {
        files: []
      }
    } as unknown as Event;

    component.selectFile(event);

    expect(component.fichierTest).toBeNull();
  });

  it('should successfully call uploadTestFile on send if file is selected', () => {
    const file: File = new File(['test content'], 'test.txt', { type: 'text/plain' });
    component.fichierTest = { name: 'test.txt', data: file };

    const expectedResponse: QueryStatus = { status: QueryStatusEnum.OK, message: 'Upload successful' };
    extractService.uploadTestFile.and.returnValue(of(expectedResponse));

    component.send();

    expect(component.queryStatus).toEqual(expectedResponse);
  });

  it('should set queryStatus to KO if no file is selected on send', () => {
    component.fichierTest = null;

    component.send();

    expect(component.queryStatus).toEqual({
      status: QueryStatusEnum.KO,
      message: 'Illegal state : missing data.'
    });
  });
});
