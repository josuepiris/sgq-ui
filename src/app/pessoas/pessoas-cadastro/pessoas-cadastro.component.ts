import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { MenuItem, MessageService } from 'primeng/api';

import { Pessoa } from '../../core/model';
import { PessoasService } from '../pessoas.service';
import { DepartamentosService } from '../../departamentos/departamentos.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  formulario: FormGroup;

  funcionario = new Pessoa();
  dropdownDepartamentos = [];

  loginAtivo = false;
  confirmacaoSenha: string;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private pessoasService: PessoasService,
    private departamentosService: DepartamentosService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {

    this.title.setTitle('SGQ - Cadastro de Funcionário');

    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.configurarFormulario();
    this.carregarDepartamentos();

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Funcionários', routerLink: '/funcionarios', icon: 'pi pi-external-link' },
      { label: !this.editando ? 'Novo Funcionário' : 'Edição de Funcionário' }
    ]

    this.home = { routerLink: '/home', icon: 'pi pi-home' };

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
      this.breadcrumbItems.push({ label: codigoPessoa })
    }

  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      ativo: true,
      funcionarioId: [ null, this.validarObrigatoriedade ],
      nome: [ null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ] ],
      departamento: this.formBuilder.group({
        codigo: [ null, Validators.required ]
      }),
      userId: [],
      senha: []
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
      // se o campo estiver vazio ou o tamanho for menor/igual
      // ao passado no parâmetro, retorna null (nenhuma validação pendente);
      return (!input.value || input.value.length <= valor) ? null : { tamanhoMaximo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.route.snapshot.params['codigo']);
  }

  carregarPessoa(funcionarioId: number) {
    this.pessoasService.buscarPorCodigo(funcionarioId)
      .then(retorno => {
        this.funcionario = retorno;

        if (this.funcionario.userId) {
          this.loginAtivo = true;
          this.funcionario.senha = null;
        }

        this.formulario.patchValue(this.funcionario);
        this.formulario.get('funcionarioId').disable();
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {

    this.funcionario = this.formulario.getRawValue();

    if (this.funcionario.userId) {

      if (!this.loginAtivo && !this.funcionario.senha) {
        this.errorHandler.handle('Por favor, informe a Senha!'); return;
      }

      if (this.funcionario.senha) {
        if (!this.confirmacaoSenha) {
          this.errorHandler.handle('Por favor, confirme a Senha!'); return;
        } else if (this.confirmacaoSenha !== this.funcionario.senha) {
          this.errorHandler.handle('As senhas digitadas não correspondem!'); return;
        }
      }

    } else {

      this.funcionario.userId = null;
      this.funcionario.senha = null;

    }

    if (this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }

  }

  adicionarPessoa() {
    this.pessoasService.adicionar(this.funcionario)
      .then(funcionarioAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Registro adicionado com sucesso!' });
        this.router.navigate(['/funcionarios', funcionarioAdicionado.funcionarioId]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa() {
    this.pessoasService.atualizar(this.funcionario)
      .then(registro => {
        this.messageService.add({ severity: 'success', detail: 'Registro alterado com sucesso!' });
        this.formulario.patchValue(registro);
        this.formulario.get('senha').setValue(null);
        this.confirmacaoSenha = null;
        this.loginAtivo = Boolean(this.funcionario.userId);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova() {
    if (!this.editando) {
      this.formulario.reset();
      this.configurarFormulario();
      this.confirmacaoSenha = null;
    } else {
      this.router.navigate(['/funcionarios/novo']);
    }
  }

  carregarDepartamentos() {
    this.departamentosService.listarTodos()
      .then(retornoRequisicao => {
        if (!this.editando) {
          // Carregar somente departamentos ativos quando estiver editando
          retornoRequisicao = retornoRequisicao.filter(dpto => dpto.ativo);
        }
        this.dropdownDepartamentos = retornoRequisicao
          .map(dpto => ({ label: dpto.nome, value: dpto.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`SGQ - Edição de Funcionário: ${this.route.snapshot.params['codigo']}`);
  }

  irParaGenrenciamentoPermissoes() {
    const path = '/funcionarios/' + this.funcionario.funcionarioId + '/permissoes'
    this.router.navigate([path]);
  }

}
