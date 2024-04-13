import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Role} from "../models/role";
import {Injectable} from "@angular/core";

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
}
