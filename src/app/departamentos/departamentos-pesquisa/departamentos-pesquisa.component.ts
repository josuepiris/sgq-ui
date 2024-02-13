import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MenuItem, ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';

import { DepartamentoFiltro, DepartamentosService } from '../departamentos.service';

import { AuthService } from 'app/seguranca/auth.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-departamentos-pesquisa',
  templateUrl: './departamentos-pesquisa.component.html',
  styleUrls: ['./departamentos-pesquisa.component.css']
})
export class DepartamentosPesquisaComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  filtro = new DepartamentoFiltro();

  departamentos = [];
  totalRegistros = 0;

  @ViewChild('tabela', { static: true }) grid;

  constructor(
    public auth: AuthService,
    private title: Title,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private departamentosService: DepartamentosService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {

    this.title.setTitle('SGQ - Consulta de Departamentos');

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Departamentos' }
    ]

    this.home = { routerLink: '/home', icon: 'pi pi-home' };

  }

  pesquisar(pagina = 0) {

    this.filtro.pagina = pagina;

    if (this.filtro.pagina === 0) {
      this.grid.first = 0;
    }

    this.departamentosService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.departamentos = resultado.departamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(dpto: any) {

    const mensagem = `
      Excluir o seguinte registro do cadastro de Departamentos?!
      <br><hr>
      <table>
        <tr>
          <td style='text-align: right; padding-left: 33px; font-weight: bold'>Cód.:</td>
          <td>${dpto.codigo}</td>
        </tr>
        <tr>
          <td style='text-align: right; padding-left: 33px; font-weight: bold'>Nome:</td>
          <td>${dpto.nome}</td>
        </tr>
      </table>
    `

    this.confirmationService.confirm({
      header: 'Confirmar Exclusão',
      message: 'Confirma a exclusão do registro do cadastro de Departamentos?!',
      accept: () => {
        this.excluir(dpto);
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

  excluir(dpto: any) {
    this.departamentosService.excluir(dpto.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Departamento excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(departamento: any): void {
    const novoStatus = !departamento.ativo;

    this.departamentosService.mudarStatus(departamento.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativado' : 'desativado';

        departamento.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Departamento ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
