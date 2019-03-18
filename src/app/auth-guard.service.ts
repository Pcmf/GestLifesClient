import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private loginService: DataService,
    private router: Router) { }

canActivate () {
  if (this.loginService.isLoggedIn() ) {
    return true;
  }
  this.router.navigate(['/login']);
  return false;
}
}
