import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { MemberService } from '../../../Services/member.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddFamilyMember } from '../../../Models/member-classes';
import { ToastrService } from 'ngx-toastr';
import { EmergencyContactDTO } from '../../../Models/emergency-contact-classes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faContactCard, faEdit, faPlus,faFile, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { data } from 'jquery';
@Component({
  selector: 'app-registration-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, DatePipe,RouterLink],
  providers: [DatePipe],
  templateUrl: './registration-details.component.html',
  styleUrl: './registration-details.component.css'
})
export class RegistrationDetailsComponent {
  isDateOfBirthFilled: any;
  isPaymentMethodAdded:any;

  isSposeReq: any;
  isChildReq: any;
  isParentReq: any;

  addIcon = faPlus;
  trashIcon = faTrash;
  contactIcon = faContactCard;
  familyIcon = faUserGroup;
  faEditIcon = faEdit
  faAttachmentIcon=faFile

  membershipForm!: FormGroup;
  emergencyContactForm!: FormGroup;
  selectedType: string = '';
  modalForm!: FormGroup;
  isSpouseFilled: boolean = false;
  memberDetails: any;
  memberUid: any;
  relationships: any;
  isSubmitDisabled = false;
  isInvoiceButtonDisabled = false;
  constructor(private fb: FormBuilder, private memberService: MemberService, private activatedRoute: ActivatedRoute, private toast: ToastrService,
     private router: Router, private datePipe: DatePipe,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      const newMemberUid = param.get('uid');
      if (this.memberUid != newMemberUid) {
        this.memberUid = newMemberUid;
        this.loadMemberDetails(this.memberUid);
      }
    })
    this.loadRelationships();
    this.membershipForm = this.fb.group({
      spouse: this.fb.array([]),
      children: this.fb.array([]),
      parents: this.fb.array([]),
    });

    this.modalForm = this.createMemberGroup();
    this.emergencyContactForm = this.createEmergencyContactGroup();
  }
  loadRelationships() {
    this.memberService.getAllRelationships().subscribe(
      (data: any) => {
        this.relationships = data;
      }
    )
  }
  loadMemberDetails(uid: any) {
    this.memberService.getMemberDetails(uid).subscribe(
      (data: any) => {
        debugger
        this.memberDetails = data;
        if (data.spouse)
          this.isSpouseFilled = true;
        else
          this.isSpouseFilled = false;
        if ((data.primaryMember.modeOfPayment&&data.primaryMember.accountNo&&data.primaryMember.bsb&&data.primaryMember.accountName)||data.primaryMember.modeOfPayment=="BANK TRANSFER") {
          this.isPaymentMethodAdded = true;
        }
        else {
          this.isPaymentMethodAdded = false;
        }
        if (data.primaryMember.dateofBirth && data.primaryMember.gender) {
          this.isDateOfBirthFilled = true;
        }
        else {
          this.isDateOfBirthFilled = false;
        }
      }

    )
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
    this.modalForm.reset();
    this.showBsbAndAccountNo = false;
    this.showPaymentMethodField = false;
    const modal = new bootstrap.Modal(document.getElementById('familyModal')!);
    modal.show();
  }
  openEmergencyContactModal(contact?: EmergencyContactDTO): void {
    this.emergencyContactForm.reset(); // Clear previous data

    if (contact) {
      this.emergencyContactForm.patchValue(contact); // Fill form with selected contact
    }

    const modal = new bootstrap.Modal(document.getElementById('emergencyContactModal')!);
    modal.show();
  }

  addMember(): void {
    if (this.modalForm.valid) {
      const member: AddFamilyMember = {
        ...this.modalForm.value,
        membershipTypeId: this.memberDetails.primaryMember.membershipTypeId,
        parentMemberId: this.memberDetails.primaryMember.memberId
      };

      if (this.selectedType === 'child') {
        member.relationshipId = this.modalForm.get('gender')?.value == "male" ? 3 : 4;
        member.membershipCategoryId = 2;
      } else if (this.selectedType === 'parent') {
        member.relationshipId = this.modalForm.get('gender')?.value == "male" ? 5 : 6;
        member.membershipCategoryId = 5;
      } else if (this.selectedType === 'spouse') {
        member.relationshipId = this.modalForm.get('gender')?.value == "male" ? 1 : 2;
        member.membershipCategoryId = 2;
        this.isSpouseFilled = true;
      }
      debugger;
      this.saveFamilyMember(member);
      document.getElementById('closeModal')?.click();
    }
    else {
      this.toast.error('Please fill all required fields!')
    }
  }
  saveFamilyMember(member: any) {
    this.isSubmitDisabled = true;;
    this.memberService.addFamilyMember(member).subscribe(
      (data) => {
        this.loadMemberDetails(this.memberUid);
        this.isSubmitDisabled = false;
      }
    )
  }
  removeMember(member: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        this.memberService.DeleteMember(member.memberId).subscribe((data) => {
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
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        this.memberService.deleteEmergencyContact(contact.contactId).subscribe((data) => {
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
    this.memberService.saveAndGenerateInvoice(this.memberUid).subscribe((data) => {
      // window.open(data.pdfUrl, '_blank');
      this.isInvoiceButtonDisabled = false;
      this.loadMemberDetails(this.memberUid);
    })
  }
  addEmergencyContact(): void {
    if (this.emergencyContactForm.valid) {
      this.isSubmitDisabled = true;
      const emergencyContact: EmergencyContactDTO = {
        ...this.emergencyContactForm.value,
        memberId: this.memberDetails.primaryMember.memberId
      };
      this.memberService.addEmergencyContact(emergencyContact).subscribe(
        (data) => {
          this.loadMemberDetails(this.memberUid);
          this.isSubmitDisabled = false;
        }
      )
      document.getElementById('closeEmergencyCotnactModal')?.click();
    }
    else {
      this.isSubmitDisabled = false;
      this.toast.error('Please fill all required fields!')
    }
  }
  showBsbAndAccountNo = true;
  showPaymentMethodField = true;
  openMemberEditModal(member: any): void {
    this.showBsbAndAccountNo = true;
    this.showPaymentMethodField = true;
    this.modalForm.reset();
    if (member.modeOfPayment != 'DDR') {
      this.showBsbAndAccountNo = true;
    } else {
      this.showBsbAndAccountNo = false;
    }

    if (member.parentMemberId != 0) {
      this.showBsbAndAccountNo = false;
      this.showPaymentMethodField = false;
    }
    // Convert date to YYYY-MM-DD format before patching
    const formattedDate = this.datePipe.transform(member.dateofBirth, "yyyy-MM-dd");
    this.modalForm.patchValue({
      ...member,
      dateofBirth: formattedDate // ✅ Convert date before setting
    });

    this.selectedType = member.relationshipType;

    const modal = new bootstrap.Modal(document.getElementById('familyModal')!);
    modal.show();
  }

  toogleStepAccountDetails(type:any){
    if (type == 'DDR') {
      this.showBsbAndAccountNo = true;
    } else {
      this.showBsbAndAccountNo = false;
    }
    this.cdr.detectChanges();
  }

  toogleAccountDetails() {
    var value = this.modalForm.value;
    if (value.modeOfPayment == 'DDR') {
      this.showBsbAndAccountNo = true;
    } else {
      this.showBsbAndAccountNo = false;
    }
  }
  get validationSummary(): string[] {
    const errors: string[] = [];
    const m = this.memberDetails?.primaryMember;

    if (!m?.memberFName) errors.push('Primary member first name is missing');
    if (!m?.memberLName) errors.push('Primary member last name is missing');
    if (!m?.phoneH) errors.push('Primary member phone number is missing');
    if (!m?.email) errors.push('Primary member email is missing');
    if (!m?.dateofBirth) errors.push('Primary member date of birth is missing');
    if (m.modeOfPayment == 'DDR') {
      if (!m?.bsb) errors.push('Primary member BSB is missing');
      if (!m?.accountNo) errors.push('Primary member AccountNo is missing');
    }


    return errors;
  }
}
