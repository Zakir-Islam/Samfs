// contact-list.model.ts
export interface ContactList {
  contactListId?: number;
  contactListName: string;
  contactListDescription: string;
  createdDate?: string;
  contacts?: Contact[];
}

// contact.model.ts
export interface Contact {
  contactId?: number;
  contactListId?: number;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  createdDate?: string;
}
