import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  situacoes: any = [];
  habitacoes: any = [];
  relacoes: any = [];
  estados: any = [];
  public lead: any = [];
//  public segundoProponente: boolean;
  public showAlert = false;
  public readOnly = false;

  constructor(private dataService: DataService, private route: Router) {
    if (sessionStorage.getItem('form1')) {
      this.lead = JSON.parse(sessionStorage.getItem('form1'));
    }
/*     this.lead.segundoproponente && this.lead.segundoproponente == 1 ? this.segundoProponente = true : this.segundoProponente = undefined;
    this.lead.segundoproponente && this.lead.segundoproponente == 0 ? 
    this.segundoProponente = false : this.segundoProponente = undefined; */
    this.readOnly = this.dataService.isReadOnly();
  }

  ngOnInit() {

    this.dataService.getData('getdata/' + 'cnf_sitprofissional').subscribe(
      resp => this.situacoes = resp
    );
    this.dataService.getData('getdata/' + 'cnf_tipohabitacao').subscribe(
      resp => this.habitacoes = resp
    );
    this.dataService.getData('getdata/' + 'cnf_relacaofamiliar').subscribe(
      resp => this.relacoes = resp
    );
    this.dataService.getData('getdata/' + 'cnf_sitfamiliar').subscribe(
      resp => this.estados = resp
    );
  }

  showResult(f) {
    console.log(f);
  }

  clear2Prop(prop) {
    if (!prop) {
     // this.lead.nome2 = null;
   //   this.lead.idade2 = null;
      this.lead.telefone2 = null;
    //  this.lead.nif2 = null;
      this.lead.relacaofamiliar = null;
      this.lead.tipocontrato2 = null;
   //   this.lead.vencimento2 = null;
  //   this.lead.anoinicio2 = null;

    }
  }

  saveFormInfo(form) {
    // Se estiver em modo editavel não guarda na BD
    if (this.readOnly) {
      this.route.navigate(['/form2']);
    } else {

      // console.log(form.value + '\n' + form.valid);
      if (form.valid) {
        const obj = form.value;
        this.showAlert = true;
        sessionStorage.form1 = JSON.stringify(form.value);
        // Carrega dados a partir do sessionStorage Form2
        if (sessionStorage.form2) {
          const f2 = JSON.parse(sessionStorage.form2);
          console.log(f2.valorpretendido);
          obj.valorpretendido = f2.valorpretendido;
          obj.prazopretendido = f2.prazopretendido;
          obj.prestacaopretendida = f2.prestacaopretendida;
          obj.finalidade = f2.finalidade;
          obj.outrainfo = f2.outrainfo;
          obj.tipocredito = f2.tipocredito;
        }
        this.dataService.getLeadSts().subscribe(
          (sts: any) => {
            obj.status = sts.status;
            if (obj.status < 10) {
              obj.status = 37;
            }

            this.dataService.editData('saveform/' + this.dataService.getLead(), obj).subscribe(
              (resp: any) => {
                //  console.log('Resposta do SaveForm: ' + resp);
                if (resp == 'OK') {
                  this.route.navigate(['/form2']);
                }
              }
            );
          }
        );

      } else {
        this.showAlert = true;
      }
    }
  }


}
