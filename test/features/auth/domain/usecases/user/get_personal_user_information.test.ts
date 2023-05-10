import {describe, expect, test, jest } from '@jest/globals';

import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import GetUserPersonalInformation from '../../../../../../src/features/v1/domain/usecases/user/get_personal_user_information'
import { GetUserPersonalInformationRequest } from '../../../../../../src/features/v1/domain/entities/requests/user.request'
import MockAuthValidator from '../../../../../mock/repositories/validators/index.mock';
import MockEncryptionRepository from '../../../../../mock/repositories/encryption';
import MockUserDBModel from '../../../../../mock/repositories/database/models/user.model.mock';
import { IUser } from '../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from '../../../../../mock/entities/user.mock';
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto';
import MockEventBusRepository from '../../../../../mock/repositories/event-bus';
import AuthenticatedUser from '../../../../../../src/core/interfaces/response/authenticated_user';
import { ISecureUserResponse } from '../../../../../../src/features/v1/domain/entities/responses/user.response';


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

    test('this user should login successfully', async () => {
        const getUserPersonalInformation = new GetUserPersonalInformation({ userDBModelRepository });

        const request: GetUserPersonalInformationRequest = {}

        const sendResponse = jest.fn((response: ResponseInterface<ISecureUserResponse>) => {});

        await getUserPersonalInformation.execute( request, authenticatedUser, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(true);
        expect((sendResponse.mock.calls[0][0] as { status: true, data: IUser}).data?.personal_information?.name).toBe(mockedUser.personal_information.name);
    })
})