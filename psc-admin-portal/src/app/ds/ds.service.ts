/*
 *  Copyright (c) 2020 - 2024 Henix, henix.fr
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/* 
 * Common logic for design system elements 
 */
 
 import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
 @Injectable({providedIn: 'root'})
 export class DsService {
   private hideChannel = new Subject<any>();
   
   registerPopupToHide(hideCallback: (event: any) => void) {
     return this.hideChannel.subscribe(hideCallback);
   }
   
   hideAllPopups(event: any) {
     this.hideChannel.next(event);
   }
 }