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

import { GestionAlertesComponent } from './gestion-alertes.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ALERT_MOCK_1 } from './alertMocks';
import { environment } from '../../../environments/environment';
import { By } from '@angular/platform-browser';

describe('GestionAlertesComponent', () => {
  let component: GestionAlertesComponent;
  let fixture: ComponentFixture<GestionAlertesComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAlertesComponent,HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAlertesComponent);
    httpClient=TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    TestBed.inject(HttpClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display traitement alertes if there are alerts', () => {
    const reqs = httpTestingController.match(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=web.hook`
    );
    
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    
    for(let req of reqs) {
      req.flush([ALERT_MOCK_1]);
    }
    
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('app-traitement-alertes'))).toBeTruthy();
  });
  
  it('should not display traitement alertes if there is no alert', () => {
    const reqs = httpTestingController.match(
      `${environment.API_HOSTNAME}portal/service/alertmanager/api/v2/alerts?receiver=web.hook`
    );
    
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    
    for(let req of reqs) {
      req.flush([]);
    }
    
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('app-traitement-alertes'))).toBeFalsy();
  });
  
});
