import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of, skipWhile} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Member} from "../models/member";

const AUTH_API = 'http://localhost:8000/api/Auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(AUTH_API, { email, password }, httpOptions).subscribe({
        next: (data: any) => {
          const token = data.token;
          const dto = data.member;

          const member: Member = {
            id: dto.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.roleId,
            email: dto.email,
            linkedin: dto.linkedin,
            github: dto.github,
            status: dto.status,
            phoneNumber: dto.phoneNumber,
            city: dto.city,
            dateOfBirth: new Date(dto.dateOfBirth),
            dateAdded: new Date(dto.dateAdded)
          };

          localStorage.setItem('jwt-token', token);
          localStorage.setItem('authenticated-member-id', member.id.toString());
          localStorage.setItem('authenticated-member', JSON.stringify(member));

          resolve();
        },
        error: error => {
          reject('Invalid email and password combination.');
        }
      });
    });
  }

  logout() {
    console.log('logging out');

    localStorage.removeItem('jwt-token');
    localStorage.removeItem('authenticated-member-id');
    localStorage.removeItem('authenticated-member');

    this.router.navigate(['/login']);
  }

  getAuthenticatedMember() {
    const authenticatedMember = localStorage.getItem('authenticated-member')

    if (authenticatedMember) {
      return of(JSON.parse(authenticatedMember));
    }

    return of(null);
  }

  getToken(): string | null{
    return localStorage.getItem('jwt-token');
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}


