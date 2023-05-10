import { IPersonalInformation } from "../user";
// USER REQUEST

export interface GetOtherUserRequest {
    email_address?: string;
    id?: string;
}

export interface GetUserPersonalInformationRequest {}

export interface UpdatePersonalUserRequest {
    personalInformation: Partial<IPersonalInformation>,
}