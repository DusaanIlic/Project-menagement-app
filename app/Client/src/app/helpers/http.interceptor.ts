import {HttpErrorResponse, HttpInterceptor, HttpInterceptorFn} from "@angular/common/http";
import {tap} from "rxjs/internal/operators/tap";
import {catchError, finalize, throwError} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Member} from "../models/member";
import {switchMap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ProgressBarService} from "../services/progress-bar.service";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const jwtToken = authService.getJwtToken();

  const cloned = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${jwtToken}`
    )
  });

  const progressBarService = inject(ProgressBarService); // Inject ProgressBarService

  progressBarService.show(); // Show progress bar when request starts

  console.log('Http Interceptor running');

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.log('Caught unauthorized error, attempting to refresh token...');
        console.log(`Sending refresh token ${localStorage.getItem('refresh-token')}`)

        return authService.refreshJwtToken().pipe(
          switchMap((data) => {
            const newJwtToken = data.jwtToken;
            const newJwtTokenExpirationDate = data.jwtTokenExpirationDate;
            const newRefreshToken = data.refreshToken;

            const dto = data.member;

            const member: Member = {
              id: dto.id,
              firstName: dto.firstName,
              lastName: dto.lastName,
              roleId: dto.roleId,
              roleName: dto.roleName,
              email: dto.email,
              linkedin: dto.linkedin,
              github: dto.github,
              status: dto.status,
              phoneNumber: dto.phoneNumber,
              country: dto.country,
              city: dto.city,
              dateOfBirth: new Date(dto.dateOfBirth),
              dateAdded: new Date(dto.dateAdded)
            };

            localStorage.setItem('jwt-token', newJwtToken);
            localStorage.setItem('jwt-token-expiration-date', newJwtTokenExpirationDate);
            localStorage.setItem('refresh-token', newRefreshToken);
            localStorage.setItem('authenticated-member-id', member.id.toString());
            localStorage.setItem('authenticated-member', JSON.stringify(member));
            localStorage.setItem('authenticated-member-avatar', `${environment.apiUrl}/Member/${member.id}/Avatar`);

            authService.updateAuthenticatedMember(member);
            authService.updateAuthenticatedMembersAvatar();

            console.log('Successfully refreshed token');

            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newJwtToken}`
              }
            });

            progressBarService.hide();

            return next(clonedReq);
          }),
          catchError((error) => {
            console.log(`Failed refreshing token.`);
            progressBarService.hide();
            authService.logout();
            return throwError(() => error);
          }),
          finalize(() => {
            progressBarService.hide(); // Hide progress bar whether there's an error or not
          })
        );
      }

      progressBarService.hide(); // Hide progress bar on error
      return throwError(() => err);
    }),
    finalize(() => {
      progressBarService.hide(); // Hide progress bar whether there's an error or not
    })
  );
}
