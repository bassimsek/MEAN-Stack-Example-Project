import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse} from "@angular/common/http";
import { MatDialog } from "@angular/material";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

import { ErrorComponent } from "./error/error.component";



@Injectable()   // bu baska servisleri buraya inject etmek icin gerekli, sonucta bu da bi servis
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  // Bu interceptor giden her request'i izliycek ve eğer geri errorResponse dönerse bunu handle edecek.

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    /* Burada handle bize response stream'ini veriyor. Pipe'la ona yeni bir
    catchError parametresi ekliyoruz gelen response'lardan httpError'ları yakalayabilmek için. */
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // erroru burda handle ediyoruz.
        let errorMessage = "An unknown error occurred!";
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: { message: errorMessage } });
        // burda da response kendi service'lerimize ulaşsın diye Error'lu bi şekilde observable döndürüyoruz.
        return throwError(error);
      })
    );
  }


}
