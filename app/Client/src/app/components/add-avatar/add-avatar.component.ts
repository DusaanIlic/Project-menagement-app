import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditMemberComponent} from "../edit-member/edit-member.component";
import {ImageCropperModule} from "ngx-image-cropper";
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";


@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [
    ImageCropperModule,
    NgOptimizedImage,
    NgIf,
    MatButton,
    MatIcon,
    MatToolbar,
    MatCardContent,
    MatCard,
    MatCardActions
  ],
  templateUrl: './add-avatar.component.html',
  styleUrl: './add-avatar.component.scss'
})
export class AddAvatarComponent {
  selectedFile: any = '';
  croppedImage: any = '';

  constructor(public dialogRef: MatDialogRef<EditMemberComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.selectedFile = data.file;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl != null) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
