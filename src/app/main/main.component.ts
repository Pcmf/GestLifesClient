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
  public responsavel: any = [];
  public creditos: any = [];
  public rejeicoes: any = [];

  constructor(private dataService: DataService) {

    this.dataService.getLeadSts().subscribe(
      resp => {
        if (sessionStorage.getItem('form1')) {
          this.dados = JSON.parse(sessionStorage.getItem('form1'));
        }
        if (sessionStorage.getItem('form2')) {
          this.credito = JSON.parse(sessionStorage.getItem('form2'));
        }
        if (sessionStorage.getItem('submissoes')) {
          this.creditos = JSON.parse(sessionStorage.getItem('submissoes'));
        }
        if (sessionStorage.getItem('responsavel')) {
          this.responsavel = JSON.parse(sessionStorage.getItem('responsavel'));
        }
        if (sessionStorage.getItem('rejeicoes')) {
          this.rejeicoes = JSON.parse(sessionStorage.getItem('rejeicoes'));
        }
        this.dados.sts = resp.json().status;
        this.dados.datastatus = resp.json().datastatus;
      }
    );
  }

  ngOnInit() {
  }

}
