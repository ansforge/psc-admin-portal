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

import { Component, OnDestroy, OnInit } from "@angular/core";
import { DsService } from "./ds.service";

@Component({
  standalone: true,
  template: '<!-- DS popup -->'
})
export class DsPopup implements OnInit, OnDestroy{
  shown: boolean = false;
  subscription: any;
  lastClick: any;
  
  
  constructor(
    private ds: DsService
  ){}
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.subscription = this.ds.registerPopupToHide(
       (event: any) => {
         if(event !== this.lastClick) {
           this.shown=false;
         }
       }
    );
  }
  
  get expanded(): boolean {
    return this.shown;
  }
  
  onToggle(event: any) {
    this.lastClick = event;
    this.shown = !this.shown;
  }
  
}
