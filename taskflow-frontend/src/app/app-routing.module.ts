import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Page de login accessible sans être connecté
  { path: 'login', component: LoginComponent },
  // Toutes les autres routes de /tasks sont protégées
  { path: 'tasks',
      canActivate: [AuthGuard],
      children: [
        { path: '', component: TaskListComponent },
        { path: 'new', component: TaskFormComponent },
        { path: 'edit/:id', component: TaskFormComponent },
        // si tu as une vue read
        { path: 'read/:id', component: TaskFormComponent },
      ]
  },

        // Redirection par défaut
        { path: '', redirectTo: 'tasks', pathMatch: 'full' },
        { path: '**', redirectTo: 'tasks' }
      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }