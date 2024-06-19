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

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {JsonPipe, NgClass} from '@angular/common';
import {QueryStatusEnum} from '../api/queryStatus.model';
import {PsApi} from '../api/psApi.service';
import JSONEditor, {JSONEditorOptions, ParseError, SchemaValidationError} from 'jsoneditor';

@Component({
  selector: 'app-interrogation-ps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgClass,
  ],
  templateUrl: './interrogation-ps.component.html',
  styleUrl: './interrogation-ps.component.scss'
})
export class InterrogationPsComponent implements OnInit, OnDestroy {
  private ID_NAT_PS: string = 'idNatPS';

  @ViewChild('jsonEditorContainer', { static: false })
  jsonEditorContainer!: ElementRef;
  editor!: JSONEditor;

  canSave: WritableSignal<boolean> = signal(false);

  formGroup: FormGroup;
  apiErrorMessage: string = '';
  isInvalidInput: boolean = false;
  shouldShowAlert: boolean = false;

  unsub$: Subject<void> = new Subject<void>();
  response: any = null;

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private psApiService: PsApi,) {
    this.formGroup = formBuilder.group({
      idNatPS: new FormControl('', [Validators.required])
    });
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
    this.isInvalidInput = this.formGroup.invalid;
    this.shouldShowAlert = this.isInvalidInput;
    const idNatPS = this.formGroup.get(this.ID_NAT_PS)?.value;

    if (!this.isInvalidInput) {
      this.psApiService.getPSByIDNat(idNatPS).pipe(
        takeUntil(this.unsub$)
      ).subscribe((response) => {
        if (QueryStatusEnum.OK === response.status) {
          this.response = response.data;
          this.cdr.detectChanges();
          if (!this.editor) {
            this.initializeEditor();
          } else {
            this.editor.set(this.response);
          }
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

  saveJsonPs(): void {
    // TODO implement save
  }

  private initializeEditor(): void {
    if (this.jsonEditorContainer && this.jsonEditorContainer.nativeElement) {
      const options: JSONEditorOptions = {
        mode: 'view',
        modes: ['tree', 'code', 'form', 'view', 'text'],
        mainMenuBar: true,
        navigationBar: false,
        search: false,
        statusBar: false,
        sortObjectKeys: false,
        colorPicker: true,
        enableTransform: false,
        onValidationError: (errors: readonly(SchemaValidationError | ParseError)[]) => {
          this.canSave.set(errors.length === 0);
        },
      };
      this.editor = new JSONEditor(this.jsonEditorContainer.nativeElement, options);
      this.editor.set(this.response);
    }
  }
}
