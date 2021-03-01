import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";


import { AuthService } from "../../auth/auth.service";
import { AdminService } from "../admin.service";
import { User } from "../../auth/user.model";




@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  adminStatus = ["Admin", "Normal User"];
  genders = ["Male", "Female"];
  isLoading = false;
  form: FormGroup;
  userMail: string;
  userId: string;
  currentUser: User;
  private userInfoSub: Subscription;


  constructor(
    public adminService: AdminService,
    public authService: AuthService,
    public route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      surname: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null),
      birthdate: new FormControl(null, {
        validators: [Validators.required]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required]
      }),
      isAdmin: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userMail')) {
        this.userMail = paramMap.get('userMail');
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.authService.getUser(this.userMail);
        this.userInfoSub = this.authService.getUserListener()
        .subscribe(userData => {
          this.isLoading = false;
          this.currentUser = userData;
          const date = new Date(this.currentUser.birthdate.toString()).toISOString().substring(0, 10);
          this.form.setValue({
            name: this.currentUser.name,
            surname: this.currentUser.surname,
            email: this.currentUser.email,
            password: '',
            birthdate: date,
            gender: this.currentUser.gender,
            isAdmin: this.currentUser.isAdmin
          });
        });
      }
    });
  }



  onUpdateUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.adminService.updateUser(
      this.userMail,
      this.userId,
      this.form.value.name,
      this.form.value.surname,
      this.form.value.email,
      this.form.value.password,
      this.form.value.birthdate,
      this.form.value.gender,
      this.form.value.isAdmin);
    this.form.reset();
  }

  ngOnDestroy() {
    this.userInfoSub.unsubscribe();
  }

}
