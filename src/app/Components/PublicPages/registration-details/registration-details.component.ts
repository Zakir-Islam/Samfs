import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../../Services/member.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddFamilyMember } from '../../../Models/member-classes';
import { ToastrService } from 'ngx-toastr';
import { EmergencyContactDTO } from '../../../Models/emergency-contact-classes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faContactCard, faEdit, faPlus, faFile, faTrash, faUserGroup, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-registration-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DatePipe,
    RouterLink,
    DialogModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    SelectModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [DatePipe],
  templateUrl: './registration-details.component.html',
  styleUrl: './registration-details.component.css'
})
export class RegistrationDetailsComponent implements OnInit {
  isDateOfBirthFilled: any;
  isPaymentMethodAdded: any;

  isSposeReq: any;
  isChildReq: any;
  isParentReq: any;

  addIcon = faPlus;
  trashIcon = faTrash;
  contactIcon = faContactCard;
  familyIcon = faUserGroup;
  faEditIcon = faEdit;
  faAttachmentIcon = faFile;
  faWarnIcon = faExclamationTriangle;

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

  displayFamilyModal: boolean = false;
  displayEmergencyModal: boolean = false;

  showBsbAndAccountNo = true;
  showPaymentMethodField = true;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
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
    this.memberService.getMemberDetails(uid).subscribe({
      next: (data: any) => {
        this.memberDetails = data;
        this.isSpouseFilled = !!data.spouse;

        const m = data.primaryMember;
        this.isPaymentMethodAdded = (m.modeOfPayment && m.accountNo && m.bsb && m.accountName) || m.modeOfPayment === "BANK TRANSFER";
        this.isDateOfBirthFilled = !!(m.dateofBirth && m.gender);

        this.cdr.detectChanges();
      },
      error: () => this.toast.error("Failed to load member details")
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
      phoneH: [''],
      modeOfPayment: [''],
      bsb: [''],
      accountNo: [''],
      accountName: [''],
      isActive: [false],
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
    this.modalForm.reset({ memberId: 0, isActive: false });
    this.showBsbAndAccountNo = false;
    this.showPaymentMethodField = false;
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
        this.isSpouseFilled = true;
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
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ef4444'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.memberService.DeleteMember(member.memberId).subscribe({
          next: (data: any) => {
            if (data == 1) {
              Swal.fire('Deleted!', 'Your family member has been deleted.', 'success');
              this.loadMemberDetails(this.memberUid);
            }
          }
        });
      }
    });
  }

  removeEmergencyCotnact(contact: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ef4444'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.memberService.deleteEmergencyContact(contact.contactId).subscribe({
          next: (data: any) => {
            if (data == 1) {
              Swal.fire('Deleted!', 'Your contact has been deleted.', 'success');
              this.loadMemberDetails(this.memberUid);
            }
          }
        });
      }
    });
  }

  saveAndGenerateInvoice(): void {
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
    this.showBsbAndAccountNo = true;
    this.showPaymentMethodField = true;
    this.modalForm.reset();

    this.showBsbAndAccountNo = (member.modeOfPayment === 'DDR');

    if (member.parentMemberId != 0) {
      this.showBsbAndAccountNo = false;
      this.showPaymentMethodField = false;
    }

    const formattedDate = this.datePipe.transform(member.dateofBirth, "yyyy-MM-dd");
    this.modalForm.patchValue({
      ...member,
      dateofBirth: formattedDate
    });

    this.selectedType = member.relationshipType || '';
    this.displayFamilyModal = true;
  }

  toogleStepAccountDetails(type: any): void {
    this.showBsbAndAccountNo = (type === 'DDR');
    this.cdr.detectChanges();
  }

  toogleAccountDetails(): void {
    const value = this.modalForm.value;
    this.showBsbAndAccountNo = (value.modeOfPayment === 'DDR');
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
