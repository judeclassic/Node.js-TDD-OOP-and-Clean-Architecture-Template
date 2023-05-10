import { IPersonalInformation } from "../user";

// AUTH REQUEST

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface RegisterRegularUserRequest {
    personalInformation: IPersonalInformation,
}