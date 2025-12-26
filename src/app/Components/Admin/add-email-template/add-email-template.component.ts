import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { EmailTemplate } from '../../../Models/EmailTemplate';
import { EmailTemplateService } from '../../../Services/email-template.service';
@Component({
  selector: 'app-add-email-template',
  standalone: true,
  imports: [EditorComponent, CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  templateUrl: './add-email-template.component.html',
  styleUrl: './add-email-template.component.css'
})
export class AddEmailTemplateComponent implements OnInit {
  emailTemplate: EmailTemplate = {};
  updateEmailTemplateForm!: FormGroup;
  init: EditorComponent['init'] = {
    /* ... */
    base_url: '/tinymce', // Root for resources
    suffix: '.min',
    height: 500,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
  };
  constructor(
    private fb: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.initializeForm();
  }


  initializeForm(): void {
    this.updateEmailTemplateForm = this.fb.group({
      emailTemplateId: [],
      emailTemplateName: ['', Validators.required],
      emailTo: [''],
      emailCc: [''],
      emailBCc: [''],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      category: ['']

    });
  }
  onSubmit(): void {
    if (this.updateEmailTemplateForm.valid) {
      const updatedEmailTemplate: EmailTemplate = this.updateEmailTemplateForm.value;
      updatedEmailTemplate.emailTypeId = this.emailTemplate.emailTypeId || 0
        updatedEmailTemplate.emailTemplateId=0;
      this.emailTemplateService.AddEmailTemplate(updatedEmailTemplate).subscribe(
        response => {
          this.toaster.success("saved successfully")
          this.router.navigate(['/email-templates']); // Navigate to the list or another relevant page
        },
        error => {
          console.error('Error updating email template', error);
        }
      );
    }
  }
}
