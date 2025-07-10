import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseApiURL } from '../Core/Constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ManageMemberService {
  baseURL = `${baseApiURL}ManageMember`;

  constructor(private http:HttpClient) { }

  getAllMembers(membershipTypeId:any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/GetAllMembers?membershipTypeId=${membershipTypeId}`);
  }

}
