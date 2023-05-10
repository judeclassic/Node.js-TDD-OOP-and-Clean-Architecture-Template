import { Schema, model } from "mongoose";
import { IKYCInformation, KYCVerificationDocumentType, IPersonalInformation, ISettingInformation, IUser, VerificationStatusEnum } from "../../../../domain/entities/user";

const PersonalInformationSchema =  new Schema<IPersonalInformation>({
    name: {
        type: String,
    },
    email_address: {
        type: String,
    },
    password: {
        type: String,
    }
});

const KYCInformationSchema = new Schema<IKYCInformation>( {
    verification_status: {
        type: String,
        enum: Object.values(VerificationStatusEnum)
    },
    verification_document: [{ 
        type: {
            type: String,
            enum: Object.values(KYCVerificationDocumentType)
        },
        source: {
            type: String
        },
        status: {
            type: String,
            enum: Object.values(VerificationStatusEnum)
        }
    }]
});

const SettingInformationSchema = new Schema<ISettingInformation>({
    email_reminder: Boolean,
    pop_up_notification: Boolean,
    is_information_editable: Boolean
})


export interface UserModel extends Omit<IUser, 'id'> { _id: string };

const UserSchema = new Schema<UserModel>({
    personal_information: PersonalInformationSchema,
    kyc_Information: KYCInformationSchema,
    setting: SettingInformationSchema,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    }
});

const UserDBModel = model('User', UserSchema);

export default UserDBModel;