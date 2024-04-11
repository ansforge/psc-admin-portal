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
import { AccessibiliteComponent } from "./accessibilite/accessibilite.component";
import { UserComponent } from "./user/user.component";
import { NotificationComponent } from "./notification/notification.component";
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ AccessibiliteComponent, UserComponent, NotificationComponent, MainMenuComponent ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
