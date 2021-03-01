import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";


import { User } from "../user.model";
import { AuthService } from "../auth.service";




@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

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



  onChangePassword(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      if (form.value.oldPassword !== this.currentUser.password) {
        window.alert("Your old password is wrong!");
      } else if (form.value.oldPassword !== form.value.reOldPassword) {
        window.alert("Your old passwords doesn't match!");
      } else {
        this.isLoading = true;
        this.authService.ch_password(this.userMail, form.value.newPassword);
      }
    }
    form.resetForm();
  }


  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.userInfoSub.unsubscribe();
  }
}
