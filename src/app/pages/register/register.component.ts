import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  full_name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (!this.full_name || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.api.register({
      full_name: this.full_name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed';
        this.successMessage = '';
      }
    });
  }
}
