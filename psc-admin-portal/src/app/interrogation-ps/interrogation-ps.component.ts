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
import {QueryStatus, QueryStatusEnum} from '../api/queryStatus.model';
import {PsApi} from '../api/psApi.service';
import JSONEditor, {JSONEditorOptions, ParseError, SchemaValidationError} from 'jsoneditor';
import {QueryStatusPanelComponent} from '../shared/query-status-panel/query-status-panel.component';
import {QueryResult} from '../api/queryResult.model';

@Component({
  selector: 'app-interrogation-ps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgClass,
    QueryStatusPanelComponent,
  ],
  templateUrl: './interrogation-ps.component.html',
  styleUrl: './interrogation-ps.component.scss'
})
export class InterrogationPsComponent implements OnInit, OnDestroy {
  private ID_NAT_PS: string = 'idNatPS';
  private ERROR_OCCURRED: string = 'Une erreur est survenue';

  @ViewChild('jsonEditorContainer', {static: false})
  jsonEditorContainer!: ElementRef;
  editor!: JSONEditor;

  formGroup: FormGroup;
  isInvalidInput: boolean = false;
  queryStatus: QueryStatus | null = null;
  response: any = null;

  canSave: WritableSignal<boolean> = signal(false);
  toggleAlertCSS: WritableSignal<QueryStatusEnum> = signal(QueryStatusEnum.PENDING);

  unsub$: Subject<void> = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private psApiService: PsApi) {
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
    this.destroyEditor();
    this.unsub$.next();
    this.unsub$.complete();
  }

  findPSByIDNat(): void {
    this.destroyEditor();
    this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
    this.isInvalidInput = this.formGroup.invalid;

    if (this.isInvalidInput) {
      this.handleAlert(QueryStatusEnum.KO, 'Veuillez renseigner le champ « ID National » correctement avant de lancer une recherche')
    } else {
      const idNatPS = this.formGroup.get(this.ID_NAT_PS)?.value;
      this.psApiService.getPSByIDNat(idNatPS).pipe(
        takeUntil(this.unsub$)
      ).subscribe((response) => {
        if (QueryStatusEnum.OK === response.status) {
          this.response = response.data;
          this.cdr.detectChanges();
          this.initializeEditor();
        } else {
          this.handleAlert(QueryStatusEnum.KO, response.message ?? this.ERROR_OCCURRED);
          this.response = null;
        }
      });
    }
  }

  saveJsonPs(): void {
    if (this.canSave()) {
      const updatedPsJSON: JSON = this.editor.get();
      this.psApiService.updatePS(updatedPsJSON).pipe(
        takeUntil(this.unsub$)
      ).subscribe((response: QueryResult<any>) => {
        if (QueryStatusEnum.OK === response.status) {
          this.response = updatedPsJSON;
          this.canSave.set(false);
          this.handleAlert(QueryStatusEnum.OK, response.message);
        } else {
          this.handleAlert(QueryStatusEnum.KO, response.message);
        }
      })
    }
  }

  handleAlert(status: QueryStatusEnum, message: string): void {
    this.queryStatus = {status: status, message: message};
    this.toggleAlertCSS.set(status);
  }

  removeAlertCSS(): void {
    this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
  }

  private initializeEditor(): void {
    if (this.jsonEditorContainer?.nativeElement) {
      const options: JSONEditorOptions = {
        mode: 'view',
        modes: ['code', 'form', 'view'],
        mainMenuBar: true,
        navigationBar: false,
        search: false,
        statusBar: false,
        sortObjectKeys: false,
        enableTransform: false,
        enableSort: true,
        onValidationError: (errors: readonly(SchemaValidationError | ParseError)[]) => {
          if (errors.length > 0) {
            this.canSave.set(false);
          }
        },
        onChange: () => {
          this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
          const hasChanged: boolean = JSON.stringify(this.response) !== JSON.stringify(this.editor.get());
          hasChanged ? this.canSave.set(true) : this.canSave.set(false);
        }
      };
      this.editor = new JSONEditor(this.jsonEditorContainer.nativeElement, options);
      this.editor.set(this.response);
    }
  }

  private destroyEditor(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  protected readonly QueryStatusEnum = QueryStatusEnum;
}
