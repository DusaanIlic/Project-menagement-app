import {HttpErrorResponse, HttpInterceptor, HttpInterceptorFn} from "@angular/common/http";
import {tap} from "rxjs/internal/operators/tap";
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const jwtToken = authService.getJwtToken();

  if (jwtToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
  }

  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && err.status == 401) {
        console.log('ERROR 401 CAUGHT!!!!');

        authService.refreshJwtToken()
          .then(() => {
            console.log('successfully refreshed token');
          })
          .catch(err => {
            authService.logout();
            console.log(err);
            return;
          });
      }

      return throwError(() => err);
    })
  );
}
