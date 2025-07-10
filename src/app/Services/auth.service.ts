import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { baseApiURL } from '../Core/Constants/constant';
import { LoginResponse } from '../Models/login-response';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${baseApiURL}Auth`;

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return !!this.isAuthenticated();
  }

  authUser(userName:any,password:any): void {
    this.http.get<LoginResponse>(`${this.apiUrl}?userName=${userName}&password=${password}`).subscribe(
      (data: LoginResponse) => {
        if (data.isAuthenticated) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('authorizationdata', data.token);
            localStorage.setItem('userdata', JSON.stringify(data.user));
            // this.router.navigate(['/admin-dashboard'])
              this.router.navigate(['/list-members']);
          }
        }
      },
      (error) => {
        console.error('Authentication failed', error);
      }
    );
  }

  // authUser(credentials: User): Observable<boolean> {
  //   if (credentials.email === 'example@example.com' && credentials.password === 'password') {
  //     return of(true);
  //   } else {
  //     return of(false);
  //   }
  // }
  isAuthenticated(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('authorizationdata');
    }
    return null;
  }

  getUserData(): User {
    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('userdata');
      if (userData) {
        const user: User = JSON.parse(userData);
        return user;
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authorizationdata');
      localStorage.removeItem('userdata');
      this.router.navigate(['/login']);
    }
  }
}

