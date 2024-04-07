import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {Member} from "../models/member";
import {EditProfileForm} from "../forms/edit-profile.form";

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

  editMemberProfile(memberId: number, editProfileForm: EditProfileForm): Observable<any> {
    return this.http.put<any>(`${API}/${memberId}`, editProfileForm);
  }

  setAvatar(memberId: number, file: any) {
    const formData: FormData = new FormData();
    formData.append('fileDetails', file, file.name); // 'FileDetails' should match the property name on the server


    return this.http.post(`${API}/${memberId}/Avatar`, formData);
  }

  deleteAvatar(memberId: number) {
    return this.http.delete(`${API}/${memberId}/Avatar`);
  }
}
