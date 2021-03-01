import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";


import { UserDetails } from "./user-details.model";




@Injectable({ providedIn: "root" })
export class AdminService {

  private users: UserDetails[] = [];
  private userLogs = [];
  private usersUpdated = new Subject<{users: UserDetails[], userCount: number}>();
  private userLogsUpdated = new Subject<{userLogs: any[], userLogCount: number}>();


  constructor( private http: HttpClient, private router: Router ) {}


  getUsersUpdateListener () {
    return this.usersUpdated.asObservable();
  }

  getUserLogUpdateListener () {
    return this.userLogsUpdated.asObservable();
  }


  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, users: any, maxUsers: number }>("http://localhost:3000/api/user/show_users" + queryParams)
    .pipe(map(userData => {
      return { users: userData.users.map(user => {
        return {
          id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          birthdate: user.birthdate.toString().split("T")[0],
          gender: user.gender,
          isAdmin: user.isAdmin
        };
      }),
      maxUsers: userData.maxUsers };
    }))
    .subscribe(transformedUsersData => {
      this.users = transformedUsersData.users;
      this.usersUpdated.next({
        users: [...this.users],
        userCount: transformedUsersData.maxUsers
      });
    });
  }


  getLogs(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, userLogs: any, maxUserLogs: number }>("http://localhost:3000/api/user/show_user_logs" + queryParams)
    .pipe(map(userData => {
      return { userLogs: userData.userLogs.map(user => {
        return {
          email: user.email,
          loginTime: user.loginTime,
          logoutTime: user.logoutTime,
          browser: user.browser,
          ip: user.ip
        };
      }),
      maxUserLogs: userData.maxUserLogs };
    }))
    .subscribe(transformedUsersData => {
      this.userLogs = transformedUsersData.userLogs;
      this.userLogsUpdated.next({
        userLogs: [...this.userLogs],
        userLogCount: transformedUsersData.maxUserLogs
      });
    });
  }


  deleteUser(userMail: string) {
    return this.http.delete("http://localhost:3000/api/user/delete/" + userMail);
  }




  updateUser(
    oldMail: string,
    id: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: string,
    isAdmin: string
    ) {
      const updated_user = {
        oldMail: oldMail,
        id: id,
        name: name,
        surname: surname,
        email: email,
        password: password,
        birthdate: birthdate,
        gender: gender,
        isAdmin: isAdmin
      };
      this.http
      .put<{message: string}>("http://localhost:3000/api/user/update_user/" + id, updated_user)
      .subscribe(response => {
        window.alert("User is updated successfully!");
        this.router.navigate(['/show_users']);
      }, err => {
        this.router.navigate(['/show_users']);
      });
  }



}



