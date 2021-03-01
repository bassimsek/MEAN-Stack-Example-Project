import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { PageEvent, MatSort, MatTableDataSource } from "@angular/material";
import { Subscription } from "rxjs";



import { AdminService } from "../admin.service";
import { AuthService } from "../../auth/auth.service";
import { UserDetails } from "../user-details.model";



@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css'],
})
export class ShowUsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'surname', 'email', 'birthdate', 'gender', 'isAdmin', 'actions'];

  isLoading = false;
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  users: UserDetails[] = [];
  dataSource;
  userIsAuthenticated = false;
  private usersSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;



  constructor(
    public adminService: AdminService,
    private authService: AuthService
  ) {}



  ngOnInit() {
    this.isLoading = true;
    this.adminService.getUsers(this.usersPerPage, this.currentPage);
    this.usersSub = this.adminService.getUsersUpdateListener()
    .subscribe((userData: {users: UserDetails[], userCount: number}) => {
      this.totalUsers = userData.userCount;
      this.users = userData.users;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getisAuth();
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.userIsAuthenticated = authData.isAuth;
    });
  }


  onDelete(userMail: string) {
    this.isLoading = true;
    this.adminService.deleteUser(userMail)
    .subscribe(() => {
      this.adminService.getUsers(this.usersPerPage, this.currentPage);
      window.alert("User is deleted succesfully!");
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;  // pageindex 0'dan basladıgı icin 1 ekledik
    this.usersPerPage = pageData.pageSize;
    this.adminService.getUsers(this.usersPerPage, this.currentPage);
  }


  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
