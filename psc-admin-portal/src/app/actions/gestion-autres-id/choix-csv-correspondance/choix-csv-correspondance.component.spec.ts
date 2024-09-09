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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ChoixCsvCorrespondanceComponent } from './choix-csv-correspondance.component';
import { By } from '@angular/platform-browser';
import {CsvFileOperations, idTypeEnum} from '../../../api/toggle.service';
import { environment } from '../../../../environments/environment';

describe('ChoixCsvCorrespondanceComponent', () => {
  let component: ChoixCsvCorrespondanceComponent;
  let fixture: ComponentFixture<ChoixCsvCorrespondanceComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixCsvCorrespondanceComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixCsvCorrespondanceComponent);
    httpClient=TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should POST to the toggle backend', () => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('should send source as from parm', () => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);

    const payload: FormData = req.request.body;

    expect(payload.has('from')).toBeTrue();
    expect(payload.get('from')).toBe(FROM_ID_TYPE.code);

    httpTestingController.verify();
  });

  it('should send destination as to parm', () => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);

    const payload: FormData = req.request.body;

    expect(payload.has('to')).toBeTrue();
    expect(payload.get('to')).toBe(TO_ID_TYPE.code);

    httpTestingController.verify();
  });

  it('should send FILE', () => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);

    const payload: FormData = req.request.body;

    expect(payload.has('toggleFile')).toBeTrue();
    // let's not hope we'll be able to do something real with this, just check protocol
    expect(payload.get('toggleFile')).toBeDefined();

    httpTestingController.verify();
  });

  it('should diagnose tech problem',() => {
    const error: Partial<HttpErrorResponse> = {};
    const techProblem: Partial<ErrorEvent> = {
      error: error
    };

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);
    req.error(techProblem as ErrorEvent);

    fixture.detectChanges();

    const messagePanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(messagePanel.nativeElement).toHaveClass('o-alert--error');
  });

  it('should diagnose proxy problem',() => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);
    req.flush('Proxy error', {status: 503, statusText:'503 - not available'});

    fixture.detectChanges();

    const messagePanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(messagePanel.nativeElement).toHaveClass('o-alert--error');
  });

  it('should diagnose server problem',() => {

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);
    req.flush({message:'Internal Server Error'},{status: 500, statusText: '500, but curiously OK'});

    fixture.detectChanges();

    const messagePanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(messagePanel.nativeElement).toHaveClass('o-alert--error');
  });

  it('should diplay successfull submit',() => {

    const success: Partial<HttpResponse<void>> = {
      ok: true,
      status: 202
    }

    sendFile(component);

    const req = httpTestingController.expectOne(`${environment.API_HOSTNAME}portal/service/toggle/v1/toggle`);
    req.flush(success);

    fixture.detectChanges();

    const messagePanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(messagePanel.nativeElement).toHaveClass('o-alert--success');
  });
});

  export const FROM_ID_TYPE = idTypeEnum[0];
  export const TO_ID_TYPE = idTypeEnum[1];
  export const FILE = new Object() as File;

  function sendFile(component: ChoixCsvCorrespondanceComponent): void {
   const fileList: Partial<FileList> = {
        item: (n: number) => FILE,
        length: 1
    }
    const targetMock = {
      files: fileList
    } as unknown;

    const event: Partial<Event> = {
      currentTarget: targetMock as EventTarget
    };

    component.operation = CsvFileOperations.INSERT;
    component.selectFile(event as Event);
    component.sourceChange(FROM_ID_TYPE);
    component.destinationChange(TO_ID_TYPE);

    component.send()
 }
