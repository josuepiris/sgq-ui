import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { MenuItem, MessageService } from 'primeng/api';

import { PessoasService } from 'app/pessoas/pessoas.service';
import { DepartamentosService } from '../departamentos.service';

import { AuthService } from 'app/seguranca/auth.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-departamentos-cadastro',
  templateUrl: './departamentos-cadastro.component.html',
  styleUrls: ['./departamentos-cadastro.component.css']
})
export class DepartamentosCadastroComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  dropdownProcessos = []
  dropdownFuncionarios = []

  formulario: FormGroup;

  constructor(
    public auth: AuthService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pessoasService: PessoasService,
    private departamentosService: DepartamentosService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {

    this.title.setTitle('SGQ - Cadastro de Departamentos');

    this.configurarFormulario();

    const codigoDepartamento = this.route.snapshot.params['codigo'];

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Departamentos', routerLink: '/departamentos', icon: 'pi pi-external-link' },
      { label: !this.editando ? 'Novo Departamento' : 'Edição de Departamento' }
    ]

    this.home = { routerLink: '/dashboard', icon: 'pi pi-home' };

    if (codigoDepartamento) {
      this.carregarDepartamento(codigoDepartamento);
      this.breadcrumbItems.push({ label: codigoDepartamento })
    }

    this.carregarPessoas();

  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      ativo: true,
      codigo: [{ value: null, disabled: true }],
      nome: [ null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5), this.validarTamanhoMaximo(60) ] ]
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  validarTamanhoMaximo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length <= valor) ? null : { tamanhoMaximo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.route.snapshot.params['codigo']);
  }

  carregarDepartamento(codigo: number) {
    this.departamentosService.buscarPeloCodigo(codigo)
      .then(retorno => {
        this.formulario.patchValue(retorno);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarDepartamento();
    } else {
      this.adicionarDepartamento();
    }
  }

  adicionarDepartamento() {
-   this.departamentosService.adicionar(this.formulario.value)
      .then(registro => {
        this.messageService.add({ severity: 'success', detail: 'Registro criado com sucesso!' });
        this.messageService.add({ severity: 'success', detail: 'Código do registro: ' + registro.codigo});
        this.router.navigate(['/departamentos', registro.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarDepartamento() {
    this.departamentosService.atualizar(this.formulario.getRawValue())
      .then(registro => {
        this.formulario.patchValue(registro);
        this.messageService.add({ severity: 'success', detail: 'Registro alterado com sucesso!' });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();
    this.router.navigate(['/departamentos/novo'])
  }

  carregarPessoas() {
    this.pessoasService.listarAtivos()
      .then(retornoRequisicao => {
        this.dropdownFuncionarios = retornoRequisicao
          .map(p => ({ label: p.nome, value: p.funcionarioId }))
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`SGQ - Edição de Departamento: ${this.route.snapshot.params['codigo']}`);
  }

}
