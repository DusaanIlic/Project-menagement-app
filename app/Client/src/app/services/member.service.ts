import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {Observable} from "rxjs";

const API = 'http://localhost:8000/api/Member';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(private http: HttpClient) { }

  addMember(formData: AddMemberForm): Observable<any> {
    console.log('sent');
    return this.http.post(
      API,
      formData,
      httpOptions
    )
  }

  getMembers(): Observable<any[]>{
    return this.http.get<any[]>(`${API}`);
  }
}
