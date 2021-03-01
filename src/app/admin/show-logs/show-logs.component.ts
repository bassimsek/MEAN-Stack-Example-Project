import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { PageEvent, MatSort, MatTableDataSource } from "@angular/material";
import { Subscription } from "rxjs";



import { AdminService } from "../admin.service";
import { AuthService } from "../../auth/auth.service";



@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.css'],
})
export class ShowLogsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['email', 'loginTime', 'logoutTime', 'browser', 'ip'];

  isLoading = false;
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userLogs = [];
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
    this.adminService.getLogs(this.usersPerPage, this.currentPage);
    this.usersSub = this.adminService.getUserLogUpdateListener()
    .subscribe((userLogData: {userLogs: any[], userLogCount: number}) => {
      this.totalUsers = userLogData.userLogCount;
      this.userLogs = userLogData.userLogs;
      this.dataSource = new MatTableDataSource(this.userLogs);
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getisAuth();
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.userIsAuthenticated = authData.isAuth;
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;  // pageindex 0'dan basladıgı icin 1 ekledik
    this.usersPerPage = pageData.pageSize;
    this.adminService.getLogs(this.usersPerPage, this.currentPage);
  }


  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
