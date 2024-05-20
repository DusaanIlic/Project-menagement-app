import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {MemberService} from "./member.service";
import {ProjectServiceGet} from "./project.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private projectIds: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set<number>());

  constructor(private projectService: ProjectServiceGet, private authService: AuthService) {
    const memberId = this.authService.getAuthenticatedMembersId();

    if (memberId !== null) {
      this.projectService.getAssignedProjectIds(memberId).subscribe({
        next: data=> {
          this.projectIds.next(new Set<number>(data));
          console.log(data);
        },
        error: err => {
          console.log(err.message);
        }
      })
    }
  }

  getProjectIds(): Observable<Set<number>> {
    return this.projectIds.asObservable();
  }

  removeProjectId(id: number): void {
    const newProjectIds = this.projectIds.value;
    newProjectIds.delete(id);
    this.projectIds.next(newProjectIds);
  }

  addProjectId(id: number): void {
    const newProjectIds = this.projectIds.value;
    newProjectIds.add(id);
    this.projectIds.next(newProjectIds);
  }
}
