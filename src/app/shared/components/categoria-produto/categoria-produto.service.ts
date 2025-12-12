import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CategoriaProduto } from './categoria-produto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  private baseUrl = `${environment.apiUrl}/categorias`; 

  constructor(private http: HttpClient) { }

  /**
   * Lista todas as categorias de um estabelecimento.
   * Pode opcionalmente retornar aninhadas (com subcategorias).
   */
  listarPorEstabelecimento(estabelecimentoId: number, aninhadas: boolean = true): Observable<CategoriaProduto[]> {
    const url = `${this.baseUrl}/estabelecimento/${estabelecimentoId}?aninhadas=${aninhadas}`;
    return this.http.get<CategoriaProduto[]>(url);
  }

  /**
   * Busca uma categoria específica por ID.
   */
  buscarPorId(id: number): Observable<CategoriaProduto> {
    return this.http.get<CategoriaProduto>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova categoria.
   */
  criar(categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.post<CategoriaProduto>(this.baseUrl, categoria);
  }

  /**
   * Atualiza uma categoria existente.
   */
  atualizar(id: number, categoria: CategoriaProduto): Observable<CategoriaProduto> {
    return this.http.put<CategoriaProduto>(`${this.baseUrl}/${id}`, categoria);
  }

  /**
   * Exclui uma categoria.
   */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Lista apenas as categorias "pai" (sem categoriaPai).
   */
  listarCategoriasPrincipais(estabelecimentoId: number): Observable<CategoriaProduto[]> {
    const url = `${this.baseUrl}/estabelecimento/${estabelecimentoId}/principais`;
    return this.http.get<CategoriaProduto[]>(url);
  }

  listarCategoriasFolhas(estabelecimentoId: number): Observable<CategoriaProduto[]> {
    const url = `${this.baseUrl}/estabelecimento/${estabelecimentoId}/folhas`;
    return this.http.get<CategoriaProduto[]>(url);
  }  

  /**
   * Lista as subcategorias de uma categoria específica.
   */
  listarSubcategorias(categoriaPaiId: number): Observable<CategoriaProduto[]> {
    const url = `${this.baseUrl}/${categoriaPaiId}/subcategorias`;
    return this.http.get<CategoriaProduto[]>(url);
  }
}
