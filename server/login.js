/*
 * Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var loginLink=document.getElementById("login");
loginLink.href=loginLink.href+'?ts='+new Date().getTime()

var accessibilityButton=document.getElementById("buttonAccess");
var accessibilityForm=document.getElementById("collapseAccess");

accessibilityButton.onclick=function(){
  if (accessibilityButton.getAttribute("aria-expanded") === "false") {
    accessibilityButton.setAttribute("aria-expanded","true");
    accessibilityForm.classList.add("show");
  } else {
    accessibilityButton.setAttribute("aria-expanded","false");
    accessibilityForm.classList.remove("show");
  }
}
