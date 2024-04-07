import {Component, OnDestroy, OnInit, Sanitizer} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member";
import {ActivatedRoute, ParamMap, Params, RouterLink} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditProfileForm} from "../../forms/edit-profile.form";
import {maxDateValidator} from "../../validators/max-date.validator";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgToastModule,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent implements OnInit, OnDestroy {
  member: any;
  memberForm: any;
  private datePipe: DatePipe = new DatePipe('en-US'); // Create an instance of DatePipe
  private _routeSubscription: any;

  constructor(private route: ActivatedRoute, private memberService: MemberService,
                private ngToastService: NgToastService, private authService: AuthService) { }

  ngOnInit() {
    this.memberForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      linkedin: new FormControl(''),
      phoneNumber: new FormControl('', [
        Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')
      ]),
      country: new FormControl(''),
      city: new FormControl(''),
      github: new FormControl(''),
      status: new FormControl(''),
      dateOfBirth: new FormControl('', [
        maxDateValidator(this.todayDate())
      ])
    });

    this._routeSubscription = this.route.params.pipe(
      switchMap(params => {
        const memberID = params['id'];
        return this.memberService.getMember(memberID);
      })
    ).subscribe(member => {
      this.member = member;

      this.memberForm.patchValue({
        firstName: this.member.firstName,
        lastName: this.member.lastName,
        linkedin: this.member.linkedin,
        phoneNumber: this.member.phoneNumber,
        country: this.member.country,
        city: this.member.city,
        github: this.member.github,
        status: this.member.status,
        dateOfBirth: this.datePipe.transform(this.member.dateOfBirth, 'yyyy-MM-dd')
      });
    });
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
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

  saveChanges() {
    if (this.memberForm.valid) {
      const editProfileForm: EditProfileForm = this.memberForm.value;

      this.memberService.editMemberProfile(this.member.id, editProfileForm).subscribe({
        next: (data: any) => {
          this.authService.updateAuthenticatedMember(data);

          this.ngToastService.success({
            detail: 'Success',
            summary: 'Successfully updated settings.'
          });
        },
        error: error => {
          this.ngToastService.error({
            detail: 'Error',
            summary: error.statusText
          });
        }
      });
    } else {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'Input validation failed.'
      });
    }
  }
}
