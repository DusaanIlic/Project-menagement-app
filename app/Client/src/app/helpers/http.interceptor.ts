import {HttpErrorResponse, HttpInterceptor, HttpInterceptorFn} from "@angular/common/http";
import {tap} from "rxjs/internal/operators/tap";
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Member} from "../models/member";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const jwtToken = authService.getJwtToken();

  if (!jwtToken) {
    return next(req);
  }

  const cloned = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${jwtToken}`
    )
  });

  console.log('Http Interceptor running');

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.log('Caught unauthorized error, attempting to refresh token...');

        authService.refreshJwtToken().subscribe({
          next: (data) => {
            const jwtToken = data.jwtToken;
            const jwtTokenExpirationDate = data.jwtTokenExpirationDate;
            const refreshToken = data.refreshToken;

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

            localStorage.setItem('jwt-token', jwtToken);
            localStorage.setItem('jwt-token-expiration-date', jwtTokenExpirationDate);
            localStorage.setItem('refresh-token', refreshToken);
            localStorage.setItem('authenticated-member-id', member.id.toString());
            localStorage.setItem('authenticated-member', JSON.stringify(member));
            localStorage.setItem('authenticated-member-avatar', `http://localhost:8000/api/Member/${member.id}/Avatar`);

            authService.updateAuthenticatedMember(member);
            authService.updateAuthenticatedMembersAvatar();

            console.log('Successfuly refreshed token');

            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer: ${jwtToken}`
              }
            });
          },
          error: error => {
            console.log(`Failed refreshing token.`);
            authService.logout();
          }
        });
      }

      return throwError(() => err);
    })
  );
}
