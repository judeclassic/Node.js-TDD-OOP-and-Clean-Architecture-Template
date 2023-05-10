import {describe, expect, test, jest } from '@jest/globals';

import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import UpdateUserKycInformation from '../../../../../../src/features/v1/domain/usecases/kyc/update_kyc_verification';
import MockAuthValidator from '../../../../../mock/repositories/validators/index.mock';
import MockEncryptionRepository from '../../../../../mock/repositories/encryption';
import MockUserDBModel from '../../../../../mock/repositories/database/models/user.model.mock';
import { IKYCInformation, KYCVerificationDocumentType, IUser, VerificationStatusEnum } from '../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from '../../../../../mock/entities/user.mock';
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto';
import MockEventBusRepository from '../../../../../mock/repositories/event-bus';
import AuthenticatedUser from '../../../../../../src/core/interfaces/response/authenticated_user';
import { UpdateKYCInformationRequest } from '../../../../../../src/features/v1/domain/entities/requests/kyc.request';


describe('Testing login user usecase', () => { 
    const authValidator: MockAuthValidator = new MockAuthValidator();
    const encryptionRepository: MockEncryptionRepository = new MockEncryptionRepository();
    const eventBusRepository: MockEventBusRepository = new MockEventBusRepository();
    const userDBModelRepository: MockUserDBModel = new MockUserDBModel();

    const authenticatedUser: AuthenticatedUser = {
            id: '1234',
            email: 'jude@mail.com',
            password: '12345'
        }

    authValidator.validateKycInformation.mockReturnValue((async () => [])());
    encryptionRepository.comparePassword.mockReturnValueOnce(true);
    encryptionRepository.encryptToken.mockReturnValue('00000000');
    userDBModelRepository.checkIfUserExist.mockReturnValueOnce((async () => ({status: true, data: new UserDTO(mockedUser)}))());

    const newUserAfterDataChanged = mockedUser;
    (newUserAfterDataChanged.kyc_Information as IKYCInformation) = {
        verification_status: VerificationStatusEnum.PENDING,
        verification_document: [{
            type: KYCVerificationDocumentType.BVN,
            source: 'https://source.com/image.png',
            status: VerificationStatusEnum.PENDING
        }]
    };

    userDBModelRepository.updateUserDetailsToDB.mockReturnValue((async () => ({status: true, data: new UserDTO(newUserAfterDataChanged)}))());

    test('this user should login successfully', async () => {
        const updateUserBusinessInformation = new UpdateUserKycInformation({ authValidator, eventBusRepository, userDBModelRepository });

        const request: UpdateKYCInformationRequest = {
            kycInformation: {
                verification_document: [{
                    type: KYCVerificationDocumentType.BVN,
                    source: 'https://source.com/image.png'
                }]
            }
        }

        const sendResponse = jest.fn((response: ResponseInterface<IUser>) => {});

        await updateUserBusinessInformation.execute( request, authenticatedUser, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(true);
        expect((sendResponse.mock.calls[0][0] as { status: true, data: IUser}).data?.kyc_Information?.verification_document[0].type)
            .toBe(request.kycInformation?.verification_document[0].type);
    })
})