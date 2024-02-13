import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

import { Pessoa, Permissao } from '../core/model';
import { environment } from '../../environments/environment';

// TODO: Implementar classe "PessoaFiltro" no arquivo "model.ts".
export class PessoaFiltro {
  codigo: string;
  nome: string;
  departamento: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable()
export class PessoasService {

  usuariosUrl: string;
  pessoasUrl: string;
  permissoesUrl: string;

  constructor(private http: HttpClient) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
    this.pessoasUrl = `${environment.apiUrl}/funcionarios`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {

    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.codigo) {

      params = params.append('codigo', filtro.codigo);

    } else {

      if (filtro.departamento) {
        params = params.append('departamento', filtro.departamento);
      }

      if (filtro.nome) {
        params = params.append('nome', filtro.nome);
      }

    }

    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
        const pessoas = response.content;

        const resultado = {
          pessoas,
          total: response.totalElements
        };

        return resultado;
      })
  }

  pesquisarPessoas(codigoDepartamento): Promise<Pessoa[]> {
    const params = new HttpParams()
      .append('departamento', codigoDepartamento);

    return this.http.get<Pessoa[]>(this.pessoasUrl, {
      params
    }).toPromise();
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(`${this.pessoasUrl}?todos`)
      .toPromise();
  }

  listarAtivos(): Promise<any> {
    return this.http.get<any>(`${this.pessoasUrl}?ativos`)
      .toPromise();
  }

  listarUsuariosAtivos(): Promise<any> {
    return this.http.get<any>(`${this.usuariosUrl}?ativos`)
      .toPromise();
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.funcionarioId}`, pessoa)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
      .toPromise();
  }

  buscarListaPermissoes(): Promise<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.pessoasUrl}/permissoes`)
      .toPromise();
  }

  atualizarListaPermissoes(funcionarioId: number, permissoes: Permissao[]): Promise<Permissao[]> {
    return this.http.put<Permissao[]>(`${this.pessoasUrl}/${funcionarioId}/permissoes`, permissoes)
      .toPromise();
  }

}
