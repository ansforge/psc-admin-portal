import { Component, Input } from '@angular/core';
import { QueryStatus, QueryStatusEnum } from '../../api/queryStatus.model';

@Component({
  selector: 'app-query-status-panel',
  standalone: true,
  imports: [],
  templateUrl: './query-status-panel.component.html',
  styleUrl: './query-status-panel.component.scss'
})
export class QueryStatusPanelComponent {
  qs: typeof QueryStatusEnum=QueryStatusEnum;
  @Input() errorMessage: string='Erreur lors de la requête';
  @Input() queryStatus: QueryStatus|null=null;
  
  forgetStatus() {
    this.queryStatus=null;
  }
}
