import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, finalize, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  start() {
    this.loadingSubject.next(true);
  }

  stop() {
    this.loadingSubject.next(false);
  }

  /**
   * Executa múltiplas requisições em paralelo mostrando o overlay até todas terminarem
   * @param obs pode ser um array de Observables ou um objeto com Observables
   */

  /**
   * Executa múltiplas requisições em paralelo mostrando o overlay até todas terminarem
   * @param obs Pode ser um array ou um objeto com Observables
   */
  runWithLoading(
    obs: Record<string, Observable<any>> | Observable<any>[]
  ): Observable<any> {
    this.start();

    let fork$: Observable<any>;

    if (Array.isArray(obs)) {
      // Se for array
      fork$ = forkJoin(obs.map(o => o.pipe(catchError(err => of(null)))));
    } else {
      // Se for objeto com observables
      const mapped: Record<string, Observable<any>> = {};
      for (const key of Object.keys(obs)) {
        mapped[key] = obs[key].pipe(catchError(err => of(null)));
      }
      fork$ = forkJoin(mapped);
    }

    return fork$.pipe(
      finalize(() => this.stop())
    );
  }
}
