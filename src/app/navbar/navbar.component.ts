import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { NavbarService } from '../navbar.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  loginName: any;
  private helper = new JwtHelperService;
  public isCollapsed = true;
  constructor(private loginService: DataService
  , private navService: NavbarService) {

    if (sessionStorage.getItem('token') != null) {
      this.loginName = this.helper.decodeToken(sessionStorage.getItem('token')).nome;
    } else {
      this.navService.navstate$.subscribe((state: any) => this.loginName = state.nome);
    }
  }

  logout () {
     this.loginService.logout();
   }

   ngOnDestroy () {
     this.logout();
   }



  isLoggedIn() {
      const token = sessionStorage.getItem('token');
      if ( token && this.helper.isTokenExpired(token)) {
        return true;
      } else {
        return false;
      }
  }
}
