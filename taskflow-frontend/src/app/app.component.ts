import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskflow-frontend';
constructor(
    public auth: AuthService,      // public pour usage direct en template
    private router: Router,
    private route: ActivatedRoute
  ) {}

  logout(): void {
    this.auth.clearToken();        // supprime le JWT
    this.router.navigate(['/login']);
  }
}
