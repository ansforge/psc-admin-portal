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

import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ActionsOptions } from './actions-options.model';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  readonly actionsOptions: typeof ActionsOptions = ActionsOptions;
  
  lastActiveChanged: ActionsOptions|null=null;
  
  onRouterLinkActive(event: boolean,radio: ActionsOptions): void {
    if(event) {
      this.lastActiveChanged = radio;
    } else if( this.lastActiveChanged===radio) {
      this.lastActiveChanged=null;
    }
  }
  
  checked(radio: ActionsOptions): string|null{
    if(this.lastActiveChanged===radio) {
      return 'checked';
    } else {
      return null;
    }
  }
}
