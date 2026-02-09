import { Injectable } from '@angular/core';
import { baseApiURL } from '../Core/Constants/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactList } from '../Models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  baseURL = `${baseApiURL}ContactList/`;

  constructor(private http: HttpClient) { }

  GetContactListById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}GetContactListById?id=${id}`);
  }
  GetContactList(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}GetContactList`);
  }
  AddContactList(cotnactList: any): Observable<any> {

    return this.http.post<any>(`${this.baseURL}AddContactList`, cotnactList);
  }
  UpdateContactList(contactList: ContactList): Observable<any> {
    return this.http.put(`${this.baseURL}UpdateContactList`, contactList);
  }

  DeleteContactList(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}DeleteContactList?id=${id}`);
  }

}
