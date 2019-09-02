import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public validationErrors = [];
  public userAuthData = {};

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this.validationErrors = this._auth.validateAuthInfo(this.userAuthData);
    if (this.validationErrors.length) {
      return;
    }

    this._auth.loginUser(this.userAuthData)
      .subscribe(
        res => {
          console.log(res);
          if (res.token) {
            localStorage.setItem('token', res.token);
            this._router.navigate(['/dashboard']);
          }
        },
        err => console.log(err));
  }

}
