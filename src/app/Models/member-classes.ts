
export interface RegisterMember{
    memberShipTypeName:number;
    memberFName:string;
    memberMName:string;
    memberLName:string;
    phoneH:string;
    dateofBirth:Date;
    gender:string;
}
export interface AddFamilyMember{
    memberId?:number;
    memberFName?:string;
    memberMName?:string;
    memberLName?:string;
    phoneH?:string;
    dateofBirth?:Date;
    relationshipId?:number;
    membershipTypeId?:number;
    parentMemberId?:number;
    membershipCategoryId?:number;
}