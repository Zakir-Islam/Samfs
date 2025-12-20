export interface EmailLog {
  emailLogId: number;
  emailTypeId: number;
  recordId?: number;
  emailTo?: string;
  emailCC?: string;
  emailBCC?: string;
  subject?: string;
  body?: string;
  addedDate?: string;
}
