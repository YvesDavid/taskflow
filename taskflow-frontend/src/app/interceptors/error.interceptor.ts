import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.errors) {
          // Validation back-end : on peut router vers le formulaire en affichant les erreurs
          console.error('Validation errors', error.error.errors);
          return throwError(() => error.error.errors);
        }
        if (error.status === 401) {
          // non autorisé : logout ou redirection login
          this.router.navigate(['/login']);
        }
        // autres erreurs 5xx
        alert(`Erreur serveur (${error.status})`);
        return throwError(() => error);
      })
    );
  }
}
