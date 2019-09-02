import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Your Favorite Book Sharing Application';

  constructor(private _authService: AuthService) { }

  userLoggedIn() {
    return this._authService.loggedIn();
  }

  logout() {
    this._authService.logoutUser();
  }
}
