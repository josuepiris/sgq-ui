import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MenuItem} from 'primeng/api';

import { AuthService } from './../../seguranca/auth.service';
import { LogoutService } from './../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  items: MenuItem[];

  constructor(
    public auth: AuthService,
    private router: Router,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        separator: true
      },
      {
          label: 'Cadastros',
          icon: 'pi pi-plus',
          visible: this.auth.temQualquerPermissao([
            'ROLE_CONSULTAR_FUNCIONARIO', 'ROLE_CONSULTAR_DEPARTAMENTO',
          ]),
          items: [
            {
              label: 'Funcionários',
              icon: 'pi pi-users',
              routerLink: '/funcionarios',
              visible: this.auth.temPermissao('ROLE_CONSULTAR_FUNCIONARIO')
            },
            {
              label: 'Departamentos',
              icon: 'pi pi-sitemap',
              routerLink: '/departamentos',
              visible: this.auth.temPermissao('ROLE_CONSULTAR_DEPARTAMENTO')
            }
          ]
      }
    ];
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
