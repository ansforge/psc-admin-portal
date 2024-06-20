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
import {By} from '@angular/platform-browser';
import {ElementRef} from '@angular/core';

describe('InterrogationPsComponent', () => {
  let component: InterrogationPsComponent;
  let fixture: ComponentFixture<InterrogationPsComponent>;
  let psApiService: jasmine.SpyObj<PsApi>;

  const initialEditorJSON: JSON = {
    "idType": "8",
    "id": "11111111111",
    "nationalId": "811111111111",
    "lastName": "FISCHER",
    "firstNames": [
      {
        "firstName": "MARIE",
        "order": 0
      }
    ],
    "dateOfBirth": "27/01/1979",
    "birthAddressCode": "67544",
    "birthCountryCode": "99000",
    "birthAddress": "WISSEMBUOURG",
    "genderCode": "F",
    "phone": "0033663065418",
    "email": "MARIECH1@HOTMAIL.COM",
    "salutationCode": "MME",
    "professions": [],
    "ids": [
      "811111111111"
    ],
    "deactivated": null
  } as unknown as JSON;

  beforeEach(async () => {
    const psApiSpy = jasmine.createSpyObj('PsApi', ['getPSByIDNat', 'updatePS']);

    await TestBed.configureTestingModule({
      imports: [InterrogationPsComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: PsApi, useValue: psApiSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterrogationPsComponent);
    psApiService = TestBed.inject(PsApi) as jasmine.SpyObj<PsApi>;
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      [component['ID_NAT_PS']]: new FormControl('', Validators.required)
    });
    component.jsonEditorContainer = new ElementRef(document.createElement('div'));
    component.response = initialEditorJSON;
    component.unsub$ = new Subject<void>();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
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

  it('should display input error alert with correct message & CSS if form is invalid', () => {
    spyOn(component, 'handleAlert').and.callThrough();
    component.formGroup.controls[component['ID_NAT_PS']].setValue('');

    component.findPSByIDNat();
    fixture.detectChanges();

    expect(component.isInvalidInput).toBe(true);
    expect(component.handleAlert).toHaveBeenCalledWith(QueryStatusEnum.KO, 'Veuillez renseigner le champ « ID National » correctement avant de lancer une recherche');
    expect(component.toggleAlertCSS()).toBe(QueryStatusEnum.KO);

    const searchGroupElement = fixture.debugElement.query(By.css('.search-group')).nativeElement;
    expect(searchGroupElement.classList.contains('is-invalid')).toBe(true);
  });

  it('should call getPSByIDNat if form is valid', () => {
    const mockResponse = { status: QueryStatusEnum.OK, data: {} };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(psApiService.getPSByIDNat).toHaveBeenCalledWith('validID');
  });

  it('should set response if getPSByIDNat API response status is OK', () => {
    spyOn(component as any, 'initializeEditor').and.callThrough();
    const mockResponse = { status: QueryStatusEnum.OK, data: { key: 'value' } };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(psApiService.getPSByIDNat).toHaveBeenCalledWith('validID');
    expect(component.response).toEqual(mockResponse.data);
    expect(component['initializeEditor']).toHaveBeenCalled();
  });

  it('should set apiErrorMessage and toggleAlertCSS if getPSByIDNat API response status is KO', () => {
    spyOn(component, 'handleAlert').and.callThrough();
    const mockResponse = { status: QueryStatusEnum.KO, message: 'Error occurred' };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(component.handleAlert).toHaveBeenCalledWith(QueryStatusEnum.KO, 'Error occurred');
    expect(component.toggleAlertCSS()).toBe(QueryStatusEnum.KO);
    expect(component.response).toBeNull();
  });

  it('should set default error message if API response status is KO and message is null', () => {
    spyOn(component, 'handleAlert').and.callThrough();
    const mockResponse = { status: QueryStatusEnum.KO, message: null };
    psApiService.getPSByIDNat.and.returnValue(of(mockResponse));

    component.formGroup.controls[component['ID_NAT_PS']].setValue('validID');
    component.findPSByIDNat();

    expect(component.handleAlert).toHaveBeenCalledWith(QueryStatusEnum.KO, 'Une erreur est survenue');
    expect(component.toggleAlertCSS()).toBe(QueryStatusEnum.KO);
  });

  it('should set queryStatus and call toggleAlertCSS.set', () => {
    const mockStatus: QueryStatusEnum = QueryStatusEnum.KO;
    const mockMessage: string = 'Error message';

    component.handleAlert(mockStatus, mockMessage);

    expect(component.queryStatus).toEqual({ status: mockStatus, message: mockMessage });
    expect(component.toggleAlertCSS()).toEqual(mockStatus);
  });

  it('should save JSON data when canSave is true and updatePS API call succeeds', () => {
    const mockEditedJSON: JSON = {
      "idType": "8",
      "id": "2222222222",
      "nationalId": "82222222222",
      "lastName": "ZEGLER",
      "firstNames": [
        {
          "firstName": "HELOISE",
          "order": 0
        }
      ],
    } as unknown as JSON;

    const mockResponse = { status: QueryStatusEnum.OK, message: 'Updated successfully' };
    component['initializeEditor']();
    component.editor.set(mockEditedJSON);
    psApiService.updatePS.and.returnValue(of(mockResponse));
    component.canSave.set(true);

    spyOn(component, 'handleAlert').and.callThrough();

    component.saveJsonPs();

    expect(psApiService.updatePS).toHaveBeenCalledWith(mockEditedJSON);
    expect(component.response).toEqual(mockEditedJSON);
    expect(component.canSave()).toBeFalse();
    expect(component.handleAlert).toHaveBeenCalledWith(QueryStatusEnum.OK, mockResponse.message);
  });

  it('should handle error when updatePS API call fails', () => {
    const mockEditedJSON: JSON = {
      "idType": "8",
      "id": "2222222222",
      "nationalId": "82222222222",
      "lastName": "ZEGLER",
      "firstNames": [
        {
          "firstName": "HELOISE",
          "order": 0
        }
      ]
    } as unknown as JSON;

    const errorMessage: string = 'Error updating PS';
    psApiService.updatePS.and.returnValue(of({ status: QueryStatusEnum.KO, message: errorMessage }));
    component['initializeEditor']();
    component.editor.set(mockEditedJSON);
    component.canSave.set(true);

    spyOn(component, 'handleAlert').and.callThrough();

    component.saveJsonPs();

    expect(psApiService.updatePS).toHaveBeenCalledWith(mockEditedJSON);
    expect(component.handleAlert).toHaveBeenCalledWith(QueryStatusEnum.KO, errorMessage);
  });

  it('should not call updatePS when canSave is false', () => {
    const mockEditedJSON: JSON = {
      "idType": "8",
      "id": "2222222222",
      "nationalId": "82222222222",
      "lastName": "ZEGLER",
      "firstNames": [
        {
          "firstName": "HELOISE",
          "order": 0
        }
      ]
    } as unknown as JSON;

    component['initializeEditor']();
    component.editor.set(mockEditedJSON);
    component.canSave.set(false);

    spyOn(component, 'handleAlert');

    component.saveJsonPs();

    expect(psApiService.updatePS).not.toHaveBeenCalled();
    expect(component.response).not.toEqual(mockEditedJSON);
    expect(component.response).toEqual(initialEditorJSON);
    expect(component.handleAlert).not.toHaveBeenCalled();
  });
});
