import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quarto } from './quarto.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class QuartoService {
  
  private baseUrl = `${environment.apiUrl}/quartos`;

  constructor(private http: HttpClient) { }

  /** Lista todos os quartos de um estabelecimento */
  listarPorEstabelecimento(estabelecimentoId: number): Observable<Quarto[]> {
    return this.http.get<Quarto[]>(`${this.baseUrl}/estabelecimento/${estabelecimentoId}`);
  }

  /** Busca um quarto pelo ID */
  buscarPorId(id: number): Observable<Quarto> {
    return this.http.get<Quarto>(`${this.baseUrl}/${id}`);
  }

  /** Cria um novo quarto */
  criar(quarto: Quarto): Observable<Quarto> {
    return this.http.post<Quarto>(this.baseUrl, quarto);
  }

  /** Atualiza um quarto existente */
  atualizar(id: number, quarto: Quarto): Observable<Quarto> {
    return this.http.put<Quarto>(`${this.baseUrl}/${id}`, quarto);
  }

  /** Exclui um quarto */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
