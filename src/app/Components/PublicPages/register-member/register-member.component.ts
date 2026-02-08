import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../../Services/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-register-member',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    PanelModule
  ],
  templateUrl: './register-member.component.html',
  styleUrl: './register-member.component.css'
})
export class RegisterMemberComponent {
  membershipForm!: FormGroup;
  isSubmitDisabled: boolean = false;
  isFamily: boolean = false;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.membershipForm = this.fb.group({
      memberShipTypeName: ['individual', Validators.required],
      memberFName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      memberMName: [''],
      memberLName: ['', Validators.required],
      phoneH: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.membershipForm.valid) {
      this.isSubmitDisabled = true;
      this.memberService.registerMember(this.membershipForm.value).subscribe({
        next: (data: any) => {
          this.toastr.success("Saved Successfully");
          this.router.navigate(['/registration-details', data.uid]);
          this.isSubmitDisabled = false;
        },
        error: () => {
          this.toastr.error("Failed to register member");
          this.isSubmitDisabled = false;
        }
      });
    } else {
      this.toastr.error("Please fill required fields!");
    }
  }
}
