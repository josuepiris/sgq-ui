import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

import { DepartamentosPesquisaComponent } from './departamentos-pesquisa/departamentos-pesquisa.component';
import { DepartamentosCadastroComponent } from './departamentos-cadastro/departamentos-cadastro.component';

import { SharedModule } from 'app/shared/shared.module';
import { DepartamentosRoutingModule } from './departamentos-routing.module';

@NgModule({
  declarations: [
    DepartamentosPesquisaComponent,
    DepartamentosCadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CheckboxModule,
    TooltipModule,
    DropdownModule,
    BreadcrumbModule,
    InputTextareaModule,
    FieldsetModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,

    SharedModule,
    DepartamentosRoutingModule
  ]
})
export class DepartamentosModule { }
