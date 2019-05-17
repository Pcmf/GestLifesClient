import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public dados: any = [];
  public credito: any = [];
  public analista = '';
  private creditos: any = [];
  constructor(private dataService: DataService) {

    this.dataService.getData('cltcr/' + this.dataService.getLead()).subscribe(
      resp => {
   //     console.log(resp.json());
        this.dados = resp.json().lead;

        this.creditos = resp.json().submissoes;
        let flag = false;
        this.creditos.forEach(ln => {
          if ( ln.dtcontratoparceiro !== null && !flag) {
            this.credito = ln;
            flag = true;
          }  else {
                if ( (ln.dtcontratocliente !== null || ln.status == 6) && !flag) {
                  this.credito = ln;
                }
          }
        });
      }
    );
   }

  ngOnInit() {
  }

}
