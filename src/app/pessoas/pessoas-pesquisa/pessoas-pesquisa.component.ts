import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MenuItem, ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';

import { PessoaFiltro, PessoasService } from '../pessoas.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  filtro = new PessoaFiltro();
  
  pessoas = [];
  totalRegistros = 0;

  @ViewChild('tabela', { static: true }) grid;

  constructor(
    private title: Title,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pessoasService: PessoasService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {

    this.title.setTitle('SGQ - Consulta de Funcionários');

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Funcionários' }
    ]

    this.home = { routerLink: '/home', icon: 'pi pi-home' };

  }

  pesquisar(pagina = 0) {

    this.filtro.pagina = pagina;

    if (this.filtro.pagina === 0) {
      this.grid.first = 0;
    }

    this.pessoasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {

    const mensagem = `
      Excluir o seguinte registro do cadastro de Funcionários?!
      <br><hr>
      <table>
        <tr>
          <td style='text-align: right; padding-left: 33px; font-weight: bold'>Cód.:</td>
          <td>${pessoa.funcionarioId}</td>
        </tr>
        <tr>
          <td style='text-align: right; padding-left: 33px; font-weight: bold'>Nome:</td>
          <td>${pessoa.nome}</td>
        </tr>
        <tr>
          <td style='text-align: right; padding-left: 33px; font-weight: bold'>Depto:</td>
          <td>${pessoa.departamento.nome}</td>
        </tr>
      </table>
    `

    this.confirmationService.confirm({
      header: 'Confirmar Exclusão',
      message: 'Confirma a exclusao do registro do cadastro de Funcionários?!',
      accept: () => {
        this.excluir(pessoa);
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', detail: 'Operação cancelada pelo usuário!' });
      }
    });

    (function obterAndCustomizarElemento(delayMilisegundos, numeroTentativas, mensagem) {

      setTimeout(() => {
        const dom = document.getElementsByClassName('ui-confirmdialog-message');
        if(!dom[0]) {
          numeroTentativas--
          obterAndCustomizarElemento(delayMilisegundos, numeroTentativas, mensagem)
        } else {
          dom[0].innerHTML = mensagem;
        }
      }, delayMilisegundos);

    })(1, 2000, mensagem)

  }

  excluir(pessoa: any) {
    this.pessoasService.excluir(pessoa.funcionarioId)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Funcionário excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoasService.mudarStatus(pessoa.funcionarioId, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        pessoa.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Funcionário ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
