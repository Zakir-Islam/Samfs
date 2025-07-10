import { Role } from "./roles";

export interface User {
    userId?:number;
    email?:string;
    password?:string;
    firstName?:string;
    lastName?:string;
    phoneNumber?:string;
    mobileNumber?:string;
    roleId?:number;
    role?:Role;
}
