export interface MemberAttachment {
  memberAttachmentId: number;
  memberId: number;
  attachmentType: number;
  fileName: string;
  s3Key: string;
  addedDate: string;
}

export enum AttachmentType {
  Driving_License = 1,
  Passport = 2,
  Other = 3
}
