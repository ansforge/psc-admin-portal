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
import { HttpClient, HttpResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { TraitementAlertesComponent } from './traitement-alertes.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';

describe('TraitementAlertesComponent', () => {
  let component: TraitementAlertesComponent;
  let fixture: ComponentFixture<TraitementAlertesComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraitementAlertesComponent,HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraitementAlertesComponent);
    httpClient=TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('Should POST continue with no excludes when only Force Continue is clicked', () => {
      
    clickForceContinue(fixture);
      
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/continue?exclude=`
    );
      
    httpTestingController.verify();
  });
  
  it('should display success if POST succeeds',() => {
    
    clickForceContinue(fixture);
    
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/continue?exclude=`
    );
    
    const success: Partial<HttpResponse<void>> = {
      ok: true,
      status: 202
    }
    req.flush(success);
    
    fixture.detectChanges();
    
    const okPanel=fixture.debugElement.query(By.css('div.o-alert--success>p')).nativeElement as HTMLElement;
    expect(okPanel.textContent).toBe('Processus successfully relaunched');
    
    httpTestingController.verify();
  });
  
  it('should display failure if POST fails',() => {
    
    clickForceContinue(fixture);
    
    const req=httpTestingController.expectOne(
      `${environment.API_HOSTNAME}portal/service/pscload/v2/process/continue?exclude=`
    );
    
    const failure: Partial<HttpResponse<void>> = {
      ok: false,
      status: 503
    }
    req.flush('Proxy error', {status: 503, statusText:'503 - not available'});
    
    fixture.detectChanges();
    
    const okPanel=fixture.debugElement.query(By.css('div.o-alert--error>p')).nativeElement as HTMLElement;
    expect(okPanel.textContent).toBe('Erreur de déclenchement de l\'opération.');
    
    httpTestingController.verify();
  });
    
});

function clickForceContinue(fixture: ComponentFixture<TraitementAlertesComponent>) {
  const forceContinueButton = fixture.debugElement.query(By.css('button.btn--primary.btn--plain')).nativeElement as HTMLButtonElement;
  expect(forceContinueButton.textContent).toBe('Force continue');
  forceContinueButton.click();
  
  const confirmButton = fixture.debugElement.query(
      By.css('app-confirm-modal button.btn--primary.btn--plain')
    )
    .nativeElement as HTMLButtonElement;
  
  expect(confirmButton.textContent).toBe('Lancer');
  confirmButton.click();
}
