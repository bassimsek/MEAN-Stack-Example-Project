import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


import { AuthService } from "./auth.service";


@Injectable() // bu dosya sonucta bi servis. baska bi servisi inject edebilmek icin bunu yazman şart
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getisAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }

}
