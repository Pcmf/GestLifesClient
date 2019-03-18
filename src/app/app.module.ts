import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DocsComponent } from './docs/docs.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuardService } from './auth-guard.service';
import { DataService } from './data.service';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DocsComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'main' , component: MainComponent, canActivate: [AuthGuardService]},
      {path: 'login' , component: LoginComponent },
      {path: 'docs' , component: DocsComponent, canActivate: [AuthGuardService]},
      {path: '**', component: MainComponent, canActivate: [AuthGuardService]}
    ])
  ],
  providers: [DataService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
