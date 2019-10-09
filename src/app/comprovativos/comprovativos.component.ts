import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-comprovativos',
  templateUrl: './comprovativos.component.html',
  styleUrls: ['./comprovativos.component.css']
})
export class ComprovativosComponent implements OnInit {
  public docList: any = [];
  public docSelected: any = {};
  public erro = '';
  public loaded = false;
  private doc: any = [];
  private filename: string;
  private obj: any = {};

  constructor(private dataService: DataService, private route: Router) {
    this.loadDados();
  }
  ngOnInit() {

  }

  anexarDoc (doc) {
    this.docSelected = doc;
  }


  loadDados () {
    this.dataService.getData('cltcomp/' + this.dataService.getLead()).subscribe(
      resp => {
        this.docList = resp;

      }
    );
  }


  openDoc (doc) {
    this.dataService.getData('doc/' + doc.lead + '/' + doc.linha).subscribe(
      (resp: any) => {
        const document = resp[0];
        const file = new Blob([document.fx64], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    );
  }

  back() {
    this.route.navigate(['/']);
  }

}
