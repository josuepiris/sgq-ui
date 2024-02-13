import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService, MenuItem } from 'primeng/api';

import { Pessoa, Permissao } from 'app/core/model';
import { PessoasService } from '../pessoas.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-usuarios-permissoes',
  templateUrl: './usuarios-permissoes.component.html',
  styleUrls: ['./usuarios-permissoes.component.css']
})
export class UsuariosPermissoesComponent implements OnInit {

    home: MenuItem;
	breadcrumbItems: MenuItem[];

    permissoes: Permissao[] = [];

    funcionario: Pessoa = new Pessoa();
    permissoesUsuario: Permissao[] = [];

    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private pessoasService: PessoasService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
    ) { }

    ngOnInit() {

        const codigoUsuario = this.route.snapshot.params['codigo']

        this.carregarPessoa(codigoUsuario);
        this.carregarListaPermissoesNaoAtribuidas();

        this.breadcrumbItems = [
            { label: 'Cadastros' },
            { label: 'Funcionários', routerLink: '/funcionarios', icon: 'pi pi-external-link' },
            { label: 'Edição de Funcionário' },
            { label: codigoUsuario },
            { label: 'Permissões' }
          ]

          this.home = { routerLink: '/home', icon: 'pi pi-home' };

    }

    carregarPessoa(funcionarioId: number) {
        this.pessoasService.buscarPorCodigo(funcionarioId)
        .then(retorno => {
            this.funcionario = retorno;
            retorno.permissao.forEach(p => {
                this.permissoesUsuario.push(p);
            })
            this.atualizarTituloEdicao();
        })
        .catch(erro => this.errorHandler.handle(erro));
    }

    carregarListaPermissoesNaoAtribuidas() {
        // Lista de permissões do Sistema
        this.pessoasService.buscarListaPermissoes()
        .then(retorno => {
            retorno.forEach(p => {
                if (!this.permissoesUsuario.some(permissaoUsuario => permissaoUsuario.codigo === p.codigo)) {
                    this.permissoes.push(p);
                }
            })
        })
        .catch(erro => this.errorHandler.handle(erro));
    }

    salvar() {
        this.pessoasService.atualizarListaPermissoes(this.funcionario.funcionarioId, this.permissoesUsuario)
        .then(() => {
            this.messageService.add({ severity: 'success', detail: 'Salvo com sucesso!' });
        })
        .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarTituloEdicao() {
        this.title.setTitle(`SGQ - Gerenciamento de Permissões (ID Usuário: ${this.route.snapshot.params['codigo']})`);
    }

}
