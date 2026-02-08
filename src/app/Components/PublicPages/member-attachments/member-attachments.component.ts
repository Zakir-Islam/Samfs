import { Component, OnInit } from '@angular/core';
import { AttachmentType, MemberAttachment } from '../../../Models/member-attachment';
import { MemberService } from '../../../Services/member.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bucketURL } from '../../../Core/Constants/constant';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-member-attachments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, ButtonModule, TableModule],
  templateUrl: './member-attachments.component.html',
  styleUrl: './member-attachments.component.css'
})
export class MemberAttachmentsComponent implements OnInit {
  bucketUrl = bucketURL;
  memberId!: any;
  attachments: MemberAttachment[] = [];
  attachmentTypes = [
    { label: 'Driving License', value: AttachmentType.Driving_License },
    { label: 'Passport', value: AttachmentType.Passport },
    { label: 'Other', value: AttachmentType.Other }
  ];
  selectedFile!: File;
  selectedType!: number;
  isSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private service: MemberService
  ) { }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('uid');
    this.loadAttachments();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {

    if (!this.selectedFile || !this.selectedType) return;
    this.isSubmitted = true;
    const formData = new FormData();
    formData.append('memberUId', this.memberId.toString());
    formData.append('attachmentType', this.selectedType.toString());
    formData.append('file', this.selectedFile);

    this.service.upload(formData).subscribe(() => {
      this.selectedFile = null!;
      this.selectedType = null!;
      this.isSubmitted = false;
      this.loadAttachments();
    });
  }

  loadAttachments() {
    this.service.getByMember(this.memberId)
      .subscribe((res: any) => this.attachments = res);
  }

  getTypeName(type: number) {
    return AttachmentType[type];
  }
}
