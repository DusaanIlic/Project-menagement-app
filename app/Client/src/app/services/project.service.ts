import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project';
import { HttpHeaders } from '@angular/common/http';
import {Member} from "../models/member";
import {environment} from "../../environments/environment";
import {Role} from "../models/role";
import {Permission} from "../models/permission";
import {UpdateRoleForm} from "../forms/update-role.form";
import {AddRoleForm} from "../forms/add-role.form";
import {RoleMember} from "../models/role-member";
import {ProjectStatus} from "../models/project-status";

const PROJECT_API = `${environment.apiUrl}/Project`;
const PROJECT_PRIORITY = `${environment.apiUrl}/ProjectPriority`

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceGet{
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${PROJECT_API}`);
  }

  getRecentActivity(projectId: number): Observable<any[]>{
    return this.http.get<any[]>(`${PROJECT_API}/${projectId}/Latest`);
  }

  deleteProjectById(id? : number): Observable<any[]>
  {
    return this.http.delete<any>(`${PROJECT_API}/${id}`);
  }

  getProjectById(id : number): Observable<Project>
  {
    return this.http.get<Project>(`${PROJECT_API}/${id}`);
  }

  getMembersByProjectId(projectId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${PROJECT_API}/${projectId}/members`);
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

  updateRole(projectId: number, roleId: number, updateRoleForm: UpdateRoleForm) {
    return this.http.put<Role>(`${PROJECT_API}/${projectId}/Roles/${roleId}`, updateRoleForm);
  }

  addRole(projectId: number, addRoleForm: AddRoleForm) {
    return this.http.post<Role>(`${PROJECT_API}/${projectId}/Roles`, addRoleForm);
  }

  deleteRole(projectId: number, roleId: number) {
    return this.http.delete(`${PROJECT_API}/${projectId}/Roles/${roleId}`);
  }

  addPermissionToRole(projectId: number, roleId: number, permissionId: number) {
    return this.http.post(`${PROJECT_API}/${projectId}/Roles/${roleId}/Permissions/${permissionId}`, null);
  }

  removePermissionFromRole(projectId: number, roleId: number, permissionId: number) {
    return this.http.delete(`${PROJECT_API}/${projectId}/Roles/${roleId}/Permissions/${permissionId}`);
  }

  getMemberRoles(projectId: number, roleId: number) {
    return this.http.get<RoleMember[]>(`${PROJECT_API}/${projectId}/Roles/${roleId}/Members`);
  }

  getProjectPriorities() {
    return this.http.get(PROJECT_PRIORITY);
  }

  addProject(projectData: any) {
    return this.http.post(PROJECT_API, projectData);
  }

  getAllProjectsWhereMemberIsAssigned(memberId: number) {
    return this.http.get<Project[]>(`${PROJECT_API}/Member/${memberId}`);
  }

  getAllProjectStatuses() {
    return this.http.get<ProjectStatus>(`${PROJECT_API}/Status`);
  }
}


