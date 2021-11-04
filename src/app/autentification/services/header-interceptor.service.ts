import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptorService implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let Bearer = "";
    if(token)
      Bearer = token;
    return next.handle(httpRequest.clone({ setHeaders: { Bearer } }));
  }
}
