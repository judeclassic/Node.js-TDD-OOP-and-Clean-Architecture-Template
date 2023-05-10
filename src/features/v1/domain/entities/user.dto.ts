import AuthenticatedUser from "../../../../core/interfaces/response/authenticated_user";
import { ISecureUserResponse, IUnSecuredUserResponse } from "./responses/user.response";
import { IKYCInformation, IPersonalInformation, ISettingInformation, IUser, VerificationStatusEnum } from "./user";

export class PersonnalInformationDto implements IPersonalInformation {
    name: string;
    email_address: string;
    password: string;
    phone_number?: string;
    profile_image?: string;
    access_token?: string;

    constructor(props: IPersonalInformation) {
        this.name = props.name;
        this.email_address = props.email_address;
        this.password = props.password;
        this.phone_number = props.phone_number;
        this.access_token = props.access_token;
        this.profile_image = props.profile_image;
    }

    getSecureInformation = () => {
        return {
            name: this.name,
            email_address: this.email_address,
            phone_number: this.phone_number,
            access_token: this.access_token,
            profile_image: this.profile_image
        }
    }
    
    getGeneralInformation = () => {
        return {
            name: this.name,
            phone_number: this.phone_number,
            profile_image: this.profile_image
        }
    }

    getDBInformation = () => {
        return {
            name: this.name,
            email_address: this.email_address,
            phone_number: this.phone_number,
            profile_image: this.profile_image,
            access_token: this.access_token,
            password: this.password,
        }
    }
}

export class UserDTO implements IUser {
    public id: string;
    public personal_information: PersonnalInformationDto;
    public kyc_Information: IKYCInformation;
    public setting: ISettingInformation;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: IUser) {
        this.id = props.id;
        this.personal_information = new PersonnalInformationDto(props.personal_information);
        this.kyc_Information = props.kyc_Information;
        this.setting = props.setting;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        
    }

    public getSecureUserInformation = () => {
        return {
            id: this.id,
            personal_information: this.personal_information.getSecureInformation(),
            kyc_Information: this.kyc_Information,
            setting: this.setting,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        } as ISecureUserResponse
    }

    public getGeneralUserInformation = () => {
        return {
            id: this.id,
            personal_information: this.personal_information.getGeneralInformation(),
            createdAt: this.createdAt,
        } as IUnSecuredUserResponse
    }

    public getDataBaseUserInformation = () => {
        return {
            id: this.id,
            personal_information: this.personal_information.getSecureInformation(),
            kyc_Information: this.kyc_Information,
            setting: this.setting,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }

    public getAuthenticatedUserData = () => {
        return {
            id: this.id,
            email: this.personal_information.email_address,
            password: this.personal_information.password,
        } as AuthenticatedUser
    }
}