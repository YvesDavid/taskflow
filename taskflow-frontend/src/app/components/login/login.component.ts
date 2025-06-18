import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;
  //email = 'a@a.a';
  //password = 'a';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.error = null;
    const { email, password } = this.form.value;

    this.http
      .post<{ token: string }>(
        `${environment.apiUrl}/login_check`,
        { email, password }
      )
      .subscribe({
        next: ({ token }) => {
          this.auth.setToken(token);
          this.router.navigate(['/tasks']);
        },
        error: err => {
          this.error = err.error?.message || 'Identifiants invalides';
        }
      });
  }
}
