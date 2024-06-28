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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit {
  shown: boolean=false;
  @Input()
  contentText: string="Ceci est une boîte de confirmation";
  @Input()
  confirmButtonText: string="Confirmer";
  @Input()
  showEvent: Observable<void>|undefined;
  @Output("confirm")
  confirmEmitter: EventEmitter<void>=new EventEmitter();
  
  ngOnInit(): void {
    this.showEvent?.subscribe(
      () => this.show()
    );
  }
  
  show(): void {
    this.shown=true;
  }
  
  hide(): void {
    this.shown=false;
  }
  
  confirm(){
    this.hide();
    this.confirmEmitter.next();
  }
}
