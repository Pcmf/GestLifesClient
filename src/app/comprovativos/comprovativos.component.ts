import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

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

  handleInputChange(e, doc) {
    this.doc = doc;
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filename = file.name;
    const pattern = /pdf-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.erro = 'Formato inválido. O ficheiro tem de ser PDF!';
      // return;
    } else if ( file.size > 4000000 ) {
      this.erro = 'Ficheiro demasiado grande. Tem que ser inferior a 4Mb';
      // return;
    } else {
      this.erro = '';
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    this.obj = {'lead': this.doc.lead, 'doc': this.doc, 'nomeFx': this.filename, 'fxBase64': reader.result};
    this.loaded = true;
    console.log(this.obj);
  }

  confirmaAnexar () {
    this.dataService.saveData('cltcomp', this.obj)
      .subscribe( resp => {
        if (resp) {
          console.log(resp);
          this.erro = '';
          this.loaded = false;
          this.loadDados();
        }
      });
  }

  loadDados () {
    this.dataService.getData('cltcomp/' + this.dataService.getLead()).subscribe(
      resp => {
        this.docList = resp.json();
        console.log(this.docList);
      }
    );
  }


  openDoc (doc) {
    this.dataService.getData('doc/' + doc.lead + '/' + doc.linha).subscribe(
      (resp: any) => {
        const document = resp.json()[0];
        const file = new Blob([document.fx64], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    );
  }


}
