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
  private authenticatedMemberSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    const authenticatedMember = localStorage.getItem('authenticated-member');
    this.authenticatedMemberSubject = new BehaviorSubject<any>(authenticatedMember ? JSON.parse(authenticatedMember) : null);
  }

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

          localStorage.setItem('jwt-token', token);
          localStorage.setItem('authenticated-member-id', member.id.toString());
          localStorage.setItem('authenticated-member', JSON.stringify(member));

          this.authenticatedMemberSubject.next(member);

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
    return this.authenticatedMemberSubject.asObservable();
  }

  getAuthenticatedMembersId() {
    const id: any = localStorage.getItem('authenticated-member-id');

    if (id) {
      return parseInt(id);
    }

    return null;
  }

  updateAuthenticatedMember(member: Member) {
    const id: any = localStorage.getItem('authenticated-member-id');

    console.log('updated member');

    if (id && parseInt(id) == member.id) {
      localStorage.setItem('authenticated-member', JSON.stringify(member));
      this.authenticatedMemberSubject.next(member);
    }
  }

  getToken(): string | null{
    return localStorage.getItem('jwt-token');
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}


