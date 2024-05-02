import {Component, input, OnDestroy, OnInit, Sanitizer} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Member} from "../../models/member";
import {ActivatedRoute, ParamMap, Params, RouterLink} from "@angular/router";
import {async, Observable, Subscription, switchMap} from "rxjs";
import {AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {NgToastModule, NgToastService} from "ng-angular-popup";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
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
import {MatIcon} from "@angular/material/icon";
import {RoleService} from "../../services/role.service";
import {Role} from "../../models/role";
import {MatOption, MatSelect} from "@angular/material/select";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    MatSuffix,
    MatIcon,
    MatSelect,
    MatOption,
    NgForOf,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss'
})
export class EditMemberComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  selectedFile: any = null;
  member!: Observable<Member | null>;
  roles!: Observable<Role[]>;
  memberId!: number;

  private avatarLink: string = '';
  private timeStamp: number = new Date().getTime();
  private datePipe: DatePipe = new DatePipe('en-US'); // Create an instance of DatePipe
  private routeSubscription!: Subscription;


  memberForm: FormGroup = new FormGroup({
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

  emailForm: FormGroup = new FormGroup({
    oldEmail: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    newEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  roleForm: FormGroup = new FormGroup({
    oldRoleId: new FormControl({value: '', disabled: true}, [Validators.required]),
    roleId: new FormControl('', [Validators.required])
  });

  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl(
      '',
      Validators.compose([Validators.required])
    )},
    this.passwordMatch('newPassword', 'confirmPassword')
  );

  constructor(private route: ActivatedRoute, private memberService: MemberService,
                private ngToastService: NgToastService, private authService: AuthService,
                  private matDialog: MatDialog, private roleService: RoleService,
                    private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.pipe(
      switchMap(params => {
        this.memberId = params['id'];
        return this.memberService.getMember(this.memberId);
      })
    ).subscribe(member => {
      this.memberService.setMemberSubject(member)

      this.memberForm.patchValue({
        firstName: member.firstName,
        lastName: member.lastName,
        linkedin: member.linkedin,
        phoneNumber: member.phoneNumber,
        country: member.country,
        city: member.city,
        github: member.github,
        status: member.status,
        dateOfBirth: this.datePipe.transform(member.dateOfBirth, 'yyyy-MM-dd')
      });

      this.emailForm.patchValue({
        oldEmail: member.email
      });

      this.roleForm.patchValue({
        oldRoleId: member.roleId
      });

      this.setAvatarLink(`${environment.apiUrl}/Member/${member.id}/Avatar`);
    });

    this.roles = this.roleService.getAllRoles();
    this.member = this.memberService.getMemberSubject();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  getAvatarLink() {
    if (this.timeStamp) {
      return this.avatarLink + '?' + this.timeStamp;
    }

    return this.avatarLink;
  }

  setAvatarLink(url: string) {
    this.avatarLink = url;
    this.timeStamp = (new Date()).getTime();
  }

  todayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    const maxSize: number = 1024 * 1024; // 1MB

    if ( this.selectedFile &&  this.selectedFile.size > maxSize) {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'File size exceeds 1MB.'
      });

      event.target.value = '';

      return;
    }

    this.matDialog.open(AddAvatarComponent, {
      width: '420px',
      data: {
        memberId: this.memberId,
        file: this.selectedFile
      }
    }).afterClosed().subscribe(result => {
      this.setAvatarLink(`${environment.apiUrl}/Member/${this.memberId}/Avatar`);
    });

    event.target.value = '';
  }

  deleteAvatar() {
    console.log('runs');
    this.memberService.deleteAvatar(this.memberId).subscribe({
      next: data => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Deleted successfully.'
        });

        this.authService.updateAuthenticatedMembersAvatar();
        this.setAvatarLink(`${environment.apiUrl}/Member/${this.memberId}/Avatar`);
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

      this.memberService.editMemberProfile(this.memberId, editProfileForm).subscribe({
        next: (data: any) => {
          this.memberService.updateMemberSubject(data);
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

  submitEmail() {
    if (!this.emailForm.valid) {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'Input validation failed.'
      });

      return;
    }

    if (this.emailForm.get('newEmail')?.value == this.emailForm.get('oldEmail')?.value) {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'New Email can not match old email!.'
      });

      return;
    }

    const formData = {
      newEmail: this.emailForm.get('newEmail')?.value
    };

    this.memberService.changeEmail(this.memberId, formData).subscribe({
      next: (data: any) => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Email updated successfully.'
        });

        this.emailForm.patchValue({
          oldEmail: formData.newEmail,
          newEmail: ''
        });

        this.emailForm.markAsPristine();
        this.emailForm.markAsUntouched();

        const updatedMember: Partial<Member> = {
          id: this.memberId,
          email: formData.newEmail
        };

        this.authService.updateAuthenticatedMember(updatedMember);
        this.memberService.updateMemberSubject(updatedMember);
      },
      error: error => {
        this.ngToastService.error({
          detail: 'Error',
          summary: error.error.message
        });
      }
    });
  }

  submitRole() {
    if (!this.roleForm.valid) {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'Input validation failed.'
      });

      return;
    }

    const formData = this.roleForm.value;

    this.memberService.changeRole(this.memberId, formData).subscribe({
      next: (data: Role) => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Role changed successfully.'
        });

        this.roleForm.patchValue({
          oldRoleId: formData.roleId,
          roleId: ''
        });

        this.roleForm.markAsPristine();
        this.roleForm.markAsUntouched();

        const updatedMember: Partial<Member> = {
          id: this.memberId,
          roleId: data.id,
          roleName: data.name
        };

        this.authService.updateAuthenticatedMember(updatedMember);
        this.memberService.updateMemberSubject(updatedMember);
      },
      error: error => {
        this.ngToastService.error({
          detail: 'Error',
          summary: error.error.message
        });
      }
    });
  }

  submitPassword() {
    if (!this.passwordForm.valid) {
      this.ngToastService.error({
        detail: 'Error',
        summary: 'Input validation failed.'
      });

      return;
    }

    const formData = this.passwordForm.value;

    this.memberService.changePassword(this.memberId, formData).subscribe({
      next: data => {
        this.ngToastService.success({
          detail: 'Success',
          summary: 'Password changed successfully.'
        });


        this.passwordForm.reset();
      },
      error: error => {
        this.ngToastService.error({
          detail: 'Error',
          summary: error.error.message
        });
      }
    });
  }

  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
