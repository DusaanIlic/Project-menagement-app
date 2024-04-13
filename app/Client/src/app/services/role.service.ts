import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Role} from "../models/role";
import {Injectable} from "@angular/core";
import {Permission} from "../models/permission";

const ROLE_API: string = 'http://localhost:8000/api/Role';
const PERM_API: string = 'http://localhost:8000/api/Permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(ROLE_API);
  }

  getRoleWithPermissions(roleId: number) {
    return this.http.get(`${ROLE_API}/permissions/${roleId}`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(PERM_API);
  }
}
