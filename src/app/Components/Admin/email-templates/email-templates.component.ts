import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmailTemplateService } from '../../../Services/email-template.service';
import { EmailTemplate } from '../../../Models/EmailTemplate';

import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../Shared/page-header/page-header.component';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, PageHeaderComponent],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.css'
})
export class EmailTemplatesComponent implements OnInit {
  emailTemplates: { [key: string]: EmailTemplate[] } = {};
  isLoading: boolean = false;

  constructor(private emailTemplateService: EmailTemplateService) { }

  ngOnInit(): void {
    this.getAllEmailTemplates();
  }

  getAllEmailTemplates(): void {
    this.isLoading = true;
    this.emailTemplateService.getAllEmailTemplates().subscribe({
      next: (data: EmailTemplate[]) => {
        this.isLoading = false;
        this.emailTemplates = this.groupByCategory(data);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error fetching email templates', error);
      }
    });
  }

  groupByCategory(emailTemplates: EmailTemplate[]): { [category: string]: EmailTemplate[] } {
    return emailTemplates.reduce((acc, emailTemplate) => {
      const category = emailTemplate.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(emailTemplate);
      return acc;
    }, {} as { [category: string]: EmailTemplate[] });
  }
}
