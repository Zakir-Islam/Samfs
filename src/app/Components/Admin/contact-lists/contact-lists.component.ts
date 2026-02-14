import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListService } from '../../../Services/contact-list.service';
import { Contact, ContactList } from '../../../Models/contacts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PageHeaderComponent } from '../../Shared/page-header/page-header.component';

@Component({
  selector: 'app-contact-lists',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TableModule, InputTextModule, ButtonModule, ConfirmDialogModule, PageHeaderComponent],
  providers: [ConfirmationService],
  templateUrl: './contact-lists.component.html',
  styleUrl: './contact-lists.component.css'
})
export class ContactListsComponent implements OnInit {
  contactList: ContactList = { contactListName: '', contactListDescription: '', contacts: [] };
  newContact: Contact = { contactName: '', contactPhone: '', contactEmail: '' };
  contactLists: ContactList[] = [];
  editing = false;
  searchTerm = '';
  isLoading: boolean = false;

  constructor(private contactListService: ContactListService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadContactLists();
  }

  loadContactLists() {
    this.isLoading = true;
    this.contactListService.GetContactList().subscribe({
      next: (res: any) => {
        this.contactLists = res;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading contact lists', error);
        this.isLoading = false;
      }
    });
  }

  editContactList(list: ContactList) {
    this.contactList = { ...list, contacts: [...(list.contacts || [])] };
    this.editing = true;
  }

  addContact() {
    if (!this.newContact.contactName || !this.newContact.contactEmail) {
      this.toastr.warning('Please enter name and email');
      return;
    }
    this.contactList.contacts!.push({ ...this.newContact });
    this.newContact = { contactName: '', contactPhone: '', contactEmail: '' };
  }

  removeContact(index: number) {
    this.contactList.contacts!.splice(index, 1);
  }

  deleteContactList(id: number | undefined): void {
    if (id !== undefined && confirm('Are you sure you want to delete this contact list?')) {
      this.isLoading = true;
      this.contactListService.DeleteContactList(id).subscribe({
        next: () => {
          this.toastr.success('Contact List deleted!');
          this.loadContactLists();
        },
        error: (err: any) => {
          console.error('Error deleting contact list', err);
          this.toastr.error('Failed to delete contact list.');
          this.isLoading = false;
        }
      });
    }
  }

  saveContactList() {
    if (!this.contactList.contactListName || this.contactList.contacts!.length === 0) {
      this.toastr.warning('Enter list name and at least one contact.');
      return;
    }

    this.isLoading = true;
    if (this.editing) {
      this.contactListService.UpdateContactList(this.contactList).subscribe({
        next: (res: any) => {
          this.toastr.success('Contact List updated!');
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Error updating contact list', err);
          this.toastr.error('Failed to update contact list.');
          this.isLoading = false;
        }
      });
    } else {
      this.contactListService.AddContactList(this.contactList).subscribe({
        next: (res: any) => {
          this.toastr.success('Contact List saved!');
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Error creating contact list', err);
          this.toastr.error('Failed to create contact list.');
          this.isLoading = false;
        }
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
