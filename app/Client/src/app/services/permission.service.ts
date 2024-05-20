import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private projectIds: BehaviorSubject<Set<number>> = new BehaviorSubject<Set<number>>(new Set<number>());

  constructor() {

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
