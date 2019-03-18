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
export class LoginComponent  {
  logErro: boolean;
  state: any;
  public typeField = 'password';
  private helper = new JwtHelperService();
  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private loginService: DataService ) {

   this.logErro = false;

    this.navbarService.navstate$.subscribe(
      (state: any) => this.state = state);
  }

  login (credenciais) {
    this.loginService.checkuser(credenciais)
      .subscribe(
        (response: any) => {
            if ( response ) {
              this.logErro = false;
              this.router.navigate(['/']);
            } else {
              console.log('Não faz login');
              this.logErro = true;
            }
          }
        );
  }

  logout() {
    sessionStorage.removeItem('token');
  }

  isLoggedIn() {
      const helper = new JwtHelperService;
      const token = sessionStorage.getItem('token');
      const decToken = helper.decodeToken(token);

      if ( helper.decodeToken(token) ) {
       // console.log(decToken.iss);
        return true;
      }
       return false;
  }

  toogleViewPass () {
    this.typeField === 'password' ? this.typeField = 'text' : this.typeField = 'password';
  }

}

