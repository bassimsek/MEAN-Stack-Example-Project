import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";


import { AuthService } from "../auth.service";



@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  adminStatus = ["Admin", "Normal User"];
  genders = ["Male", "Female"];
  isLoading = false;
  private authStatusSub: Subscription;


  constructor( public authService: AuthService ) {}


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.signUpUser(
      form.value.name,
      form.value.surname,
      form.value.email,
      form.value.password,
      form.value.birthdate,
      form.value.gender,
      form.value.isAdmin);
      form.resetForm();
  }


  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
