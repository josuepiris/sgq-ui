import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartamentosPesquisaComponent } from './departamentos-pesquisa/departamentos-pesquisa.component';
import { DepartamentosCadastroComponent } from './departamentos-cadastro/departamentos-cadastro.component';

import { AuthGuard } from 'app/seguranca/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DepartamentosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DEPARTAMENTO'] }
  },
  {
    path: 'novo',
    component: DepartamentosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_DEPARTAMENTO'] }
  },
  {
    path: ':codigo',
    component: DepartamentosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_DEPARTAMENTO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
