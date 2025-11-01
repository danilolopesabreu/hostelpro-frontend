import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Produto } from './produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private baseUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os produtos cadastrados
   */
  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  listarProdutosPorEstabelecimento(id: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/estabelecimento/${id}/maisvendidos`);
  }

  /**
   * Busca um produto específico pelo ID
   */
  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo produto
   */
  criar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  /**
   * Atualiza um produto existente
   */
  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, produto);
  }

  /**
   * Remove um produto
   */
  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
