import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Regroupement des imports HTTP
import { environment } from '../../environments/environment';
import { Task } from '../models/task';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // URL de base de l’API, définie dans environment.ts
  private base = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère une liste de tâches avec options de pagination, tri et filtre.
   * @param options page, limit, sort, direction, status, recherche textuelle q
   */
  getTasks(options?: {
    page?: number;
    limit?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
    status?: string;
    q?: string;
  }): Observable<{ data: Task[]; meta: any }> {
    let params = new HttpParams();
    // On convertit chaque option non nulle en paramètre de requête
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value != null) {
          params = params.set(key, String(value));
        }
      });
    }
    // Typage <{data: Task[]; meta: any}> pour recevoir l’objet { data, meta } du back
    return this.http.get<{ data: Task[]; meta: any }>(this.base, { params });
  }

  /**
   * Récupère une tâche unique par son ID
   * @param id Identifiant de la tâche
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.base}/${id}`);
  }

  /**
   * Crée une nouvelle tâche.
   * @param task Objet partiel Task contenant title, description, status…
   */
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.base, task);
  }

  /**
   * Met à jour une tâche existante.
   * @param id Identifiant de la tâche
   * @param updates Partial<Task> des champs à modifier
   */
  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.base}/${id}`, updates);
  }

  /**
   * Supprime une tâche.
   * @param id Identifiant de la tâche
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
