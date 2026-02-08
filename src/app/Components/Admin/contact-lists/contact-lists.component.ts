import { Component } from '@angular/core';
import { ContactListService } from '../../../Services/contact-list.service';
import { Contact, ContactList } from '../../../Models/contacts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contact-lists',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './contact-lists.component.html',
    styleUrl: './contact-lists.component.css'
})
export class ContactListsComponent {
 contactList: ContactList = { contactListName: '', contactListDescription: '', contacts: [] };
  newContact: Contact = { contactName: '', contactPhone: '', contactEmail: '' };
  contactLists: ContactList[] = [];
  editing = false;
  searchTerm = '';
  constructor(private contactListService: ContactListService,private toastr:ToastrService) {}

  ngOnInit(): void {
    this.loadContactLists();
  }

  loadContactLists() {
    this.contactListService.GetContactList().subscribe(res => this.contactLists = res);
  }

  editContactList(listId: number) {
      this.contactList = this.contactLists.find(x=>x.contactListId==listId)||{ contactListName: '', contactListDescription: '', contacts: [] };
      this.editing = true;
  }

  addContact() {
    if (!this.newContact.contactName) return;
    this.contactList.contacts!.push({ ...this.newContact });
    this.newContact = { contactName: '', contactPhone: '', contactEmail: '' };
  }

  removeContact(index: number) {
    this.contactList.contacts!.splice(index, 1);
  }

  saveContactList() {
    if (!this.contactList.contactListName || this.contactList.contacts!.length === 0) {
      this.toastr.warning('Enter list name and at least one contact.');
      return;
    }

    if (this.editing) {
      this.contactListService.UpdateContactList(this.contactList).subscribe(res => {
        this.toastr.success('Contact List updated!');
        this.resetForm();
      });
    } else {
      this.contactListService.AddContactList(this.contactList).subscribe(res => {
         this.toastr.success('Contact List saved!');
        this.resetForm();
      });
    }
  }

  resetForm() {
    this.contactList = { contactListName: '', contactListDescription: '', contacts: [] };
    this.editing = false;
      this.searchTerm = '';
    this.loadContactLists();
  }
  get filteredContacts() {
    if (!this.searchTerm) return this.contactList.contacts;
    return this.contactList.contacts!.filter(c =>
      c.contactName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (c.contactPhone && c.contactPhone.includes(this.searchTerm)) ||
      (c.contactEmail && c.contactEmail.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
