import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent {

  constructor(private dataService: DataService) {
    console.log('visita');
    const obj = {'lead': this.dataService.getLead(), 'tipo': 'vista'};
    this.dataService.saveData('ccview', obj).subscribe(
      resp => console.log('visita ' + resp)
    );
  }

  registerDownload () {
    console.log('Download');
    const obj = {'lead': this.dataService.getLead(), 'tipo': 'download'};
    this.dataService.saveData('ccview', obj).subscribe(
      resp => console.log('download  ' + resp)
    );
  }

}
