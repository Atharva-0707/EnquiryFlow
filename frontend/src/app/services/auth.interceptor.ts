import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Angular HTTP Interceptor that attaches the Bearer JWT token to API requests
 * and handles 401 Unauthorized responses.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let authReq = req;

  // Automatically attach Bearer token to API calls
  if (token && req.url.includes('/api')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isNonCriticalRoute =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/dashboard/stats') ||
        req.url.includes('/categories') ||
        req.url.includes('/statuses') ||
        req.url.includes('/health');

      if (error.status === 401 && !isNonCriticalRoute) {
        console.warn('🔒 [Auth Interceptor] 401 Unauthorized detected on protected route, redirecting to login...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
