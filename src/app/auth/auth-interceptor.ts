import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";


import { AuthService } from "./auth.service";


@Injectable()   // bu baska servisleri buraya inject etmek icin gerekli, sonucta bu da bi servis
export class AuthInterceptor implements HttpInterceptor {


  constructor( private authService: AuthService ) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /* HttpInterceptor'u implement ettiğimiz icin intercept fonksiyonu burda zorunlu
  yani kısaca angular app'ten ayrılan butun request'leri gitmeden once kesip ona
  bişeyler ekleyip(token gibi) yoluna öyle devam etmesini saglıyoruz. */
    const authToken = this.authService.getToken();
    if (req.url !== "http://ip4.seeip.org/json") {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + authToken)
      });
      return next.handle(authRequest);
    } else {
      return next.handle(req);
    }
  }


}
