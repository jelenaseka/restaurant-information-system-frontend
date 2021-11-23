import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class HeaderInterceptorService implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token : string | null = localStorage.getItem('token');
    if(token) {
      let Authorization : string = "Bearer " + token;
      return next.handle(httpRequest.clone({ setHeaders: { Authorization }, url: env.apiUrl + httpRequest.url }));
    }  
    return next.handle(httpRequest.clone({url: env.apiUrl + httpRequest.url}));
  }
}
