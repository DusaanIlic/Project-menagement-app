import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AddMemberForm} from "../forms/add-member.form";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {EditProfileForm} from "../forms/edit-profile.form";
import { Member } from "../models/member";
import { Role } from "../models/role";
import { environment} from "../../environments/environment";

const API = `${environment.apiUrl}/Member`;
const API_ROLES = `${environment.apiUrl}/Role`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private memberSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  addMember(memberData: any): Observable<any> {
    return this.http.post<any>(`${API}`, memberData);
  }

  getMember(memberId: number): Observable<any>{
    return this.http.get<any>(`${API}/${memberId}`);
  }

  setMemberSubject(member: Member) {
    this.memberSubject.next(member);
  }

  getMemberSubject() {
    return this.memberSubject.asObservable();
  }

  updateMemberSubject(member: Partial<Member>) {
    const updatedMember = {...this.memberSubject.value, ...member};

    this.memberSubject.next(updatedMember);
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

  getRoleById(id:number): Observable<Role> {
    return this.http.get<Role>(`${API_ROLES}/${id}`);
  }

  changeEmail(memberId: number, formData: any) {
    return this.http.post(`${API}/${memberId}/ChangeEmail`, formData);
  }

  changeRole(memberId: number, formData: { roleId: number }): Observable<Role> {
    return this.http.put<Role>(`${API}/${memberId}/ChangeRole`, formData);
  }

  changePassword(memberId: number, formData: { oldPassword: string, newPassword: string}) {
    return this.http.post(`${API}/${memberId}/ChangePassword`, formData);
  }
}
