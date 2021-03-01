import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";


import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs";



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  adminStatus = ["Admin", "Normal User"];
  genders = ["Male", "Female"];
  isLoading = false;
  private failingStatusSub: Subscription;

  constructor( public authService: AuthService ) {}


  ngOnInit() {
    this.failingStatusSub = this.authService.getFailingListener()
    .subscribe(authData => {
      this.isLoading = false;
    });
  }


  onCreateUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
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
    this.failingStatusSub.unsubscribe();
  }
}
