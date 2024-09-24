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

import { InformationDiffComponent } from './information-diff.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { By } from '@angular/platform-browser';
import { STATUS_MOCK_2_DELETED } from './diffStatusMock';
import FileSaver from 'file-saver';
import { ALERT_MOCK_1 } from '../alertMocks';

describe('InformationDiffComponent', () => {
  let component: InformationDiffComponent;
  let fixture: ComponentFixture<InformationDiffComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationDiffComponent,HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationDiffComponent);
    httpClient=TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should show alerts when some exist', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush([ALERT_MOCK_1]);
    
    fixture.detectChanges();
    
    const alertPanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(alertPanel.nativeElement).toHaveClass('o-alert--warning');
  });
  
  it('should show get diff when some alerts exist', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush([ALERT_MOCK_1]);
    
    fixture.detectChanges();
    
    const getDiffButton = fixture.debugElement.query(By.css('button.btn--default'));
    expect(getDiffButton.nativeElement).toBeTruthy();
    const buttonElt=getDiffButton.nativeElement as HTMLButtonElement;
    expect(buttonElt.textContent).toEqual("Consulter le diff");
  });
  
  it('should show green no alert when no alert exists', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush([]);
    
    fixture.detectChanges();
    
    const alertPanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(alertPanel.nativeElement).toHaveClass('o-alert--success');
  });
  
  it('should NOT show get diff when no alert exists', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush([]);
    
    fixture.detectChanges();
    
    const getDiffButton = fixture.debugElement.query(By.css('button.btn--primary'));
    expect(getDiffButton).toBeFalsy();
  });
  
  it('should show error panel if alert service unavailable', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush('Proxy error', {status: 503, statusText:'503 - not available'});
    
    fixture.detectChanges();
    
    const alertPanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(alertPanel.nativeElement).toHaveClass('o-alert--error');
  });
  
  it('should show error panel if alert service unavailable', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush('Proxy error', {status: 503, statusText:'503 - not available'});
    
    fixture.detectChanges();
    
    const alertPanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(alertPanel.nativeElement).toHaveClass('o-alert--error');
  });
  
  it('no diff button if alert service unavailable', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush('Proxy error', {status: 503, statusText:'503 - not available'});
    
    fixture.detectChanges();
    
    const alertPanel = fixture.debugElement.query(By.css('div.o-alert'));
    expect(alertPanel.nativeElement).toHaveClass('o-alert--error');
    
    const getDiffButton = fixture.debugElement.query(By.css('button.btn--primary'));
    expect(getDiffButton).toBeFalsy();
  });
  
  it('When diff downloaded, save as csv', () => {
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=email-notifications`
    );
    req.flush([ALERT_MOCK_1]);
    
    fixture.detectChanges();
    
    spyOn(FileSaver, 'saveAs').and.stub();
    
    const getDiffButton = fixture.debugElement.query(By.css('button.btn--default'))
      .nativeElement as HTMLButtonElement;
    getDiffButton.click();
    
    const req2=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/info?details=true`
    );
    req2.flush(STATUS_MOCK_2_DELETED);
    
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });
});
