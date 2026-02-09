import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { EmailTemplate } from '../../../Models/EmailTemplate';
import { EmailTemplateService } from '../../../Services/email-template.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-update-email-template',
  standalone: true,
  imports: [EditorComponent, ReactiveFormsModule, FormsModule, InputTextModule, ButtonModule, SkeletonModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  templateUrl: './update-email-template.component.html',
  styleUrl: './update-email-template.component.css'
})
export class UpdateEmailTemplateComponent implements OnInit {
  emailTemplate: EmailTemplate = {};
  updateEmailTemplateForm!: FormGroup;
  isLoading: boolean = false;

  init: any = {
    base_url: '/tinymce',
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
  ) { }

  ngOnInit(): void {
    var id = this.activeRoute.snapshot.paramMap.get('id');
    this.getEmailTemplateById(id);
  }

  getEmailTemplateById(id: any) {
    this.isLoading = true;
    this.emailTemplateService.getEmailTemplate(id).subscribe({
      next: (data: EmailTemplate) => {
        this.emailTemplate = data;
        this.initializeForm(this.emailTemplate);
        this.isLoading = false;
      },
      error: (error) => {
        this.toaster.error("Failed to load template");
        this.isLoading = false;
      }
    });
  }

  initializeForm(emailTemplate: EmailTemplate): void {
    this.updateEmailTemplateForm = this.fb.group({
      emailTemplateId: [emailTemplate.emailTemplateId],
      emailTemplateName: [emailTemplate.emailTemplateName, Validators.required],
      emailTo: [emailTemplate.emailTo],
      emailCc: [emailTemplate.emailCc],
      emailBCc: [emailTemplate.emailBCc],
      subject: [emailTemplate.subject, Validators.required],
      body: [emailTemplate.body, Validators.required],
      category: [emailTemplate.category]
    });
  }

  onSubmit(isSendEmail: any): void {
    if (this.updateEmailTemplateForm.valid) {
      this.isLoading = true;
      const updatedEmailTemplate: EmailTemplate = this.updateEmailTemplateForm.value;
      updatedEmailTemplate.emailTypeId = this.emailTemplate.emailTypeId || 0;
      updatedEmailTemplate.isSendEmail = isSendEmail || false;
      this.emailTemplateService.updateEmailTemplate(updatedEmailTemplate).subscribe({
        next: response => {
          this.toaster.success("Saved successfully");
          this.isLoading = false;
          this.router.navigate(['/email-templates']);
        },
        error: error => {
          console.error('Error updating email template', error);
          this.toaster.error("Failed to update template");
          this.isLoading = false;
        }
      });
    }
  }
}
