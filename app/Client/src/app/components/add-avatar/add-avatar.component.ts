import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditMemberComponent} from "../edit-member/edit-member.component";
import {ImageCropperModule} from "ngx-image-cropper";
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import {NgIf, NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-add-avatar',
  standalone: true,
  imports: [
    ImageCropperModule,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './add-avatar.component.html',
  styleUrl: './add-avatar.component.scss'
})
export class AddAvatarComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(public dialogRef: MatDialogRef<EditMemberComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private sanitizer: DomSanitizer) {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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
}
