import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavbarService } from './navbar.service';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private helper = new JwtHelperService;
  ADDRESS = environment.ADDRESS;
  oc: any;
  submissoes: any;
  rejeicoes: any;

  constructor(private http: HttpClient, private navbarService: NavbarService) { }

  /**  */
  getData ( params) {
    return this.http.get(this.ADDRESS + params);
  }

  saveData (path: string, obj: any) {
    return this.http.post(this.ADDRESS + path, JSON.stringify(obj));
    // incluir uma forma de notificar que os dados foram inseridos ou erro
  }

  editData (path: string, obj: any) {
    return this.http.put(this.ADDRESS + path, JSON.stringify(obj));
    // incluir uma forma de notificar que os dados foram inseridos ou erro
  }

  deleteData (path: string) {
    return this.http.delete(this.ADDRESS + path );
  }

  checkuser (credenciais) {
    return this.http.post( this.ADDRESS + 'cltlogin',
        JSON.stringify(credenciais))
        .pipe(
          map((response: any) => {
           console.log(response._body);
          if ( response._body) {
              sessionStorage.setItem('token', response._body);
              this.navbarService.setNavState(this.helper.decodeToken(response._body));
              return true;
            } else {
              return false;
            }
        })

        );
  }



  logout() {
    sessionStorage.clear();
    window.location.reload();
  }

  isLoggedIn() {
      const token = sessionStorage.getItem('token');
      if ( token && this.helper.isTokenExpired(token)) {
        return true;
      } else {
        return false;
      }
  }

  changePassDB (credenciais) {
    return this.http.put( this.ADDRESS + 'change',
       JSON.stringify(credenciais))
       .pipe(
         map((response: any) => {
           if ( response._body ) {
             sessionStorage.setItem('token', response._body);
             //
             this.navbarService.setNavState(this.helper.decodeToken(response._body));
             return true;
           } else {
             return false;
           }
         })
       );
 }

  getUserId () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).id;
  }

  getLead (): number {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).lead;
  }

  getLoginLeadStatus() {
     const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).sts;
  }
  /**
   * status , datastatus
   */
  getLeadSts () {
    return this.getData('leadsts/' + this.getLead());
  }

  getName () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).nome;
  }

  getEmail () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).email;
  }

  isReadOnly () {
    const sts = this.getLoginLeadStatus();
    if ((sts == 4 || sts==8 || sts >= 10) &&  !(sts == 37 || sts == 38)) {
      return true;
    }
    return false;
  }


  /**
   *
   * @param lead Carrega os forms com o processo
   */
  loadForms(lead: number) {
    this.getData('cltcr/' + lead).subscribe(
      (resp: any) => {
        const processo = resp.lead;

        /* Outros créditos */
        if (resp.oc) {
          this.oc = resp.oc[0];
        } else {
          this.oc = {'valorcredito': null, 'prestacao': null};
        }

        const form1 = JSON.stringify({'id': processo.id, 'anoinicio': processo.anoinicio, 'anoinicio2': processo.anoinicio2,
          'anoiniciohabitacao': processo.anoiniciohabitacao, 'anoiniciohabitacao2': processo.anoiniciohabitacao2,
         'datainicio': processo.datainicio, 'datastatus': processo.datastatus, 'email': processo.email,
        'estadocivil': processo.estadocivil, 'filhos': processo.filhos, 'tipohabitacao': processo.tipohabitacao,
        'idade': processo.idade, 'idade2': processo.idade2, 'irs': processo.irs, 'nif': processo.nif,
        'nif2': processo.nif2, 'nome': processo.nome, 'nome2': processo.nome2, 'parentesco2': processo.parentesco2,
        'profissao': processo.profissao, 'profissao2': processo.profissao2, 'relacaofamiliar': processo.relacaofamiliar,
        'segundoproponente': processo.segundoproponente, 'status': processo.status, 'telefone': processo.telefone,
        'telefone2': processo.telefone2, 'tipocontrato': processo.tipocontrato, 'tipocontrato2': processo.tipocontrato2,
        'tipohabitacao2': processo.tipohabitacao2, 'valorhabitacao': processo.valorhabitacao, 'sts': processo.sts,
        'valorhabitacao2': processo.valorhabitacao2, 'vencimento': processo.vencimento, 'vencimento2': processo.vencimento2,
        'ocValor': this.oc.valorcredito, 'ocPrestacao': this.oc.prestacao });

        const form2 = JSON.stringify({'tipocredito': processo.tipocredito, 'valorpretendido': processo.valorpretendido,
         'prazopretendido': processo.prazopretendido, 'prestacaopretendida': processo.prestacaopretendida,
          'finalidade': processo.finalidade, 'outrainfo': processo.outrainfo});

         sessionStorage.form1 = form1;
         sessionStorage.form2 = form2;
         sessionStorage.responsavel = JSON.stringify({'gestor': processo.gestor, 'telefone': processo.telefonegestor,
                                        'email': processo.emailgestor, 'analista': processo.nomeanalista,
                                         'telefoneAnalista': processo.telefoneAnalista});

         /*  Submissões */
        if (resp.submissoes[0] != undefined) {
          this.submissoes = resp.submissoes[0];
        } else {
          this.submissoes = {};
        }

         /* Rejeições */
        if (resp.rejeicoes[0] != undefined) {
          this.rejeicoes = resp.rejeicoes[0];
        } else {
          this.rejeicoes = {};
        }

          sessionStorage.submissoes = JSON.stringify(this.submissoes);
          sessionStorage.rejeicoes = JSON.stringify(this.rejeicoes);
      }
    );
    return true;
  }

}


