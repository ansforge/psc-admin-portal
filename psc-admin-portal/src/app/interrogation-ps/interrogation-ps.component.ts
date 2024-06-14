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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {JsonPipe} from '@angular/common';
import {QueryStatusEnum} from '../api/queryStatus.model';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PsApi} from '../api/psApi.service';

@Component({
  selector: 'app-interrogation-ps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgxJsonViewerModule
  ],
  templateUrl: './interrogation-ps.component.html',
  styleUrl: './interrogation-ps.component.scss'
})
export class InterrogationPsComponent implements OnInit, OnDestroy {
  private ID_NAT_PS: string = 'idNatPS';

  apiErrorMessage: string = '';
  isInvalid: boolean = false;
  shouldShowAlert: boolean = false;
  formGroup: FormGroup;

  unsub$: Subject<void> = new Subject<void>();
  response: any = null;

  constructor(private formBuilder: FormBuilder,
              private psApiService: PsApi,) {
    this.formGroup = formBuilder.group({idNatPS: new FormControl('', [Validators.required])});
  }

  ngOnInit(): void {
    this.formGroup.get(this.ID_NAT_PS)?.valueChanges.pipe(
      takeUntil(this.unsub$)
    ).subscribe(() => {
      if (this.formGroup.get(this.ID_NAT_PS)?.valid) {
        this.formGroup.get(this.ID_NAT_PS)?.setErrors(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  findPSByIDNat(): void {
    this.isInvalid = this.formGroup.invalid;
    this.shouldShowAlert = this.isInvalid;
    const idNatPS = this.formGroup.get(this.ID_NAT_PS)?.value;

    if (!this.isInvalid) {
      this.psApiService.getPSByIDNat(idNatPS).pipe(
        takeUntil(this.unsub$)
      ).subscribe((response) => {
        if (QueryStatusEnum.OK === response.status) {
          this.response = { data: response.data };
        } else {
          this.apiErrorMessage = response.message ?? 'Une erreur est survenue';
          this.shouldShowAlert = true;
        }
      });
    }
  }

  hideAlert(): void {
    this.shouldShowAlert = false;
  }
}
