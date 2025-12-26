import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseApiURL } from '../Core/Constants/constant';
import { EmailTemplate } from '../Models/email-template';


@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
  
  baseURL=`${baseApiURL}EmailTemplate`;
  constructor(private http:HttpClient) {}
  getAllEmailTemplates(): Observable<EmailTemplate[]> {
      return this.http.get<EmailTemplate[]>(this.baseURL);
  }
  getEmailTemplate(emailTemplateId:any): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`${this.baseURL}/${emailTemplateId}`);
  }
  updateEmailTemplate(emailTemplate:any): Observable<any> {
    return this.http.put<any>(`${this.baseURL}/${emailTemplate.emailTemplateId}`,emailTemplate);
  }
  AddEmailTemplate(emailTemplate:any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}`,emailTemplate);
  }
}
