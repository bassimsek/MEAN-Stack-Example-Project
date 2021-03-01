import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


import { User } from "./user.model";

declare global {
  interface Document {
      documentMode?: any;
  }
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userMail: string;
  private adminStatus: boolean;
  private currUser: User;
  // burda user model olusturabilirsin front-end'den user'la ilgili spesifik daha cok bilgi alıcaksan
  private authInfosListener = new Subject<{ isAuth: boolean, currMail: string}>();
  private userListener = new Subject<User>();
  private failingListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getBrowser() {
    if ((navigator.userAgent.indexOf("Opera") !== -1 || navigator.userAgent.indexOf('OPR')) !== -1 ) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") !== -1 ) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") !== -1 ) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true )) {
      return 'IE';
    } else {
      return 'Unknown';
    }
  }

  getToken() {
    return this.token;
  }

  getisAuth() {
    return this.isAuthenticated;
  }

  getUserMail() {
    return this.userMail;
  }

  getCurrUser() {
    return this.currUser;
  }

  getadminStatus() {
    return this.adminStatus;
  }

  getAuthInfosListener() {
    return this.authInfosListener.asObservable();
  }

  getUserListener() {
    return this.userListener.asObservable();
  }

  getFailingListener() {
    return this.failingListener.asObservable();
  }

  signUpUser(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: string,
    isAdmin: string
  ) {
    this.http.get<{ ip: string; }>("http://ip4.seeip.org/json").toPromise()
    .then(responsed => {
      const time = new Date();
      const login = time.toLocaleString();
      const new_user = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        birthdate: birthdate,
        gender: gender,
        isAdmin: isAdmin,
        loginTime: login,
        browser: this.getBrowser(),
        ip: responsed.ip,
      };
      this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userMail: string;
        isAdmin: string;
      }>("http://localhost:3000/api/user/signup", new_user)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userMail = response.userMail;
          if (response.isAdmin === 'Admin') {
            this.adminStatus = true;
          } else {
            this.adminStatus = false;
          }
          this.authInfosListener.next({
            isAuth: true,
            currMail: this.userMail
          });
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userMail, this.adminStatus);
          console.log(expirationDate);
          window.alert("Your account is created succesfully!");
          this.router.navigate(["/"]);
        }
      }, error => {
        this.authInfosListener.next({
          isAuth: false,
          currMail: null
        });
      });
    });
  }


  createUser(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: Date,
    gender: string,
    isAdmin: string
  ) {
    const new_user: User = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      birthdate: birthdate,
      gender: gender,
      isAdmin: isAdmin
    };
    this.http
      .post("http://localhost:3000/api/user/create_user", new_user)
      .subscribe(response => {
        window.alert("User is created successfully!");
        this.router.navigate(["/"]);
      }, err => {
        this.failingListener.next(true);
      });
  }


  getUser(userMail: string) {
    this.http.get<{
      id: string;
      name: string;
      surname: string;
      email: string;
      password: string;
      birthdate: Date;
      gender: string;
      isAdmin: string;
    }>("http://localhost:3000/api/user/user_infos/" + userMail)
    .subscribe(responseData => {
      const new_date = responseData.birthdate.toString().split("T")[0];
      const user: User = {
        name: responseData.name,
        surname: responseData.surname,
        email: responseData.email,
        password: responseData.password,
        birthdate: new_date,
        gender: responseData.gender,
        isAdmin: responseData.isAdmin
      }; // myinfoda subscribe et
      this.currUser = user;
      this.userListener.next(user);
    });
  }


  ch_password(userMail: string, newPassword: string) {
    const sended_data = {newPassword: newPassword};
    this.http
    .put<{ message: string, token: string, user: any }>("http://localhost:3000/api/user/ch_password/" + userMail, sended_data)
    .subscribe(response => {
      this.currUser.password = newPassword;
      this.token = response.token;
      this.changeToken(this.token);
      this.userListener.next(this.currUser);
      window.alert("Password is changed successfully!");
      this.router.navigate(["/"]);
    }, err => {
      this.router.navigate(["/"]);
    });
  }



  login(
    email: string,
    password: string) {
    // const authData: AuthData = { email: email, password: password };
    this.http.get<{ ip: string; }>("http://ip4.seeip.org/json").toPromise()
    .then(responsed => {
      const time = new Date();
      const login = time.toLocaleString();
      const authData = {
        email: email,
        password: password,
        loginTime: login,
        browser: this.getBrowser(),
        ip: responsed.ip};
      this.http
      .post<{ message: string; token: string; expiresIn: number; user: any; }>(
        "http://localhost:3000/api/user/login", authData)
        .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userMail = response.user.email;
          if (response.user.isAdmin === 'Admin') {
            this.adminStatus = true;
          } else {
            this.adminStatus = false;
          }
          this.authInfosListener.next({
            isAuth: true,
            currMail: this.userMail
          });
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userMail, this.adminStatus);
          console.log(expirationDate);
          this.router.navigate(["/"]);
        }
      }, error => {
        this.authInfosListener.next({
          isAuth: false,
          currMail: null
        });
      });

    });
  }

  // page reaload'larında bilgileri serviste tutmaya yarıyor. app-component'ta herşeyden önce calıstır
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userMail = authInformation.userMail;
      if (authInformation.adminStatus === 'Admin') {
        this.adminStatus = true;
      } else {
        this.adminStatus = false;
      }
      this.setAuthTimer(expiresIn / 1000);
      this.authInfosListener.next({
        isAuth: true,
        currMail: this.userMail
      });
    }
  }

  logout() {
    const time = new Date();
    const logout = time.toLocaleString();
    const logout_info = {
      email: localStorage.getItem("userMail"),
      logoutTime: logout
    };
    this.http.post("http://localhost:3000/api/user/logout", logout_info)
    .subscribe(response => {
      this.token = null;
      this.isAuthenticated = false;
      this.userMail = null;
      this.currUser = null;
      this.adminStatus = null;
      this.authInfosListener.next({
        isAuth: false,
        currMail: null
      });
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(["/"]);
    });

  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    /* ilk arguman duration bitince calısacak kod
        ikinci milisecond cinsinden duration(second) */
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private changeToken(token: string) {
    localStorage.setItem("token", token);
  }


  private saveAuthData(token: string, expirationDate: Date, userMail: string, adminStatus: boolean) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userMail", userMail);
    if (adminStatus) {
      localStorage.setItem("adminStatus", 'Admin');
    } else {
      localStorage.setItem("adminStatus", 'Normal User');
    }
  }


  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userMail");
    localStorage.removeItem("adminStatus");
  }


  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userMail = localStorage.getItem("userMail");
    const adminStatus = localStorage.getItem("adminStatus");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userMail: userMail,
      adminStatus: adminStatus
    };
  }

}
