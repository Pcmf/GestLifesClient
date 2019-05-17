import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {
  public typeField = 'password';
  constructor(private dataService: DataService, private route: Router) { }

  ngOnInit() {
  }

  toogleViewPass() {
    this.typeField ? this.typeField = '' : this.typeField = 'password';
  }
  changePass(pass) {
    this.dataService.editData('cltchg/' + +this.dataService.getLead(), {'pass': pass}).subscribe(
      resp => {
        console.log(resp);
        this.route.navigate(['/']);
      }
    );
  }
}
