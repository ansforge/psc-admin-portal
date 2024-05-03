import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-choix-csv-correspondance',
  standalone: true,
  imports: [],
  templateUrl: './choix-csv-correspondance.component.html',
  styleUrl: './choix-csv-correspondance.component.scss'
})
export class ChoixCsvCorrespondanceComponent {
  @Input() title: string='Choix csv correspondance';
  correspondance: {name?: string,data: File|null}|null=null;
  
  selectFile(event: Event): void {
    const fileSelector: HTMLInputElement = event.currentTarget as HTMLInputElement
    const files: FileList = fileSelector.files as FileList;
    if(files && files.length > 0) {
      this.correspondance = {
        name: files.item(0)?.name,
        data: files.item(0)
      };
    }
  }
}
