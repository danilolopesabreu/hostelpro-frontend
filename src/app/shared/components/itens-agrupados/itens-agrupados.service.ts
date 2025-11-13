import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ItensAgrupados } from '@shared/modelos/itens-agrupados.model';


@Injectable({
  providedIn: 'root'
})
export class ItensAgrupadosService {

  private baseUrl = `${environment.apiUrl}/itens-agrupados`;

  constructor(private http: HttpClient) {}

  listarPorEstabelecimento(estabelecimentoId: number | any): Observable<ItensAgrupados[]> {
    return this.http.get<ItensAgrupados[]>(`${this.baseUrl}/estabelecimento/${estabelecimentoId}`);
  }

  criar(itensAgrupados: ItensAgrupados): Observable<ItensAgrupados> {
    return this.http.post<ItensAgrupados>(this.baseUrl, itensAgrupados);
  }

  criarLista(itensAgrupados: ItensAgrupados[]): Observable<ItensAgrupados[]> {
    return this.http.post<ItensAgrupados[]>(`${this.baseUrl}/lista`, itensAgrupados);
  }

  atualizar(id: number, itensAgrupados: ItensAgrupados): Observable<ItensAgrupados> {
    return this.http.put<ItensAgrupados>(`${this.baseUrl}/${id}`, itensAgrupados);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  consultarPorId(id: number): Observable<ItensAgrupados> {
    return this.http.get<ItensAgrupados>(`${this.baseUrl}/${id}`);
  }
}
