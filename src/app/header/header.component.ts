import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import { User } from '../auth/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  isAdmin: boolean;
  private authListenerSubs: Subscription;

  constructor( private authService: AuthService ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getisAuth();
    this.isAdmin = this.authService.getadminStatus();
    this.authListenerSubs = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.userIsAuthenticated = authData.isAuth;
      this.isAdmin = this.authService.getadminStatus();
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }


  onLogout() {
    this.authService.logout();
  }


}
