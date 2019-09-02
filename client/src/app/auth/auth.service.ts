import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {
  private _registerUrl = 'http://localhost:3000/api/register';
  private _loginUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient, private _router: Router) { }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  validateAuthInfo(authData: any) {
    const errors = [];
    if (!authData.email) {
      errors.push('Please provide a valid email address.');
    }

    if (!authData.password) {
      errors.push('Please provide a password.');
    }

    if (authData.password) {
      const passLength = authData.password.trim().length;
      if (passLength < 6 || passLength > 20) {
        errors.push('Password must be 6-20 characters long.');
      }
    }

    return errors;
  }

}
