import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../../Services/member.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddFamilyMember } from '../../../Models/member-classes';
import { ToastrService } from 'ngx-toastr';
import { EmergencyContactDTO } from '../../../Models/emergency-contact-classes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faContactCard, faEdit, faFile, faPlus, faTrash, faUserGroup, faExclamationTriangle, faPaperclip, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../Shared/page-header/page-header.component';


@Component({
  selector: 'app-admin-registration-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterLink,
    DatePipe,
    DialogModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    SelectModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    PageHeaderComponent
  ],
  providers: [DatePipe],
  templateUrl: './admin-registration-details.component.html',
  styleUrl: './admin-registration-details.component.css'
})
export class AdminRegistrationDetailsComponent implements OnInit {
  faAttachmentIcon = faPaperclip;
  addIcon = faPlus;
  trashIcon = faTrash;
  contactIcon = faContactCard;
  familyIcon = faUserGroup;
  faEditIcon = faEdit;
  faWarnIcon = faExclamationTriangle;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  membershipForm!: FormGroup;
  emergencyContactForm!: FormGroup;
  modalForm!: FormGroup;

  selectedType: string = '';
  isSpouseFilled: boolean = false;
  memberDetails: any;
  memberUid: any;
  relationships: any[] = [];

  isSubmitDisabled = false;
  isInvoiceButtonDisabled = false;
  isLoading = false;

  displayFamilyModal: boolean = false;
  displayEmergencyModal: boolean = false;

  showBsbAndAccountNo = true;

  isFamilyExpanded = true;
  isEmergencyExpanded = true;
  isBankExpanded = true;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param: any) => {
      const newMemberUid = param.get('uid');
      if (this.memberUid != newMemberUid) {
        this.memberUid = newMemberUid;
        this.loadMemberDetails(this.memberUid);
      }
    });

    this.loadRelationships();

    this.membershipForm = this.fb.group({
      spouse: this.fb.array([]),
      children: this.fb.array([]),
      parents: this.fb.array([]),
    });

    this.modalForm = this.createMemberGroup();
    this.emergencyContactForm = this.createEmergencyContactGroup();
  }

  loadRelationships(): void {
    this.memberService.getAllRelationships().subscribe({
      next: (data: any) => this.relationships = data,
      error: () => this.toast.error("Failed to load relationships")
    });
  }

  loadMemberDetails(uid: any): void {
    this.isLoading = true;
    this.memberService.getMemberDetails(uid).subscribe({
      next: (data: any) => {
        this.memberDetails = data;
        this.isSpouseFilled = !!data.spouse;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error("Failed to load member details");
      }
    });
  }

  createMemberGroup(): FormGroup {
    return this.fb.group({
      memberId: [0],
      memberFName: ['', Validators.required],
      memberMName: [''],
      memberLName: ['', Validators.required],
      gender: ['', Validators.required],
      dateofBirth: ['', Validators.required],
      phoneH: ['', Validators.required],
      modeOfPayment: [''],
      bsb: [''],
      accountNo: [''],
      accountName: [''],
      isActive: [true],
    });
  }

  createEmergencyContactGroup(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      relationshipId: ['', Validators.required],
      contactId: [0]
    });
  }

  get spouse(): FormArray {
    return this.membershipForm.get('spouse') as FormArray;
  }

  get children(): FormArray {
    return this.membershipForm.get('children') as FormArray;
  }

  get parents(): FormArray {
    return this.membershipForm.get('parents') as FormArray;
  }

  openModal(type: string): void {
    this.selectedType = type;
    this.modalForm.reset({ memberId: 0, isActive: true });
    this.displayFamilyModal = true;
  }

  openEmergencyContactModal(contact?: EmergencyContactDTO): void {
    this.emergencyContactForm.reset({ contactId: 0 });
    if (contact) {
      this.emergencyContactForm.patchValue(contact);
    }
    this.displayEmergencyModal = true;
  }

  addMember(): void {
    if (this.modalForm.valid) {
      const member: AddFamilyMember = {
        ...this.modalForm.value,
        membershipTypeId: this.memberDetails.primaryMember.membershipTypeId,
        parentMemberId: this.memberDetails.primaryMember.memberId
      };

      if (this.selectedType === 'child') {
        member.relationshipId = this.modalForm.get('gender')?.value?.toLowerCase() === "male" ? 3 : 4;
        member.membershipCategoryId = 2;
      } else if (this.selectedType === 'parent') {
        member.relationshipId = this.modalForm.get('gender')?.value?.toLowerCase() === "male" ? 5 : 6;
        member.membershipCategoryId = 5;
      } else if (this.selectedType === 'spouse') {
        member.relationshipId = this.modalForm.get('gender')?.value?.toLowerCase() === "male" ? 1 : 2;
        member.membershipCategoryId = 2;
      }

      this.saveFamilyMember(member);
    } else {
      this.toast.error('Please fill all required fields!');
    }
  }

  saveFamilyMember(member: any): void {
    this.isSubmitDisabled = true;
    this.memberService.addFamilyMember(member).subscribe({
      next: () => {
        this.loadMemberDetails(this.memberUid);
        this.isSubmitDisabled = false;
        this.displayFamilyModal = false;
      },
      error: () => {
        this.toast.error("Failed to save member");
        this.isSubmitDisabled = false;
      }
    });
  }

  removeMember(member: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove this family member!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.memberService.DeleteMember(member.memberId).subscribe((data: any) => {
          if (data == 1) {
            Swal.fire('Deleted!', 'Your family member has been deleted.', 'success');
            this.loadMemberDetails(this.memberUid);
          }
        });
      }
    });
  }

  removeEmergencyCotnact(contact: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove this emergency contact!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.memberService.deleteEmergencyContact(contact.contactId).subscribe((data: any) => {
          if (data == 1) {
            Swal.fire('Deleted!', 'Your contact has been deleted.', 'success');
            this.loadMemberDetails(this.memberUid);
          }
        });
      }
    });
  }

  saveAndGenerateInvoice() {
    this.isInvoiceButtonDisabled = true;
    this.memberService.saveAndGenerateInvoice(this.memberUid).subscribe({
      next: () => {
        this.toast.success("Invoice generated successfully");
        this.isInvoiceButtonDisabled = false;
        this.loadMemberDetails(this.memberUid);
      },
      error: () => {
        this.toast.error("Failed to generate invoice");
        this.isInvoiceButtonDisabled = false;
      }
    });
  }

  addEmergencyContact(): void {
    if (this.emergencyContactForm.valid) {
      this.isSubmitDisabled = true;
      const emergencyContact: EmergencyContactDTO = {
        ...this.emergencyContactForm.value,
        memberId: this.memberDetails.primaryMember.memberId
      };
      this.memberService.addEmergencyContact(emergencyContact).subscribe({
        next: () => {
          this.loadMemberDetails(this.memberUid);
          this.isSubmitDisabled = false;
          this.displayEmergencyModal = false;
        },
        error: () => {
          this.toast.error("Failed to save contact");
          this.isSubmitDisabled = false;
        }
      });
    } else {
      this.toast.error('Please fill all required fields!');
    }
  }

  openMemberEditModal(member: any): void {
    this.modalForm.reset();

    const formattedDate = this.datePipe.transform(member.dateofBirth, "yyyy-MM-dd");
    this.modalForm.patchValue({
      ...member,
      dateofBirth: formattedDate
    });

    this.selectedType = member.relationshipType || '';
    this.displayFamilyModal = true;
  }


  get validationSummary(): string[] {
    const errors: string[] = [];
    const m = this.memberDetails?.primaryMember;
    if (!m) return [];

    if (!m.memberFName) errors.push('Primary member first name is missing');
    if (!m.memberLName) errors.push('Primary member last name is missing');
    if (!m.phoneH) errors.push('Primary member phone number is missing');
    if (!m.email) errors.push('Primary member email is missing');
    if (!m.dateofBirth) errors.push('Primary member date of birth is missing');
    if (m.modeOfPayment === 'DDR') {
      if (!m.bsb) errors.push('Primary member BSB is missing');
      if (!m.accountNo) errors.push('Primary member AccountNo is missing');
    }
    return errors;
  }
}
