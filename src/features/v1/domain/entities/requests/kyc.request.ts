import { IKYCVerificationDocument, KYCVerificationDocumentType, VerificationStatusEnum } from "../user";
// KYC REQUEST

export interface UpdateKYCInformationRequest {
    kycInformation: {
        verification_document: Omit<IKYCVerificationDocument, 'status'>[]
    },
}

export interface UpdateKYCVerificationStatusRequest {
    userId: string;
    kycVerificationStatus: VerificationStatusEnum;
    kycVerificationType: KYCVerificationDocumentType;
}