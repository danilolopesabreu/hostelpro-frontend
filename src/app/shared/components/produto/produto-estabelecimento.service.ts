import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ProdutoEstabelecimento } from './produto-estabelecimento.model';


@Injectable({
  providedIn: 'root'
})
export class ProdutoEstabelecimentoService {

  private baseUrl = `${environment.apiUrl}/produtos-estabelecimento`;

  constructor(private http: HttpClient) {}

  // Listar todos os produtos de um estabelecimento
  listarPorEstabelecimento(estabelecimentoId: number | any): Observable<ProdutoEstabelecimento[]> {
    return this.http.get<ProdutoEstabelecimento[]>(`${this.baseUrl}/estabelecimento/${estabelecimentoId}`);
  }

  listarProdutosMaisVendidosPorEstabelecimento(estabelecimentoId: number | any): Observable<ProdutoEstabelecimento[]> {
    return this.http.get<ProdutoEstabelecimento[]>(`${this.baseUrl}/estabelecimento/${estabelecimentoId}/maisvendidos`);
  }

  // Obter um produto por ID
  obterPorId(id: number): Observable<ProdutoEstabelecimento> {
    return this.http.get<ProdutoEstabelecimento>(`${this.baseUrl}/${id}`);
  }

  // Criar novo produto
  criar(produto: ProdutoEstabelecimento): Observable<ProdutoEstabelecimento> {
    return this.http.post<ProdutoEstabelecimento>(this.baseUrl, produto);
  }

  // Atualizar produto existente
  atualizar(produto: ProdutoEstabelecimento): Observable<ProdutoEstabelecimento> {
    return this.http.put<ProdutoEstabelecimento>(`${this.baseUrl}`, produto);
  }

  // Excluir produto
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Buscar por categoria
  listarPorCategoria(categoriaId: number): Observable<ProdutoEstabelecimento[]> {
    return this.http.get<ProdutoEstabelecimento[]>(`${this.baseUrl}/categoria/${categoriaId}`);
  }
}