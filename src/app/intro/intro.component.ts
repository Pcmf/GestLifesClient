import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
  public dadosGestor: any = [];
  constructor (private dataService: DataService) {
    this.dataService.getData('dgest/' + this.dataService.getLead()).subscribe(
      resp => {
        this.dadosGestor = resp.json()[0];
      }
    );
  }

  ngOnInit () {

  }
}
