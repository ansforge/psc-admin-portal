import {Component, OnDestroy} from '@angular/core';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {Subject, takeUntil} from 'rxjs';
import {Extract} from '../../../api/extract.service';
import {QueryResult} from '../../../api/queryResult.model';
import {QueryStatusPanelComponent} from '../../../shared/query-status-panel/query-status-panel.component';

@Component({
  selector: 'app-generation-extract-securise',
  standalone: true,
  imports: [
    QueryStatusPanelComponent
  ],
  templateUrl: './generation-extract-securise.component.html',
  styleUrl: './generation-extract-securise.component.scss'
})
export class GenerationExtractSecuriseComponent implements OnDestroy {
  executionStatus: QueryStatus | null = null;
  statusMessage: string = '';

  private unsub$: Subject<void> = new Subject<void>();

  constructor(private extractService: Extract) {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  generateFile(): void {
    this.extractService.generateSecureFile().pipe(
      takeUntil(this.unsub$),
    ).subscribe((response: QueryResult<any>) => {
      this.executionStatus = response;
      if (response.message) {
        this.statusMessage = response.status === QueryStatusEnum.KO ?
            'Échec du téléchargement de l\'extrait, une erreur est survenue : ' + response.message : response.message;
      }
    });
  }
}
