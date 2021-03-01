import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";


import { AuthService } from "../auth.service";



@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor( public authService: AuthService ) {}


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(
      form.value.email,
      form.value.password);
    form.resetForm();
  }


  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
