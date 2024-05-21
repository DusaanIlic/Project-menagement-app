import {Injectable} from "@angular/core";
import {ProjectServiceGet} from "./project.service";
import {HttpClient} from "@angular/common/http";
import {MemberService} from "./member.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private projectIds: Set<number> = new Set<number>();
  private globalPermissions: Set<number> = new Set<number>();

  constructor(private projectService: ProjectServiceGet, private memberService: MemberService) {
    const memberId = Number(localStorage.getItem('authenticated-member-id'));

    this.projectService.getAssignedProjectIds(memberId).subscribe({
      next: data=> {
        console.log(`PERMISSION SERVICE: successfully fetched assigned projects ${data}`);
        this.projectIds = new Set<number>(data);
      },
      error: err => {
        console.log('PERMISSION SERVICE: failed fetching assigned projects');
      }
    });

    this.memberService.getGlobalPermissions(memberId).subscribe({
      next: data => {
        console.log(`PERMISSION SERVICE: successfully fetched global permissions ${data}`);
        this.globalPermissions = new Set<number>(data);
      },
      error: err => {
        console.log('PERMISSION SERVICE: failed fetching global permissions');
      }
    });
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

  getGlobalPermissions(): Set<number> {
    return this.globalPermissions;
  }
}
