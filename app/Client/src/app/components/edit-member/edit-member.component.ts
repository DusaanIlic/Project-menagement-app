import {Component, OnDestroy, OnInit, Sanitizer} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member";
import {ActivatedRoute, ParamMap, Params} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {NgOptimizedImage} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgToastModule
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent implements OnInit, OnDestroy {
  member: any;
  private _routeSubscription: any;

  constructor(private route: ActivatedRoute, private memberService: MemberService, private ngToastService: NgToastService) { }

  ngOnInit() {
    this._routeSubscription = this.route.params.pipe(
      switchMap(params => {
        const memberID = params['id'];
        return this.memberService.getMember(memberID);
      })
    ).subscribe(member => {
      this.member = member;
      console.log(this.member);
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  openAvatarDialog() {

  }

  deleteAvatar() {
    console.log('runs');
    this.memberService.deleteAvatar(this.member.id).subscribe({
      next: data => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Deleted successfully.'
        });
      },
      error: err => {
        this.ngToastService.error({
          detail: 'Error',
          summary: 'Failed deleting avatar.'
        });
      }
    });
  }
}
