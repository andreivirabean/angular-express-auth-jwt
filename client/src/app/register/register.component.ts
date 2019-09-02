import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public validationErrors = [];
  public userAuthData = {
    email: null,
    password: null
  };

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  registerUser() {
    this.validationErrors = this._auth.validateAuthInfo(this.userAuthData);
    if (this.validationErrors.length) {
      return;
    }

    this._auth.registerUser(this.userAuthData)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this._router.navigate(['/dashboard']);
        },
        err => console.log(err)
      );
  }

}
