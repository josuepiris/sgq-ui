import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { Departamento } from 'app/core/model';
import { environment } from 'environments/environment';

// TODO: Implementar a classe "DepartamentoFiltro" no arquivo "model.ts".
export class DepartamentoFiltro {
  codigo: string;
  nome: string;
  processoPadrao: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable()
export class DepartamentosService {

  departamentosUrl: string;

  constructor(private http: HttpClient) {
    this.departamentosUrl = `${environment.apiUrl}/departamentos`;
  }

  listarTodos(): Promise<any> {
    return this.http.get(`${this.departamentosUrl}?listarTodos`)
      .toPromise();
  }

  listarAtivos(): Promise<any> {
    return this.http.get(`${this.departamentosUrl}?listarAtivos`)
      .toPromise();
  }

  pesquisar(filtro: DepartamentoFiltro): Promise<any> {

    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.codigo) {

      params = params.append('codigo', filtro.codigo);

    } else {

      if (filtro.nome) {
        params = params.append('nome', filtro.nome);
      }

    }

    return this.http.get<any>(`${this.departamentosUrl}`, { params })
      .toPromise()
      .then(response => {
        const departamentos = response.content;

        const resultado = {
          departamentos,
          total: response.totalElements
        };

        return resultado;
      })

  }

  buscarPeloCodigo(codigo: number): Promise<Departamento> {
    return this.http.get<Departamento>(`${this.departamentosUrl}/${codigo}`)
      .toPromise();
  }

  adicionar(departamento: Departamento): Promise<Departamento> {
    return this.http.post<Departamento>(this.departamentosUrl, departamento)
      .toPromise();
  }

  atualizar(departamento: Departamento): Promise<Departamento> {
    return this.http.put<Departamento>(`${this.departamentosUrl}/${departamento.codigo}`, departamento)
      .toPromise();
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.departamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.departamentosUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

}
