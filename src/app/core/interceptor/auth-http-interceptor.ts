import { Injectable, inject } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';

export const AuthHttpInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('chamou auth interceptor.:', req.url);

  const auth = inject(AuthService);

  // Só anexar token para chamadas à API
  const isApiUrl = req.url.startsWith(environment.apiUrl);
  if (!isApiUrl) {
    return next(req);
  }

  // getAccessTokenSilently retorna Promise/Observable
  return from(auth.getAccessTokenSilently()).pipe(
    catchError((err) => {
      console.warn("Erro ao buscar token:", err);
      auth.loginWithRedirect();
      return throwError(() => err);
    }),
    switchMap(token => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};
