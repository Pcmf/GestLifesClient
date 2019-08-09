import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public slideMenu = 'slide-menu-c';
  public btnMenu = 'btn-s';
  constructor() { }

  toogle2() {
    this.slideMenu === 'slide-menu-c' ? this.slideMenu = 'slide-menu-o' : this.slideMenu = 'slide-menu-c';
    this.btnMenu === 'btn-c' ? this.btnMenu = 'btn-o' : this.btnMenu = 'btn-c';

  }



}
