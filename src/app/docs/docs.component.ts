import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
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
  ngOnInit() { }

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
  }

  confirmaAnexar () {
    this.dataService.saveData('cltdocs', this.obj)
      .subscribe( resp => {
        if (resp) {
          this.erro = '';
          this.loaded = false;
          this.loadDados();
        }
      });
  }

  loadDados () {
    this.dataService.getData('cltdocs/' + this.dataService.getLead()).subscribe(
      resp => {
        this.docList = resp.json();
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
