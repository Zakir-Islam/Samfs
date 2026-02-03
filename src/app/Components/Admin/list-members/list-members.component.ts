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
import { Router } from '@angular/router';
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
  membershipTypeId = new FormControl(0);
  status = new FormControl(0);
  form!: FormGroup;
  members: any[] = [];
  memberDetails: any;
  isDisabled = false;
  constructor(private manageMemberService: ManageMemberService, private memberService: MemberService, private toastr: ToastrService,
    private datePipe: DatePipe, private fb: FormBuilder, private sanitizer: DomSanitizer, private router: Router) { }
  ngOnInit() {
    this.loadAllMembers();
    this.form = this.fb.group({
      membershipTypeId: this.membershipTypeId,
      status: this.status
    });
    this.updateForm = this.fb.group({
      validUpto: ['']
    });
  }
  loadAllMembers() {
    this.members = [];
    this.initializeDataTable();
    this.manageMemberService.getAllMembers(this.membershipTypeId.value, this.status.value).subscribe((data) => {
      this.members = data;
      this.initializeDataTable();
      this.isLoading = false;
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
            data: 'membershipNo',
            render: (data: any, type: any, row: any) => {
              var html = ''
              html = `<a href='javascript:void(0);' class='goto-member' data-id='${row.memberUID}' >${data}</a>`
              return html;
            }
          },
          {
            data: 'membershipTypeId',
            render: (data: any, type: any, row: any) => {
              var html = ''
              html = row?.membershipTypeId == 2 ? '<span class="badge bg-warning">Family</span>' : '<span class="badge bg-info">Independent</span>'
              return html;
            }
          },
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
              html = `<a href='javascript:void(0);' class='goto-email-logs' data-id='${row.memberId}' >${html}</a>`
              return html;
            }
          },
          {
            data: 'email', render: (data: any) => data ?? ''
          },

          {
            data: 'validUpto',
            render: (data: any, type: any, row: any) => {
              return `
                ${this.datePipe.transform(data, 'dd/MM/yyyy') ?? ''}
                <br/>
                <a  data-bs-toggle="modal"
  data-bs-target="#updateValidUptoModal" href="javascript:void(0);" 
                  class="update-valid-upto"
                  data-id="${row.memberId}"
                  data-date="${data}" id='ele-${row.memberId}'>
                  Update
                </a>
              `;
            }
          },

          {
            data: 'daysRemaining',
            render: (data: any, type: any, row: any) => {

              if (data == null || data === '') {
                return '';
              }

              if (data < 30) {
                return `<span class="badge bg-danger">${data} days</span>`;
              }

              return `<span class="badge bg-success">${data} days</span>`;
            }
          },
          {
            data: 'lastOnlineInvoiceURL',
            render: (data: any, type: any, row: any) => {

              const generateInvoice = `
      <a href="javascript:void(0);" 
         class="GenInvoice ms-2" 
         data-id="${row.memberUID}" 
         title="Generate New Invoice">
         <i   data-id="${row.memberUID}" class="fa fa-plus-circle text-primary"></i>
      </a>`;

              // If last invoice exists
              if (data) {
                return `
        <a href="${data}" 
           target="_blank" 
           title="View Last Invoice">
           <i class="fa fa-file-pdf text-danger"></i>
        </a>
        ${generateInvoice}
      `;
              }

              // If last invoice does NOT exist
              return `
         <a href="javascript:void(0);" 
         class="GenInvoice ms-2" 
         data-id="${row.memberUID}" 
         title="Generate New Invoice">
         <i   data-id="${row.memberUID}" class="fa fa-plus-circle text-primary"></i>
      </a>
    `;
            }
          }

          ,
          // {
          //   data: 'totalFees', render: (data: any, type: any, row: any) => {
          //     if (data) {
          //       return '$' + data.toFixed(2)
          //     }
          //     else {
          //       return '';
          //     }


          //   }
          // },
          {
            data: 'accountNo', render: (data: any, type: any, row: any) => `${row.bsb || ''} ${row.accountNo || ''}`,
          },
          {
            data: 'modeOfPayment', render: (data: any) => data ?? '',
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
              if (row.modeOfPayment == 'BANK TRANSFER') {
                var html = `<a href='javascript:void(0);' class='14days-reminder' data-bs-toggle="modal"
  data-bs-target="#reminderEmailTemplate" data-id='${row.memberUID}' data-emtemp='Send Bank Transfer 14 days reminder' data-mid='${row.memberId}' >send 30 days reminder</a> | `
                html += `<a href='javascript:void(0);' class='30days-reminder' data-bs-toggle="modal"
  data-bs-target="#reminderEmailTemplate" data-id='${row.memberUID}' data-emtemp='Send Bank Transfer 30 days reminder'  data-mid='${row.memberId}' >send 14 days reminder</a>`
                return html
              } else {
                var html = `<a href='javascript:void(0);' class='14days-reminder' data-bs-toggle="modal"
  data-bs-target="#reminderEmailTemplate" data-id='${row.memberUID}' data-emtemp='Send DDR 14 days reminder' data-mid='${row.memberId}' >send 30 days reminder</a> | `
                html += `<a href='javascript:void(0);' class='30days-reminder' data-bs-toggle="modal"
  data-bs-target="#reminderEmailTemplate" data-id='${row.memberUID}' data-emtemp='Send DDR 30 days reminder'  data-mid='${row.memberId}' >send 14 days reminder</a>`
                return html
              }

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

        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/admin-registration-details', id])
        );

        window.open(url, '_blank');
        // this.loadMemberDetails(id);
      });
      $('#membersDT').on('click', '.goto-email-logs', (event: any) => {
        const id = $(event.target).data('id');

        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/email-logs', id])
        );

        window.open(url, '_blank');
      });
      $('#membersDT').on('click', '.update-valid-upto', (event: any) => {
        const memberId = $(event.target).data('id');
        const validUpto = $(event.target).data('date');

        this.openUpdateValidUptoModal(memberId, validUpto);
      });
      $('#membersDT').on('click', '.GenInvoice', (event: any) => {
        const muid = $(event.target).data('id');

        this.saveAndGenerateInvoice(muid);
      });

      $('#membersDT').on('click', '.14days-reminder', (event: any) => {
        const id = $(event.target).data('id'); // Extract the ID
        const mid = $(event.target).data('mid');// Extract the ID
        const emTemp = $(event.target).data('emtemp');
        this.loadEmailTemplate(id, mid, emTemp);
      });
      $('#membersDT').on('click', '.30days-reminder', (event: any) => {
        const id = $(event.target).data('id'); // Extract the ID
        const mid = $(event.target).data('mid');// Extract the ID
        const emTemp = $(event.target).data('emtemp');
        this.loadEmailTemplate(id, mid, emTemp);
      });
    }, 500);
  }
  isLoading = false;

  saveAndGenerateInvoice(memberUid: any) {
    this.isLoading = true; // 👈 show spinner
    this.memberService.saveAndGenerateInvoice(memberUid).subscribe((data) => {
      this.loadAllMembers();
      // 👈 hide spinner
    })
  }
  loadMemberDetails(uid: any) {
    this.memberService.getMemberDetails(uid).subscribe(
      (data: any) => {
        debugger
        this.memberDetails = data;
        // const modal = new bootstrap.Modal(document.getElementById('memberDetailsModal')!);
        // modal.show();
      }
    )
  }
  emailTemplate!: EmailTemplate;
  memberId = 0;
  loadEmailTemplate(uid: any, mid: any, templateName: any) {
    this.memberService.GetReminderEmailTemplate(uid, templateName).subscribe((data) => {
      this.emailTemplate = data;
      this.memberId = mid;
      // const modal = new bootstrap.Modal(document.getElementById('reminderEmailTemplate')!);
      // modal.show();
    })
  }

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.emailTemplate.email || '');
  }
  sendEmail() {
    this.isDisabled = true;
    this.memberService.SendReminderEmailTemplate(this.emailTemplate, this.memberId).subscribe((data) => {
      this.toastr.success("Send Successfully!");
      this.isDisabled = false;
    })
  }

  updateMemberId!: number;
  updateForm!: FormGroup;

  openUpdateValidUptoModal(memberId: number, validUpto: any) {
    this.updateMemberId = memberId;
    if (validUpto != "undefined") {
      this.updateForm.patchValue({
        validUpto: this.datePipe.transform(validUpto, 'yyyy-MM-dd')
      });

    }

    // const modal = new bootstrap.Modal(
    //   document.getElementById('updateValidUptoModal')!
    // );
    // modal.show();
  }

  updateValidUpto() {
    const validUpto = this.updateForm.value.validUpto;

    this.manageMemberService.updateValidUpto(this.updateMemberId, validUpto)
      .subscribe(() => {
        this.toastr.success('Valid Upto updated successfully');
       let member=this.members.find(x=>x.memberId==this.updateMemberId);
       member.validUpto=validUpto;
       this.initializeDataTable();
        // this.hideValidUpto();

        // location.reload(); // refresh table
      });
  }



}
