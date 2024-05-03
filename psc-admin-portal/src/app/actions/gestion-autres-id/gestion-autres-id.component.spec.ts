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

import { GestionAutresIdComponent } from './gestion-autres-id.component';

describe('ToggleComponent', () => {
  let component: GestionAutresIdComponent;
  let fixture: ComponentFixture<GestionAutresIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAutresIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAutresIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
