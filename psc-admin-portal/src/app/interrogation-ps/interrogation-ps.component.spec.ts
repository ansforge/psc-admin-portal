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

import { InterrogationPsComponent } from './interrogation-ps.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {QueryStatusEnum} from '../api/queryStatus.model';
import {PsApi} from '../api/psApi.service';

describe('InterrogationPsComponent', () => {
  let component: InterrogationPsComponent;
  let fixture: ComponentFixture<InterrogationPsComponent>;
  let psApiService: jasmine.SpyObj<PsApi>;

  beforeEach(async () => {
    const psApiSpy = jasmine.createSpyObj('PsApi', ['getPSByIDNat']);

    await TestBed.configureTestingModule({
      imports: [InterrogationPsComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: PsApi, useValue: psApiSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterrogationPsComponent);
    psApiService = TestBed.inject(PsApi) as jasmine.SpyObj<PsApi>;
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      [component['ID_NAT_PS']]: new FormControl('', Validators.required)
    });
    component.unsub$ = new Subject<void>();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.unsub$.next();
    component.unsub$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to form control value changes and reset errors when value is valid', () => {
    const idNatPsControl = component.formGroup.get(component['ID_NAT_PS']);
    idNatPsControl!.setErrors({ required: true });

    spyOn(idNatPsControl!.valueChanges, 'pipe').and.callThrough();
    spyOn(idNatPsControl!, 'setErrors').and.callThrough();

    component.ngOnInit();

    idNatPsControl!.setValue('valid value');
    expect(idNatPsControl!.setErrors).toHaveBeenCalledWith(null);
    expect(idNatPsControl?.errors).toBeNull();

    idNatPsControl!.setValue('');
    expect(idNatPsControl?.errors).not.toBeNull();
  });

  it('should set shouldShowAlert to true if form is invalid', () => {
    component.formGroup.controls[component['ID_NAT_PS']].setValue('');
    component.findPSByIDNat();

    expect(component.isInvalid).toBe(true);
    expect(component.shouldShowAlert).toBe(true);
  });

  it('should call getPSByIDNat if form is valid', () => {
    const mockResponse = { status: QueryStatusEnum.OK, data: {} };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(psApiService.getPSByIDNat).toHaveBeenCalledWith('validID');
  });

  it('should set response if API response status is OK', () => {
    const mockResponse = { status: QueryStatusEnum.OK, data: { key: 'value' } };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(component.response).toEqual({ data: mockResponse.data });
  });

  it('should set apiErrorMessage and shouldShowAlert if API response status is KO', () => {
    const mockResponse = { status: QueryStatusEnum.KO, message: 'Error occurred' };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(component.apiErrorMessage).toBe('Error occurred');
    expect(component.shouldShowAlert).toBe(true);
  });

  it('should set default error message if API response status is KO and message is null', () => {
    const mockResponse = { status: QueryStatusEnum.KO, message: null };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(component.apiErrorMessage).toBe('Une erreur est survenue');
    expect(component.shouldShowAlert).toBe(true);
  });
});
