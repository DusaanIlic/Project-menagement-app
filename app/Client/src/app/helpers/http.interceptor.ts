import {HttpInterceptor, HttpInterceptorFn} from "@angular/common/http";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt-token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
}
