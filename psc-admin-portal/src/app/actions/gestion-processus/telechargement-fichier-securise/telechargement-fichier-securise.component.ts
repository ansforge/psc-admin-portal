import {Component, OnDestroy} from '@angular/core';
import {Extract} from '../../../api/extract.service';
import {Subject, takeUntil} from 'rxjs';
import {QueryStatusPanelComponent} from '../../../shared/query-status-panel/query-status-panel.component';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {QueryResult} from '../../../api/queryResult.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-telechargement-fichier-securise',
  standalone: true,
  imports: [
    QueryStatusPanelComponent
  ],
  templateUrl: './telechargement-fichier-securise.component.html',
  styleUrl: './telechargement-fichier-securise.component.scss'
})
export class TelechargementFichierSecuriseComponent implements OnDestroy{

  executionStatus: QueryStatus|null=null;
  errorMessage: string = '';

  private unsub$: Subject<void> = new Subject<void>();

  constructor(private extractService: Extract) {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  downloadFile(isTestFile: boolean = false) {
    let url: string = `${environment.API_HOSTNAME}portal/service/pscextract/v1/download`;
    if (isTestFile) {
      url += '/test';
    }
    this.extractService.downloadExtract(url).pipe(
      takeUntil(this.unsub$),
    ).subscribe((response: QueryResult<any>) => {
      if (response.status === QueryStatusEnum.OK && response.body) {
        const url = window.URL.createObjectURL(response.body.blob);
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = response.body.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        this.executionStatus = response;
        if (response.message) {
          this.errorMessage = ' Une erreur est survenue : ' + response.message;
        }
      }
    });
  }
}
