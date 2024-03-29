import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';

@Component({
  selector: 'app-show-comprovativo',
  templateUrl: './show-comprovativo.component.html',
  styleUrls: ['./show-comprovativo.component.css']
})
export class ShowComprovativoComponent implements OnInit {

  private lead: number;
  private linha: number;
  public fxNome: string;
  public imagePath: Url = null;
  constructor(private route: ActivatedRoute, private dataService: DataService, private _sanitizer: DomSanitizer ) {
    this.route.queryParamMap.subscribe(
      params => {
        this.lead = +params.get('lead');
        this.linha = +params.get('ln');
        this.dataService.getData('cltcomp/' + this.lead + '/' + this.linha).subscribe(
          (resp: any) => {
            const document = resp[0];
            this.fxNome = document.nomedoc;
            this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + document.documento);
          }
        );
      }
    );
   }

  ngOnInit() {
  }

}
