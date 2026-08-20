import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';

import { AuthFacade } from '../facades/auth.facade';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  // Router usado p redirecionamentos em erros de autenticação/autorização.
  const router = inject(Router);
  const token = authFacade.obterToken();

  console.log('REQUEST', req.url);
  const novaReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(novaReq).pipe(
    tap({
      next: (event) => console.log('RESPONSE:', event),
      error: (error) => console.error('ERRO:', error),
    }),
    catchError((error) => {
      console.error('ERRO GLOBAL:', error);

      // 401 -> ausência de autenticação ou token inválido.
      if (error.status === 401) {
        console.warn('Não autorizado. Faça login novamente.');
        authFacade.sair();
        router.navigateByUrl('/login');
      }

      // 403 -> usuario autenticado, mas sem permissão.
      if (error.status === 403) {
        console.warn('Acesso proibido. Perfil sem permissão.');
        router.navigateByUrl('/produtos');
      }

      // 500 -> erro interno do servidor
      if (error.status === 500) {
        console.warn('Erro interno do servidor!');
      }

      return throwError(() => error);
    }),
  );
};