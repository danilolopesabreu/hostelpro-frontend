import { Injectable } from '@angular/core';
import { Estabelecimento } from './estabelecimento.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { TipoEstabelecimento } from './tipo-estabelecimento.model';

@Injectable({
  providedIn: 'root'
})
export class TipoEstabelecimentoService {

  private baseUrl = `${environment.apiUrl}/tipos-estabelecimento`;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoEstabelecimento[]> {
    return this.http.get<TipoEstabelecimento[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<TipoEstabelecimento> {
    return this.http.get<TipoEstabelecimento>(`${this.baseUrl}/${id}`);
  }

  criar(estabelecimento: TipoEstabelecimento): Observable<TipoEstabelecimento> {
    return this.http.post<TipoEstabelecimento>(this.baseUrl, estabelecimento);
  }

  atualizar(id: number, estabelecimento: TipoEstabelecimento): Observable<TipoEstabelecimento> {
    return this.http.put<TipoEstabelecimento>(`${this.baseUrl}/${id}`, estabelecimento);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}