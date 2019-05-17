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
  status: number;
  private helper = new JwtHelperService;
  public isCollapsed = true;

  constructor(private loginService: DataService, private navService: NavbarService) {

    if (sessionStorage.getItem('token') != null) {
      this.loginName = this.helper.decodeToken(sessionStorage.getItem('token')).nome;
      this.status = this.helper.decodeToken(sessionStorage.getItem('token')).sts;
    } else {
      this.navService.navstate$.subscribe((state: any) => this.loginName = state.nome);
      this.navService.navstate$.subscribe((state: any) => this.status = state.sts);
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

  redirectTo () {
            if ( this.loginService.getLoginLeadStatus() < 8)  {
                return '/intro';
            }
            return '/';
  }


}
