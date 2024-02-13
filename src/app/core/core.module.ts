import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import localePt from '@angular/common/locales/pt';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { JwtHelperService } from '@auth0/angular-jwt';

import { DepartamentosService } from '../departamentos/departamentos.service';
import { PessoasService } from '../pessoas/pessoas.service';
import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,

    ToastModule,
    TieredMenuModule,
    ConfirmDialogModule,
  ],
  declarations: [
    NavbarComponent,
    NaoAutorizadoComponent,
    PaginaNaoEncontradaComponent
  ],
  exports: [
    ToastModule,
    NavbarComponent,
    ConfirmDialogModule
  ],
  providers: [
    Title,

    ConfirmationService,
    MessageService,
    JwtHelperService,

    AuthService,
    ErrorHandlerService,
    PessoasService,
    DepartamentosService,
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
})
export class CoreModule { }
