import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; // Service pour communiquer avec l’API Task
import { Task } from '../../models/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Tableau où on stockera les tâches récupérées depuis le back
  tasks: Task[] = [];
  //gestion des filtres
  meta = { page: 1, limit: 3, total: 0, pages: 0 };
  //filter = { sort: 'createdAt', direction: 'DESC', status: '', q: '' };
  filter: {
    sort: string;
    direction: 'ASC' | 'DESC';
    status: string;
    q: string;
  } = {
    sort: 'createdAt',
    direction: 'DESC',
    status: '',
    q: ''
  };

  /**
   * Injection du TaskService et du Router.
   * - svc (service) : pour appeler getTasks(), deleteTask(), etc.
   * - router : pour naviguer vers de nouvelles pages (création, édition, lecture)
   */
  constructor(private svc: TaskService, private router: Router) {}

  /**
   * Méthode du cycle de vie Angular, appelée après le constructeur.
   * On y déclenche le chargement initial de la liste de tâches.
   */
  ngOnInit(): void {
    this.load();
  }

   /**
   * Charge la liste des tâches depuis l’API.
   * Subscribe() pour traiter la réponse asynchrone.
   */
  load(page: number = this.meta.page): void {
    this.svc.getTasks({ page, limit: this.meta.limit, ...this.filter })
      .subscribe(({ data, meta }) => {
        this.tasks = data;
        this.meta = meta;
      });
    }

  /** Méthode pour naviguer vers la création d’une nouvelle tâche 
   *
   * Navigue vers la page de création d’une nouvelle tâche.
   * Route configurée dans app-routing.module.ts : '/tasks/new'
   */
  newTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  read(id: number): void {
    this.router.navigate(['/tasks/read', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  /**
   * Supprime la tâche via l’API, puis recharge la liste.
   * On re-appelle load() pour mettre à jour l’interface.
   */
  delete(id: number): void {
    this.svc.deleteTask(id).subscribe(() => this.load());
    
  }
}