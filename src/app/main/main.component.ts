import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public dados: any = [];
  constructor(private dataService: DataService) {
    console.log(this.dataService.getLead());
    this.dataService.getData('cltcr/' + this.dataService.getLead() + '/' + sessionStorage.token).subscribe(
      resp => {
        console.log(resp.json());
        this.dados = resp.json().lead;
      }
    );
   }

  ngOnInit() {
  }

}
