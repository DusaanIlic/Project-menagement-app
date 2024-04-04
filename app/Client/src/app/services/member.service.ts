import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {Observable} from "rxjs";
import { Member } from "../models/member";
import { Role } from "../models/role";

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

  getMembers(): Observable<any[]>{
    return this.http.get<any[]>(`${API}`);
  }

  getMemberById(id : number): Observable<Member>{
    return this.http.get<Member>(`${API}/${id}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${API_ROLES}`);
  }

  getRoleById(id:number): Observable<Role> {
    return this.http.get<Role>(`${API_ROLES}/${id}`);
  }

}
