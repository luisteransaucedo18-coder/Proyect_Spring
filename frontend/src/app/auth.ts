import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

interface Session {
  accessToken: string;
  username: string;
  roles: string[];
  expiresAt: number;
}

const SESSION_KEY = 'panda-catalogo.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private expired = false;
  private redirecting = false;
  private readonly current = signal<Session | null>(this.restore());
  readonly session = this.current.asReadonly();

  activeSession() {
    const session = this.current();
    if (session && session.expiresAt <= Date.now()) {
      this.expired = true;
      this.logout();
      return null;
    }
    return session;
  }

  logout() {
    this.current.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  redirectToLogin(params: Record<string, string>) {
    if (this.redirecting) return;
    this.redirecting = true;
    const query = new URLSearchParams(params);
    if (this.expired && !query.has('logout')) query.set('motivo', 'sesion');
    window.location.replace('/login?' + query.toString());
  }

  private restore(): Session | null {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const data = JSON.parse(stored);
      if (typeof data?.accessToken === 'string' && typeof data.username === 'string'
          && Number.isFinite(data.expiresAt) && Array.isArray(data.roles)
          && data.roles.every((role: unknown) => typeof role === 'string')) {
        if (data.expiresAt > Date.now()) return data;
        this.expired = true;
      }
    } catch {
      // An invalid stored session can be discarded.
    }
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export const signedIn: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  if (auth.activeSession()) return true;
  auth.redirectToLogin({ volver: state.url });
  return false;
};

export const administrator: CanActivateFn = () => inject(AuthService).activeSession()?.roles.includes('ROLE_ADMIN')
  ? true
  : inject(Router).createUrlTree(['/sin-permiso']);

export const apiAuthInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/') || request.url === '/api/auth/login') return next(request);

  const auth = inject(AuthService);
  const router = inject(Router);
  const session = auth.activeSession();
  return next(session ? request.clone({ setHeaders: { Authorization: 'Bearer ' + session.accessToken } }) : request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && auth.session() === session) {
        auth.logout();
        auth.redirectToLogin({ motivo: 'sesion', volver: router.url });
      }
      return throwError(() => error);
    }),
  );
};
