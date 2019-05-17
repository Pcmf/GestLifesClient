import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NavbarService } from '../navbar.service';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public logErro = false;
  public erroEmail = false;
  public newAccess = false;
  public askNewAccess = false;
  public state: any;
  public typeField = 'password';
  public controlo: any;
  private helper = new JwtHelperService();
  public erroPass = false;
  msg: any;
  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private loginService: DataService, ) {

    this.navbarService.navstate$.subscribe(
      (state: any) => this.state = state);
  }

  login(credenciais) {
    this.erroPass = false;
    this.erroEmail = false;
    if (!this.validateEmail(credenciais.username)) {
      this.erroEmail = true;
    }
    if (!credenciais.password) {
      this.erroPass = true;
    }
    if (!this.erroEmail && !this.erroPass) {
      this.loginService.checkuser(credenciais)
        .subscribe(
          (response: any) => {
            if (response) {
              this.logErro = false;
              const sts = this.loginService.getLoginLeadStatus();
              if (sts > 7) {
                // Carregar os sessionStorage FORM1 e FORM2
                this.loadForms(this.loginService.getLead());
                // apresenta situação do processo
                this.router.navigate(['/']);
              } else {
                // introdução para o formulário para iniciar o processo
                this.getLeadInf(this.loginService.getLead());
                this.router.navigate(['/intro']);
              }
            } else {
              this.newAccess = false;
              this.askNewAccess = false;
              this.logErro = true;
            }
          }
        );
    }
  }
  getLeadInf(lead: number) {
    this.loginService.getData('lead/' + lead).subscribe(
      resp => {
        console.log(resp);
        const processo = resp.json()[0];
        const form1 = JSON.stringify({'id': processo.id, 'nome': processo.nome, 'telefone': processo.telefone,
            'email': processo.email});
            sessionStorage.form1 = form1;
      }
    );
  }
  /**
   *
   * @param lead Carrega os forms com o processo
   */
  loadForms(lead: number) {
    this.loginService.getData('processo/' + lead).subscribe(
      resp => {
        const processo = resp.json()[0].lead;

        const form1 = JSON.stringify({'id': processo.id, 'anoinicio': processo.anoinicio, 'anoinicio2': processo.anoinicio2,
          'anoiniciohabitacao': processo.anoiniciohabitacao, 'anoiniciohabitacao2': processo.anoiniciohabitacao2,
         'datainicio': processo.datainicio, 'datastatus': processo.datastatus, 'email': processo.email,
        'estadocivil': processo.estadocivil, 'filhos': processo.filhos, 'tipohabitacao': processo.tipohabitacao,
        'idade': processo.idade, 'idade2': processo.idade2, 'irs': processo.irs, 'nif': processo.nif,
        'nif2': processo.nif2, 'nome': processo.nome, 'nome2': processo.nome2, 'parentesco2': processo.parentesco2,
        'profissao': processo.profissao, 'profissao2': processo.profissao2, 'relacaofamiliar': processo.relacaofamiliar,
        'segundoproponente': processo.segundoproponente, 'status': processo.status, 'telefone': processo.telefone,
        'telefone2': processo.telefone2, 'tipocontrato': processo.tipocontrato, 'tipocontrato2': processo.tipocontrato2,
        'tipohabitacao2': processo.tipohabitacao2, 'valorhabitacao': processo.valorhabitacao,
        'valorhabitacao2': processo.valorhabitacao2, 'vencimento': processo.vencimento, 'vencimento2': processo.vencimento2 });

        const form2 = JSON.stringify({'tipocredito': processo.tipocredito, 'valorpretendido': processo.valorpretendido,
         'prazopretendido': processo.prazopretendido, 'prestacaopretendida': processo.prestacaopretendida,
          'finalidade': processo.finalidade, 'outrainfo': processo.outrainfo});

         sessionStorage.form1 = form1;
         sessionStorage.form2 = form2;

      }
    );
  }


  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('form1');
    sessionStorage.removeItem('form2');
  }

  isLoggedIn() {
    const helper = new JwtHelperService;
    const token = sessionStorage.getItem('token');

    if (helper.decodeToken(token)) {
      return true;
    }
    return false;
  }

  toogleViewPass() {
    this.typeField === 'password' ? this.typeField = 'text' : this.typeField = 'password';
  }

  forgetPass() {
    this.logErro = false;
    this.newAccess = false;
    this.askNewAccess = true;
  }

  confirmSendPass() {
    if (this.controlo && (!isNaN(this.controlo) || this.validateEmail(this.controlo))) {
      let type: string;
      const obj = { 'controlo': this.controlo };
      !isNaN(this.controlo) ? type = 'N' : type = 'E';
      this.loginService.editData('cltpass/' + type, obj).subscribe(
        (resp: any) => {
          this.newAccess = true;
          this.msg = resp._body;
        }
      );
    }
    this.askNewAccess = false;
  }





  private validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


}

