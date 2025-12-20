import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseApiURL } from '../Core/Constants/constant';
import { EmailLog } from '../Models/email-log';

@Injectable({
  providedIn: 'root'
})
export class ManageMemberService {
  baseURL = `${baseApiURL}ManageMember`;

  constructor(private http:HttpClient) { }

  getAllMembers(membershipTypeId:any,status:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetAllMembers?membershipTypeId=${membershipTypeId}&status=${status}`);
  }
    updateValidUpto(updateMemberId:any,validUpto:any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/update-valid-upto?memberId=${updateMemberId}&validUpto=${validUpto}`,null);
  }
  
  getEmailLogsByRecordId(recordId: any,typeId:any): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(`${this.baseURL}/getEmailLogsByRecordId?recordId=${recordId}&typeId=${typeId}`);
  }
    GetMemberById(memberId: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetMemberById?memberId=${memberId}`);
  }
}
