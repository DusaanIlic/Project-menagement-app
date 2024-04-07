import {Component, OnDestroy, OnInit, Sanitizer} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member";
import {ActivatedRoute, ParamMap, Params} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {NgOptimizedImage} from "@angular/common";
import { DomSanitizer } from '@angular/platform-browser';
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {MatDialog} from "@angular/material/dialog";
import {UploadAvatarComponent} from "../upload-avatar/upload-avatar.component";

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

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private route: ActivatedRoute, private memberService: MemberService,
                private ngToastService: NgToastService, private matDialog: MatDialog) { }

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
    const dialogRef = this.matDialog.open(UploadAvatarComponent, {
      width: '500px',
      data: { memberId: this.member.id }
    })
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
