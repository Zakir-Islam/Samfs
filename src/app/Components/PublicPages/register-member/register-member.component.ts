
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterMember } from '../../../Models/member-classes';
import { MemberService } from '../../../Services/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-member',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './register-member.component.html',
    styleUrl: './register-member.component.css'
})
export class RegisterMemberComponent {
  membershipForm!: FormGroup;
  isSubmitDisabled!:boolean;
  isFamily: boolean = false;

  constructor(private fb: FormBuilder,private memberService:MemberService,private toastr:ToastrService,private router:Router) {
 
  }
  ngOnInit(){
    this.isSubmitDisabled=false;
    this.membershipForm = this.fb.group({
      memberShipTypeName:['individual',Validators.required],
      memberFName: ['', Validators.required],
      email: ['', Validators.required],
      memberMName: ['',],
      memberLName: ['', Validators.required],
      phoneH: ['', Validators.required],
      // gender: [''],
      // dateofBirth: ['']
    });
  }
  submitForm() {
    if (this.membershipForm.valid) {
      this.isSubmitDisabled=true;
      this.memberService.registerMember(this.membershipForm.value).subscribe(
        (data)=>{
           this.toastr.success("Saved Successfully");
           this.router.navigate(['/registration-details',data.uid]);
           this.isSubmitDisabled=false;
        }
      );
    } else {
      this.toastr.error("Please fill required fields!");
      this.isSubmitDisabled=false;
    }
  }
}
