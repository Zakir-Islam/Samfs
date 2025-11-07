import { Component } from '@angular/core';
import { ManageMemberService } from '../../../Services/manage-member.service';
import { CommonModule, DatePipe } from '@angular/common';
import { retry } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberService } from '../../../Services/member.service';
import * as bootstrap from 'bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faContactCard, faEdit, faPlus, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailTemplate } from '../../../Models/email-template';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-list-members',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  providers: [DatePipe],
  templateUrl: './list-members.component.html',
  styleUrl: './list-members.component.css'
})

export class ListMembersComponent {
  addIcon = faPlus;
  trashIcon = faTrash;
  contactIcon = faContactCard;
  familyIcon = faUserGroup;
  faEditIcon = faEdit
  membershipTypeId = new FormControl(2);
  form!: FormGroup;
  members: any[] = [];
  memberDetails: any;
  constructor(private manageMemberService: ManageMemberService, private memberService: MemberService, private toastr: ToastrService, private datePipe: DatePipe, private fb: FormBuilder, private sanitizer: DomSanitizer,) { }
  ngOnInit() {
    this.loadAllMembers();
    this.form = this.fb.group({
      membershipTypeId: this.membershipTypeId
    });
  }
  loadAllMembers() {
    this.manageMemberService.getAllMembers(this.membershipTypeId.value).subscribe((data) => {
      this.members = data;
      this.initializeDataTable();
    })
  }
  table: any;
  initializeDataTable() {

    setTimeout(() => {
      this.table = $('#membersDT').DataTable({
        pagingType: 'full_numbers',
        order: [[1, 'desc']],
        pageLength: 50,
        lengthMenu: [25, 50, 100, 200, 300],
        destroy: true, // ✅ This is fine now
        data: this.members,
        columns: [
          {
            data: 'memberFName',
            render: (data: any, type: any, row: any) => {
              var html = ''
              if (row.memberFName)
                html += ' ' + row.memberFName;
              if (row.memberMName)
                html += ' ' + row.memberMName;
              if (row.memberLName)
                html += ' ' + row.memberLName;
              html = `<a href='javascript:void(0);' class='goto-member' data-id='${row.memberUID}' >${html}</a>`
              return html;
            }
          },
          {
            data: 'email', render: (data: any) => data ?? ''
          },
          {
            data: 'phoneH', render: (data: any) => data ?? '',
          },
          {
            data: 'dateofBirth', render: (data: any, type: any, row: any) => {
              if (data) {
                return this.datePipe.transform(data, 'dd/MM/yyyy');
              }
              else {
                return '';
              }


            }
          },
          {
            data: 'validUpto', render: (data: any, type: any, row: any) => {
              if (data) {
                return this.datePipe.transform(data, 'dd/MM/yyyy');
              }
              else {
                return '';
              }


            }
          },
             {
            data: 'totalFees', render: (data: any, type: any, row: any) => {
              if (data) {
                return '$'+data.toFixed(2)
              }
              else {
                return '';
              }


            }
          },
          {
            data: 'lastSentDate', render: (data: any, type: any, row: any) => {
              if (data) {
                return this.datePipe.transform(data, 'dd/MM/yyyy');
              }
              else {
                return '';
              }


            }
          },
          {
            data: 'memberFName', render: (data: any, type: any, row: any) => {
              var html = `<a href='javascript:void(0);' class='14days-reminder' data-id='${row.memberUID}' data-mid='${row.memberId}' >send 30 days reminder</a> | `
              html += `<a href='javascript:void(0);' class='30days-reminder' data-id='${row.memberUID}'  data-mid='${row.memberId}' >send 14 days reminder</a>`
              return html
            }
          },
          {
            data: 'gender', render: (data: any) => data ?? ''
          },
          {
            data: 'isCompleted', render: (data: any) => `<span class="badge ${data == true ? 'badge-completed' : 'badge-incomplete'}"> ${data == true ? 'Completed' : 'Incompleted'}</span>`
          }
        ],
      });
      $('#membersDT').on('click', '.goto-member', (event: any) => {
        const id = $(event.target).data('id');

        this.loadMemberDetails(id);
      });
      $('#membersDT').on('click', '.14days-reminder', (event: any) => {
        const id = $(event.target).data('id'); // Extract the ID
        const mid = $(event.target).data('mid');// Extract the ID
        this.loadEmailTemplate(id, mid);
      });
      $('#membersDT').on('click', '.30days-reminder', (event: any) => {
        const id = $(event.target).data('id'); // Extract the ID
        const mid = $(event.target).data('mid');// Extract the ID
        this.loadEmailTemplate(id, mid);
      });
    }, 500);
  }
  loadMemberDetails(uid: any) {
    this.memberService.getMemberDetails(uid).subscribe(
      (data: any) => {
        debugger
        this.memberDetails = data;
        const modal = new bootstrap.Modal(document.getElementById('memberDetailsModal')!);
        modal.show();
      }
    )
  }
  emailTemplate!: EmailTemplate;
  memberId = 0;
  loadEmailTemplate(uid: any, mid: any) {
    this.memberService.GetReminderEmailTemplate(uid).subscribe((data) => {
      this.emailTemplate = data;
      this.memberId = mid;
      const modal = new bootstrap.Modal(document.getElementById('reminderEmailTemplate')!);
      modal.show();
    })
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.emailTemplate.email || '');
  }
  sendEmail() {
    this.memberService.SendReminderEmailTemplate(this.emailTemplate, this.memberId).subscribe((data) => {
      this.toastr.success("Send Successfully!");
    })
  }

}
