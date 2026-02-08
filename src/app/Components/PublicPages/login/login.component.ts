import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { User } from '../../../Models/user';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isUser = signal(false);
  isServer = false;
  loginForm!: FormGroup;

  email: FormControl = new FormControl('', [Validators.required, Validators.email])
  password: FormControl = new FormControl('', [Validators.required])
  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
    if (this.authService.isAuthenticated()) {
      this.isUser.set(true);
      this.router.navigate(['/list-members']);
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authService.authUser(this.email.value, this.password.value)
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

  reset(): void {
    this.loginForm.reset()
  }
}
