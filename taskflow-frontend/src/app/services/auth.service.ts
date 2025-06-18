import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';

  /** Enregistre le token JWT en localStorage */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Récupère le token JWT ou null si absent */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Supprime le token (déconnexion) */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Indique si l’utilisateur est authentifié */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
