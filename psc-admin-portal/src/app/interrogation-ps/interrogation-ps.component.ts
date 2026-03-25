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
  private LAST_NAME: string = 'lastName';
  private FIRST_NAMES: string = 'firstNames';
  private ERROR_OCCURRED: string = 'Une erreur est survenue';

  @ViewChild('jsonEditorContainer', {static: false})
  jsonEditorContainer!: ElementRef;
  editor!: JSONEditor;

  formGroup: FormGroup;
  searchMode: 'idnat' | 'name' = 'idnat';
  includeDeactivated: boolean = false;
  isInvalidInput: boolean = false;
  queryStatus: QueryStatus | null = null;
  response: any = null;
  nameResults: {nationalId: string, companyNames: string[]}[] | null = null;

  canSave: WritableSignal<boolean> = signal(false);
  toggleAlertCSS: WritableSignal<QueryStatusEnum> = signal(QueryStatusEnum.PENDING);
  confirmAction: 'deactivate' | 'force-delete' | null = null;

  unsub$: Subject<void> = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private psApiService: PsApi) {
    this.formGroup = formBuilder.group({
      idNatPS: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      firstNames: new FormControl('')
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

  onSearchModeChange(): void {
    this.isInvalidInput = false;
    this.queryStatus = null;
    this.response = null;
    this.nameResults = null;
    this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
    this.destroyEditor();
    this.formGroup.reset();
  }

  findPSByIDNat(): void {
    this.destroyEditor();
    this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
    this.isInvalidInput = this.formGroup.get(this.ID_NAT_PS)?.invalid ?? true;

    if (this.isInvalidInput) {
      this.handleAlert(QueryStatusEnum.KO, 'Veuillez renseigner le champ « ID National » correctement avant de lancer une recherche')
    } else {
      const idNatPS = this.formGroup.get(this.ID_NAT_PS)?.value;
      this.psApiService.getPSByIDNat(idNatPS, this.includeDeactivated).pipe(
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

  searchByName(): void {
    this.toggleAlertCSS.set(QueryStatusEnum.PENDING);
    const lastName = this.formGroup.get(this.LAST_NAME)?.value?.trim();
    const firstNames = this.formGroup.get(this.FIRST_NAMES)?.value?.trim();

    if (!lastName && !firstNames) {
      this.isInvalidInput = true;
      this.handleAlert(QueryStatusEnum.KO, 'Veuillez renseigner au moins un champ (nom ou prénom) avant de lancer une recherche');
      return;
    }

    this.isInvalidInput = false;
    this.nameResults = null;
    this.psApiService.searchPsByName(lastName || undefined, firstNames || undefined).pipe(
      takeUntil(this.unsub$)
    ).subscribe((response) => {
      if (QueryStatusEnum.OK === response.status) {
        this.nameResults = response.body ?? [];
        if (this.nameResults!.length === 0) {
          this.handleAlert(QueryStatusEnum.KO, 'Aucun PS trouvé pour ces critères');
        }
      } else {
        this.handleAlert(QueryStatusEnum.KO, response.message ?? this.ERROR_OCCURRED);
        this.nameResults = null;
      }
    });
  }

  openConfirm(action: 'deactivate' | 'force-delete'): void {
    this.confirmAction = action;
  }

  cancelConfirm(): void {
    this.confirmAction = null;
  }

  confirmAndExecute(): void {
    if (!this.confirmAction) return;
    const idNatPS = this.formGroup.get(this.ID_NAT_PS)?.value;
    const action = this.confirmAction;
    this.confirmAction = null;

    if (action === 'deactivate') {
      this.psApiService.deactivatePS(idNatPS).pipe(
        takeUntil(this.unsub$)
      ).subscribe(response => {
        if (QueryStatusEnum.OK === response.status) {
          this.handleAlert(QueryStatusEnum.OK, response.message ?? 'PS désactivé avec succès');
          this.findPSByIDNat();
        } else {
          this.handleAlert(QueryStatusEnum.KO, response.message ?? this.ERROR_OCCURRED);
        }
      });
    } else {
      this.psApiService.forceDeletePS(idNatPS).pipe(
        takeUntil(this.unsub$)
      ).subscribe(response => {
        if (QueryStatusEnum.OK === response.status) {
          this.handleAlert(QueryStatusEnum.OK, response.message ?? 'PS supprimé définitivement');
          this.findPSByIDNat();
        } else {
          this.handleAlert(QueryStatusEnum.KO, response.message ?? this.ERROR_OCCURRED);
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
