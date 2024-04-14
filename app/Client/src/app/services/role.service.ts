import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Role} from "../models/role";
import {Injectable} from "@angular/core";
import {Permission} from "../models/permission";
import {AddRoleForm} from "../forms/add-role.form";
import {UpdateRoleForm} from "../forms/update-role.form";
import {RoleMember} from "../models/role-member";

const ROLE_API: string = 'http://localhost:8000/api/Role';
const PERM_API: string = 'http://localhost:8000/api/Permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) {
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(ROLE_API);
  }

  getRoleWithPermissions(roleId: number) {
    return this.http.get(`${ROLE_API}/permissions/${roleId}`);
  }

  updateRole(roleId: number, updateRoleForm: UpdateRoleForm) {
    return this.http.put(`${ROLE_API}/${roleId}`, updateRoleForm);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(PERM_API);
  }

  addRole(addRoleForm: AddRoleForm) {
    return this.http.post(ROLE_API, addRoleForm);
  }

  addPermissionToRole(roleId: number, permissionId: number) {
    return this.http.post(`${ROLE_API}/${roleId}/permissions/${permissionId}`, null);
  }

  removePermissionFromRole(roleId: number, permissionId: number) {
    return this.http.delete(`${ROLE_API}/${roleId}/permissions/${permissionId}`);
  }

  getAllRoleMembers(roleId: number) {
    return this.http.get<RoleMember[]>(`${ROLE_API}/${roleId}/Members`);
  }
}
