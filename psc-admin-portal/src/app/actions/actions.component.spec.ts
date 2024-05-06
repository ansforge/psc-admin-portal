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

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ActionsComponent } from './actions.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ActionsComponent', () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;
  let processusRadio: HTMLInputElement;
  let autreIdsRadio: HTMLInputElement;
  let alertesRadio: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsComponent],
      providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          url: of([
            [{path: ''}]
          ])
        }
      }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    processusRadio=fixture.debugElement
          .nativeElement
          .querySelector('#gestionProcessusBtn');
    alertesRadio=fixture.debugElement
          .nativeElement
          .querySelector('#gestionAlertesBtn');
    autreIdsRadio=fixture.debugElement
          .nativeElement
          .querySelector('#gestionAutresIdBtn');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should honor clicks to Gestion du processus',  fakeAsync(() => {
    processusRadio.click();
    tick();
    expect(processusRadio?.checked).toBeTrue();
    expect(autreIdsRadio?.checked).toBeFalsy();
    expect(alertesRadio?.checked).toBeFalsy();
  }));
  
  it('should honor clicks to Gestion du processus',  fakeAsync(() => {
    autreIdsRadio.click();
    tick();
    expect(autreIdsRadio?.checked).toBeTrue();
    expect(processusRadio?.checked).toBeFalsy();
    expect(alertesRadio?.checked).toBeFalsy();
  }));
  
  it('should honor clicks to Gestion des alertes',  fakeAsync(() => {
    alertesRadio.click();
    tick();
    expect(alertesRadio?.checked).toBeTrue();
    expect(processusRadio?.checked).toBeFalsy();
    expect(autreIdsRadio?.checked).toBeFalsy();
  }));
});
