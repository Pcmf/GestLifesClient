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
    private dataService: DataService) {

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
      this.dataService.checkuser(credenciais)
        .subscribe(
          (response: any) => {
            console.log('response: ' + response);
            if (response) {
              this.logErro = false;
              const sts = this.dataService.getLoginLeadStatus();
              if (sts == 4 || sts > 7) {
                // Carregar os sessionStorage FORM1 e FORM2
                this.dataService.loadForms(this.dataService.getLead());
                // apresenta situação do proceso
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 800);

              } else {
                // introdução para o formulário para iniciar o processo
                this.getLeadInf(this.dataService.getLead());
                setTimeout(() => {
                  this.router.navigate(['intro/']);
                }, 800);
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
    this.dataService.getData('lead/' + lead).subscribe(
      resp => {
        //      console.log(resp);
        const processo = resp[0];
        sessionStorage.form1 = JSON.stringify({
          'id': processo.id, 'nome': processo.nome, 'telefone': processo.telefone,
          'email': processo.email
        });
        // sessionStorage.form1 = form1;
        sessionStorage.form2 = JSON.stringify({ 'valorpretendido': processo.montante, 'prazopretendido': processo.prazopretendido });
      }
    );
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
      this.dataService.editData('cltpass/' + type, obj).subscribe(
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

