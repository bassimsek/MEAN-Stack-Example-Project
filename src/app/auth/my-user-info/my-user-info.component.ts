import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";


import { AuthService } from "../auth.service";
import { User } from "../user.model";



@Component({
  templateUrl: './my-user-info.component.html',
  styleUrls: ['./my-user-info.component.css']
})
export class MyUserInfoComponent implements OnInit, OnDestroy {

  currentUser: User = {
    name: '',
    surname: '',
    email: '',
    password: '',
    birthdate: '',
    gender: '',
    isAdmin: ''
  };
  isLoading = false;
  userIsAuthenticated = false;
  userMail: string;
  private authStatusSub: Subscription;
  private userInfoSub: Subscription;


  constructor( private authService: AuthService ) {}




  ngOnInit() {
    this.isLoading = true;
    this.userMail = this.authService.getUserMail();
    this.authService.getUser(this.userMail);
    this.userIsAuthenticated = this.authService.getisAuth();
    this.userInfoSub = this.authService.getUserListener()
    .subscribe(nowUser => {
      this.isLoading = false;
      this.currentUser = nowUser;
    });
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe((authData: {isAuth: boolean, currMail: string}) => {
      this.userIsAuthenticated = authData.isAuth;
      this.userMail = authData.currMail;
    });
  }


  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.userInfoSub.unsubscribe();
  }


}
