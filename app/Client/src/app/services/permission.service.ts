import {Injectable} from "@angular/core";
import {ProjectServiceGet} from "./project.service";
import {HttpClient} from "@angular/common/http";
import {MemberService} from "./member.service";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private projectIds: Set<number> = new Set<number>();
  private globalPermissions: Set<number> = new Set<number>();
  private projectPermissions: Map<number, Set<number>> = new Map<number, Set<number>>();

  constructor(
    private projectService: ProjectServiceGet,
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  refreshData() {
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

    this.memberService.getProjectPermissions(memberId).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        console.log('PERMISSION SERVICE: failed fetching project permissions');
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

  getGlobalPermissions(): Set<number> {
    return this.globalPermissions;
  }

  getProjectPermissions(projectId: number): Set<number> {
    if (!this.projectPermissions.has(projectId)) {
      this.projectPermissions.set(projectId, new Set<number>());
    }

    return this.projectPermissions.get(projectId) || new Set<number>();
  }

  updateGlobalPermissions(globalPermissions: number[]): void {
    console.log(`updated global permissions to ${globalPermissions}`);
    this.globalPermissions = new Set<number>(globalPermissions);
  }

  updateProjectPermissions(projectId: number, permissions: number[]): void {
    console.log(`updated project ${projectId} permissions to ${permissions}`);
    this.projectPermissions.set(projectId, new Set<number>(permissions));
  }
}
