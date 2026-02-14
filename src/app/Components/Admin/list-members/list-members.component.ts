import { ChangeDetectorRef, Component } from '@angular/core';
import { ManageMemberService } from '../../../Services/manage-member.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberService } from '../../../Services/member.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faContactCard, faEdit, faPlus, faTrash, faUserGroup, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailTemplate } from '../../../Models/email-template';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import Swal from 'sweetalert2';
import { PageHeaderComponent } from '../../Shared/page-header/page-header.component';
@Component({
  selector: 'app-list-members',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TableModule,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PageHeaderComponent
  ],
  providers: [DatePipe],
  templateUrl: './list-members.component.html',
  styleUrl: './list-members.component.css'
})
export class ListMembersComponent {
  addIcon = faPlus;
  trashIcon = faTrash;
  contactIcon = faContactCard;
  familyIcon = faUserGroup;
  faEditIcon = faEdit;

  membershipTypeId = new FormControl(0);
  status = new FormControl(0);
  form!: FormGroup;
  updateForm!: FormGroup;

  members: any[] = [];
  memberDetails: any;
  emailTemplate!: EmailTemplate;
  memberId: number = 0;
  updateMemberId!: number;

  displayDetails: boolean = false;
  displayReminder: boolean = false;
  displayUpdateValidUpto: boolean = false;
  isLoading: boolean = false;
  isDisabled: boolean = false;

  constructor(
    private manageMemberService: ManageMemberService,
    private memberService: MemberService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      membershipTypeId: this.membershipTypeId,
      status: this.status
    });

    this.updateForm = this.fb.group({
      validUpto: ['']
    });

    this.loadAllMembers();
  }
  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  loadAllMembers() {
    this.isLoading = true;
    this.manageMemberService.getAllMembers(this.membershipTypeId.value || 0, this.status.value || 0).subscribe({
      next: (data: any) => {
        this.members = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error("Failed to load members");
        this.isLoading = false;
      }
    });
  }

  viewMember(uid: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/admin-registration-details', uid])
    );
    window.open(url, '_blank');
  }

  viewEmailLogs(id: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/email-logs', id])
    );
    window.open(url, '_blank');
  }

  saveAndGenerateInvoice(memberUid: string) {
    this.isLoading = true;
    this.memberService.saveAndGenerateInvoice(memberUid).subscribe({
      next: () => {
        this.toastr.success("Invoice generated successfully");
        this.loadAllMembers();
      },
      error: () => {
        this.toastr.error("Failed to generate invoice");
        this.isLoading = false;
      }
    });
  }

  loadMemberDetails(uid: string) {
    this.memberService.getMemberDetails(uid).subscribe({
      next: (data: any) => {
        this.memberDetails = data;
        this.displayDetails = true;
      },
      error: (err: any) => this.toastr.error("Failed to load member details")
    });
  }

  loadEmailTemplate(uid: string, mid: number, templateName: string) {
    this.memberService.GetReminderEmailTemplate(uid, templateName).subscribe({
      next: (data: EmailTemplate) => {
        this.emailTemplate = data;
        this.memberId = mid;
        this.displayReminder = true;
      },
      error: (err: any) => this.toastr.error("Failed to load email template")
    });
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.emailTemplate?.email || '');
  }

  sendEmail() {
    this.isDisabled = true;
    this.memberService.SendReminderEmailTemplate(this.emailTemplate, this.memberId).subscribe({
      next: () => {
        this.toastr.success("Email sent successfully!");
        this.isDisabled = false;
        this.displayReminder = false;
      },
      error: (err: any) => {
        this.toastr.error("Failed to send email");
        this.isDisabled = false;
      }
    });
  }

  openUpdateValidUptoModal(memberId: number, validUpto: any) {
    this.updateMemberId = memberId;
    if (validUpto && validUpto !== "undefined") {
      this.updateForm.patchValue({
        validUpto: this.datePipe.transform(validUpto, 'yyyy-MM-dd')
      });
    } else {
      this.updateForm.patchValue({ validUpto: '' });
    }
    this.displayUpdateValidUpto = true;
  }

  updateValidUpto() {
    const validUpto = this.updateForm.value.validUpto;
    if (!validUpto) {
      this.toastr.warning("Please select a date");
      return;
    }

    this.manageMemberService.updateValidUpto(this.updateMemberId, validUpto).subscribe({
      next: () => {
        this.toastr.success('Valid Upto updated successfully');
        const member = this.members.find(x => x.memberId === this.updateMemberId);
        if (member) {
          member.validUpto = validUpto;
          // Trigger change detection for the table if needed, though most PrimeNG tables react to object property changes if bound correctly
        }
        this.displayUpdateValidUpto = false;
      },
      error: () => this.toastr.error("Failed to update date")
    });
  }

  deleteMember(id: number) {

    Swal.fire({
      title: 'Delete Member?',
      text: 'This member will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        this.manageMemberService.DeleteMembership(id).subscribe(() => {
          debugger;
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Member deleted successfully',
            timer: 1500,
            showConfirmButton: false
          });

          this.members = this.members.filter(x => x.memberId !== id);
          this.cdr.detectChanges();
        });

      }
    });
  }
}
