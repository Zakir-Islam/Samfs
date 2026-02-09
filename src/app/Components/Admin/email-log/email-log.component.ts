import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ManageMemberService } from '../../../Services/manage-member.service';
import { EmailLog } from '../../../Models/email-log';
import { ActivatedRoute } from '@angular/router';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-email-log',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, ButtonModule],
  templateUrl: './email-log.component.html',
  styleUrl: './email-log.component.css'
})
export class EmailLogComponent implements OnInit {
  recordId: any = 0;
  member: any;
  emailLogs: EmailLog[] = [];
  selectedEmail?: EmailLog;
  isLoading: boolean = false;
  isModalOpen: boolean = false;

  constructor(
    private manageMemberService: ManageMemberService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: any) => {
      const newRecordId = param.get('recordId');
      if (newRecordId) {
        this.recordId = +newRecordId; // convert to number
        this.loadLogs();
        this.loadMember();
      }
    });
  }

  loadLogs(): void {
    this.isLoading = true;
    this.manageMemberService.getEmailLogsByRecordId(this.recordId, 2)
      .subscribe({
        next: (res: any) => {
          this.emailLogs = res;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  loadMember(): void {
    this.manageMemberService.GetMemberById(this.recordId)
      .subscribe((res: any) => this.member = res);
  }

  openEmail(log: EmailLog): void {
    this.selectedEmail = log;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmail = undefined;
  }

  getFullName(): string {
    let name = '';
    if (this.member) {
      if (this.member.memberFName) name += ' ' + this.member.memberFName;
      if (this.member.memberMName) name += ' ' + this.member.memberMName;
      if (this.member.memberLName) name += ' ' + this.member.memberLName;
    }
    return name.trim();
  }
}
