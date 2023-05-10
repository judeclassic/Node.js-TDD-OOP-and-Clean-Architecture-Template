import { IUser, VerificationStatusEnum } from "../../../src/features/v1/domain/entities/user";

export const mockedUser: IUser = {
    id: "12345",
    personal_information: {
        name: 'Jude TestMan',
        email_address: "jude@mail.com",
        password: '123456',
    },
    kyc_Information: {
        verification_status: VerificationStatusEnum.UNVERIFIED,
        verification_document: []
    },
    setting: { email_reminder: true, pop_up_notification: true, is_information_editable: false },
    createdAt: new Date(),
    updatedAt: new Date()
}