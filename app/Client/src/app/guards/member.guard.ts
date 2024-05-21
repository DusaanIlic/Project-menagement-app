import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router} from "@angular/router";
import {catchError, map, Observable, of} from "rxjs";
import {ProjectServiceGet} from "../services/project.service";
import {MemberService} from "../services/member.service";

export class MemberGuard implements CanActivate {
  constructor(
    private memberService: MemberService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const memberId = Number(route.paramMap.get('id'));
    const authId = Number(localStorage.getItem('authenticated-member-id'));


  }
}
