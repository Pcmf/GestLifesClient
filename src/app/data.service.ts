import { Injectable, Input } from '@angular/core';
import { Http } from '@angular/http';
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

  constructor(private http: Http, private navbarService: NavbarService) { }

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
    sessionStorage.removeItem('token');
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

  getLead () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).lead;
  }

  getName () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).nome;
  }

  getEmail () {
    const helper = new JwtHelperService;
    return helper.decodeToken(sessionStorage.getItem('token')).email;
  }
}


