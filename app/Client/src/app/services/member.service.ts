import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {Member} from "../models/member";

const API = 'http://localhost:8000/api/Member';
const API_ROLES = 'http://localhost:8000/api/Role';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(private http: HttpClient) { }

  addMember(memberData: any): Observable<any> {
    return this.http.post<any>(`${API}`, memberData);
  }

  getMember(memberId: number): Observable<any>{
    return this.http.get<any>(`${API}/${memberId}`);
  }

  getMembers(): Observable<any[]>{
    return this.http.get<any[]>(`${API}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${API_ROLES}`);
  }

  deleteAvatar(memberId: number) {
    return this.http.delete(`${API}/${memberId}/Avatar`);
  }
}
