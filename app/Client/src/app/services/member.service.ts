import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

const AUTH_API = 'http://localhost:8000/api/Member'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(private http: HttpClient) { }

  addMember(fullName: string, email: string, role: string, password: string) {
    return this.http.post(
      AUTH_API,
      {
        fullName,
        email,
        role,
        password
      },
      httpOptions
    )
  }
}
