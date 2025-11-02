import { Injectable } from '@angular/core';
import { Estabelecimento } from './estabelecimento.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {

  private baseUrl = `${environment.apiUrl}/estabelecimentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Estabelecimento[]> {
    return this.http.get<Estabelecimento[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Estabelecimento> {
    return this.http.get<Estabelecimento>(`${this.baseUrl}/${id}`);
  }

  criar(estabelecimento: Estabelecimento): Observable<Estabelecimento> {
    return this.http.post<Estabelecimento>(this.baseUrl, estabelecimento);
  }

  atualizar(id: number, estabelecimento: Estabelecimento): Observable<Estabelecimento> {
    return this.http.put<Estabelecimento>(`${this.baseUrl}/${id}`, estabelecimento);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}