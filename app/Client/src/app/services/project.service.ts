import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';
import { HttpHeaders } from '@angular/common/http';
import {Member} from "../models/member";
import {environment} from "../../environments/environment";
import {Role} from "../models/role";
import {Permission} from "../models/permission";

const PROJECT_API = `${environment.apiUrl}/Project`;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token', // ovde ce da ide token za autorizaciju kada ona bude omogucena na bekendu
  }),
};

@Injectable({
providedIn: 'root'
})
export class ProjectServiceGet{
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${PROJECT_API}`);
  }

  deleteProjectById(id? : number): Observable<any[]>
  {
    return this.http.delete<any>(`${PROJECT_API}/${id}`);
  }

  getProjectById(id : number): Observable<Project>
  {
    return this.http.get<Project>(`${PROJECT_API}/${id}`);
  }

  getMembersByProjectId(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${PROJECT_API}/${projectId}/members`);
  }

  getProjectMembers(projectId: number): Observable<Member[]>
  {
    return this.http.get<Member[]>(`${PROJECT_API}/${projectId}/members`);
  }

  assignMemberToProject(membersId : any, projectId : number) : Observable<any>
  {
    return this.http.post<Member>(`${PROJECT_API}/${projectId}/members`, membersId);
  }

  removeMemberFromProject(memberId : number, projectId: number) : Observable<any>
  {
    return this.http.delete<Member>(`${PROJECT_API}/${projectId}/members/${memberId}`);
  }

  getTaskCategoriesOnProject(projectId : number) : Observable<any[]>
  {
    return this.http.get<any[]>(`${PROJECT_API}/project/${projectId}/categories`);
  }

  getAllRoles(projectId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${PROJECT_API}/${projectId}/Roles`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${PROJECT_API}/Permissions`);
  }
}


