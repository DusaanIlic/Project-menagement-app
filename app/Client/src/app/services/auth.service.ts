import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

const AUTH_API = 'http://localhost:8000/api/Auth'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API,
      {
        email,
        password
      },
      httpOptions
    );
  }

  logout() {
    console.log('logging out');
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('auth-member');
  }

  getToken(): string | null{
    return localStorage.getItem('jwt-token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}


