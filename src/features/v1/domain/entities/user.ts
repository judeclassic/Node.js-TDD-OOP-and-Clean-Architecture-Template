
// ACCOUNT_TYPE_INFORMATION

// FOR ALL USERS

export interface IPersonalInformation {
    name: string;
    email_address: string;
    phone_number?: string;
    password: string;
    profile_image?: string;
    access_token?: string;
}

export enum VerificationStatusEnum {
    UNVERIFIED = "Unverified",
    PENDING = "Pending",
    VERIFIED = "Verified",
    REJECTED = "Rejected",
    EXPIRED = "Expired",
    SUSPENDED = "Suspended",
    CANCELLED = "Cancelled"
}

//KYC VERIFICATION DETAILS

export enum KYCVerificationDocumentType {
    national_identification_card = "National Indentification Card",
    NIN_slip = "NIN Slip",
    BVN = "BVN",
}

export interface IKYCVerificationDocument { 
    type: KYCVerificationDocumentType,
    source: string,
    status: VerificationStatusEnum
}

export interface IKYCInformation {
    verification_status: VerificationStatusEnum,
    verification_document: IKYCVerificationDocument[]
}

// EXTRA DETAILS FOR USER SETTINGS

export interface ISettingInformation {
    email_reminder: boolean,
    pop_up_notification: boolean,
    is_information_editable: boolean;
}

// MAIN USER ENTITY

export interface IUser {
    id: string;
    personal_information: IPersonalInformation;
    kyc_Information: IKYCInformation;
    setting: ISettingInformation;
    createdAt: Date;
    updatedAt: Date;
}