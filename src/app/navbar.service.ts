import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  nome = '';
  constructor() { }

  private navState = new Subject();
  navstate$ = this.navState.asObservable();

  setNavState(state: any) {
    this.navState.next(state);
  }

}

