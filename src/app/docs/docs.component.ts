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
  /* public loaded = false; */
  private doc: any = [];
  private filename: string;
  private obj: any = {};
  public missingDocs = true;
  public showSpiner: boolean;
  public showBtnFinalizar = false;

  constructor(private dataService: DataService, private router: Router) {
    this.showSpiner = true;
    this.loadDados();
  }
  ngOnInit() {
  }

  anexarDoc(doc) {
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
    } else if (file.size > 4000000) {
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
    this.obj = { 'lead': this.doc.lead, 'doc': this.doc, 'nomeFx': this.filename, 'fxBase64': reader.result };
    /*  this.loaded = true; */
  }

  confirmaAnexar() {
    this.dataService.saveData('cltdocs', this.obj)
      .subscribe(resp => {
        if (+resp == 0) {
          this.erro = '';
          this.loadDados();
          this.missingDocs = false;
        }
      });
  }

  loadDados() {
    this.dataService.getData('cltdocs/' + this.dataService.getLead()).subscribe(
      (resp: any) => {
        if (+resp.json()[0].status != 36 && +resp.json()[0].status != 4 && +resp.json()[0].status != 14 &&
         (+resp.json()[0].status < 10 || +resp.json()[0].status == 37 || +resp.json()[0].status == 38 || +resp.json()[0].status == 21)) {
          this.showBtnFinalizar = true;
        }
        if (resp.json().length > 0) {
          this.docList = resp.json();
          let n = 0;
          let r = 0;
          this.docList.forEach(e => {
            r += +e.recebido;
            n++;
          });
          r < n ? this.missingDocs = true : this.missingDocs = false;
        } else {
          this.missingDocs = true;
        }
        this.showSpiner = false;
      }
    );
  }

  finalizar() {
    // Verificar o status da lead
    this.dataService.getLeadSts().subscribe(
      resps => {
        let status = resps.json().status;
        console.log('status inicial ' + status);
        if (status == 8 || status == 9 || status == 37 || status == 38) {
          status = 36;
          console.log('alterou status ' + status);
        }
        // mudar o status para 36
        const obj = { 'lead': this.dataService.getLead(), 'status': status };
        this.dataService.editData('upstatus', obj).subscribe(
          resp => {
            this.showBtnFinalizar = false;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          }
        );
      }
    );
  }
  /**
   * Adicionar um documento depois de ter adicionado todos. Mostrar uma lista de documentos para selecionar o pretendido
   */
  addDocExtra() {
    this.docList.forEach(element => {
      element.status = 8;
    });
  }

}
