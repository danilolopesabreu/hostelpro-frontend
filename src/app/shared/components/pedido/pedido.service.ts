import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Pedido } from './pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private baseUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Cria um novo pedido
   */
  criarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, pedido);
  }

  /**
   * 🔹 Busca todos os pedidos
   */
  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  /**
   * 🔹 Busca pedido por ID
   */
  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  buscarPorEstabelecimentoId(id: number | undefined): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/estabelecimento/${id}`);
  }

  /**
   * 🔹 Atualiza status do pedido (opcional)
   */
  atualizarStatus(id: number, status: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${id}/status`, { status });
  }

  /**
   * 🔹 Remove pedido (caso permitido pelo backend)
   */
  excluirPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
