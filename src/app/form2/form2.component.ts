import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.css']
})
export class Form2Component implements OnInit {
  public tpc = 'CP';
  public form2: any = [];
  public showAlert = false;
  public readOnly = false;

  constructor(private dataService: DataService, private route: Router) {
    if (sessionStorage.getItem('form2')) {
      this.form2 = JSON.parse(sessionStorage.getItem('form2'));
    }
    this.readOnly = this.dataService.isReadOnly();
  }

  ngOnInit() {
  }
  selectTipoCredito(tipo) {
    this.tpc = tipo;
  }

  saveCredito(form) {
    if (this.readOnly) {
      this.route.navigate(['/docs/']);
    } else {
      if (form.valid) {
        this.showAlert = false;
        sessionStorage.form2 = JSON.stringify(form.value);
        this.dataService.editData('upform/' + this.dataService.getLead(), form.value).subscribe(
          (resp: any) => {
            //  console.log('Resposta do Update Form: ' + resp);
            if (resp == 'OK') {
              this.route.navigate(['/docs/']);
            }
          }
        );
      } else {
        this.showAlert = true;
      }
    }
  }
}
