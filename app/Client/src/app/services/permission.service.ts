import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {MemberService} from "./member.service";
import {ProjectServiceGet} from "./project.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private projectIds: Set<number> = new Set<number>();

  constructor(private projectService: ProjectServiceGet) {
    const memberId = Number(localStorage.getItem('authenticated-member-id'));

    this.projectService.getAssignedProjectIds(memberId).subscribe({
      next: data=> {
        this.projectIds = new Set<number>(data);
      },
      error: err => {
        console.log(err.message);
      }
    })
  }

  isAssignedToProject(id: number): boolean {
    return this.projectIds.has(id);
  }

  removeProjectId(id: number): void {
    this.projectIds.delete(id);
  }

  addProjectId(id: number): void {
    this.projectIds.add(id);
  }
}
