import { Component } from '@angular/core';
import { AttachmentType, MemberAttachment } from '../../../Models/member-attachment';
import { MemberService } from '../../../Services/member.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bucketURL } from '../../../Core/Constants/constant';

@Component({
    selector: 'app-member-attachments',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './member-attachments.component.html',
    styleUrl: './member-attachments.component.css'
})
export class MemberAttachmentsComponent {
  bucketUrl=bucketURL;
 memberId!: any;
  attachments: MemberAttachment[] = [];
  attachmentType = AttachmentType;
  selectedFile!: File;
  selectedType!: number;
  isSubmitted=false;
  constructor(
    private route: ActivatedRoute,
    private service: MemberService
  ) {}

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('uid');
    this.loadAttachments();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {

    if (!this.selectedFile || !this.selectedType) return;
    this.isSubmitted=true;
    const formData = new FormData();
    formData.append('memberUId', this.memberId.toString());
    formData.append('attachmentType', this.selectedType.toString());
    formData.append('file', this.selectedFile);

    this.service.upload(formData).subscribe(() => {
      this.selectedFile = null!;
      this.selectedType = null!;
      this.isSubmitted=false;
      this.loadAttachments();
    });
  }

  loadAttachments() {
    this.service.getByMember(this.memberId)
      .subscribe((res :any)=> this.attachments = res);
  }

  getTypeName(type: number) {
    return AttachmentType[type];
  }
}
