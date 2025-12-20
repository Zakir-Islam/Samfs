import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseApiURL } from '../Core/Constants/constant';
import { EmailTemplate } from '../Models/email-template';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseURL = `${baseApiURL}Member`;

  constructor(private http:HttpClient) { }
  registerMember(member:any): Observable<any> {
    return this.http.post(`${this.baseURL}/RegisterMember`, member);
  }
  getMemberDetails(uid:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetMemberDetails?uid=${uid}`);
  }
  addFamilyMember(member:any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/addFamilyMember`, member);
  }
  DeleteMember(memberId:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/DeleteMember?memberId=${memberId}`);
  }
  deleteEmergencyContact(emergencyContactId:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/DeleteEmergencyContact?emergencyContactId=${emergencyContactId}`);
  }
  addEmergencyContact(emergencyContact:any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/AddEmergencyContact`, emergencyContact);
  }
  getAllRelationships(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetAllRelationships`);
  }
  saveAndGenerateInvoice(uid:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/SaveAndGenerateInvoice?uid=${uid}`);
  }
    GetReminderEmailTemplate(memberUid:any,templateName:any): Observable<EmailTemplate> {
      debugger;
    return this.http.get<EmailTemplate>(`${this.baseURL}/GetReminderEmailTemplate?memberUid=${memberUid}&templateName=${templateName}`);
  }
  SendReminderEmailTemplate(emailTemplateDTO:any,memberId:any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/SendReminderEmailTemplate?memberId=${memberId}`,emailTemplateDTO);
  }
}
