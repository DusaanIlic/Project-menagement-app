import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member";
import {ActivatedRoute, ParamMap, Params} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent implements OnInit, OnDestroy {
  member: any;
  private _routeSubscription: any;

  constructor(private route: ActivatedRoute, private memberService: MemberService) {
  }

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

  onFileSelected(event: any) {
    const avatar: File = event.target.files[0];
  }
}
