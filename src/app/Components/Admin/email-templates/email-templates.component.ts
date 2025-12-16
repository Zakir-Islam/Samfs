import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EmailTemplateService } from '../../../Services/email-template.service';
import { EmailTemplate } from '../../../Models/EmailTemplate';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.css'
})
export class EmailTemplatesComponent implements OnInit {
  emailTemplatesByCategory: { [category: string]: EmailTemplate[] } = {};

  constructor(private emailTemplateService: EmailTemplateService) {}

  ngOnInit(): void {
    this.loadEmailTemplates();
  }

  loadEmailTemplates() {
    this.emailTemplateService.getAllEmailTemplates().subscribe(
      (data: EmailTemplate[]) => {
        this.emailTemplatesByCategory = this.groupByCategory(data);
    
      }
    );
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
