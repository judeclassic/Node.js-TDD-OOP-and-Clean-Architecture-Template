import { IPersonalInformation, IUser } from "../user";

export interface ISecureUserResponse extends IUser {}

export interface IUnSecuredUserResponse {
    id: string;
    personal_information: Omit<IPersonalInformation, 'password'>;
    createdAt: Date;
}