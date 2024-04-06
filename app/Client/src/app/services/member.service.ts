import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {BehaviorSubject, Observable} from "rxjs";
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
  private _authorizedMember: BehaviorSubject<Member | null> = new BehaviorSubject<Member | null>(null);

  constructor(private http: HttpClient) { }

  setAuthorizedMember(authorizedMember: Member) {
    this._authorizedMember.next(authorizedMember);
  }

  getAuthorizedMember() {
    return this._authorizedMember.asObservable();
  }

  updateAuthorizedMember(updatedAuthorizedMember: Partial<Member>) {
    const currentAuthorizedMember = this._authorizedMember.value;
    if (currentAuthorizedMember) {
      const newAuthorizedMember = { ...currentAuthorizedMember, ...updatedAuthorizedMember };
      this._authorizedMember.next(newAuthorizedMember);
    }
  }

  addMember(memberData: any): Observable<any> {
    return this.http.post<any>(`${API}`, memberData);
  }

  getMembers(): Observable<any[]>{
    return this.http.get<any[]>(`${API}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${API_ROLES}`);
  }

}
