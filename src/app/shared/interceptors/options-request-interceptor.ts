import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class OptionsRequestInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Headers': 'Content-Type',
      //   'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
      // })
    })
    console.log(authReq);
    return next.handle(authReq);
  }
}
