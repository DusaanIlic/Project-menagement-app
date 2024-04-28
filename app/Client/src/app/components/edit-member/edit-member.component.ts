import {Component, input, OnDestroy, OnInit, Sanitizer} from '@angular/core';
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
import {MatDialog} from "@angular/material/dialog";
import {AddAvatarComponent} from "../add-avatar/add-avatar.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgToastModule,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    MatTabGroup,
    MatTab,
    MatCard,
    MatCardTitle,
    MatButton,
    MatCardContent,
    MatDivider,
    MatFormField,
    MatError,
    MatInput,
    MatLabel,
    MatHint,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent implements OnInit, OnDestroy {
  member: any;
  memberForm: any;
  today: Date = new Date();
  avatarUrl: string | undefined;
  selectedFile: any = null;
  private datePipe: DatePipe = new DatePipe('en-US'); // Create an instance of DatePipe
  private _routeSubscription: any;

  constructor(private route: ActivatedRoute, private memberService: MemberService,
                private ngToastService: NgToastService, private authService: AuthService,
                  private matDialog: MatDialog) { }

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

      this.authService.getAuthenticatedMembersAvatar().subscribe(avatarUrl => {
        this.avatarUrl = avatarUrl;
      })
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
    const dialogRef = this.matDialog.open(AddAvatarComponent, {
      width: '50%',
      height: '50%',
      data: {
        memberId: this.member.id
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    const maxSize: number = 512 * 1024; // 512KB

    this.matDialog.open(AddAvatarComponent, {
      width: '400px',
      height: '400px',
      data: {
        memberId: this.member.id,
        file: this.selectedFile
      }
    });

    event.target.value = '';
  }

  deleteAvatar() {
    console.log('runs');
    this.memberService.deleteAvatar(this.member.id).subscribe({
      next: data => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Deleted successfully.'
        });

        this.authService.updateAuthenticatedMembersAvatar();
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
