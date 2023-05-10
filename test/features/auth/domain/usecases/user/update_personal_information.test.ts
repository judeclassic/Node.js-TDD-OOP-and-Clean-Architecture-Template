import {describe, expect, test, jest } from '@jest/globals';

import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import UpdateUserPersonalInformation from '../../../../../../src/features/v1/domain/usecases/user/update_personal_information'
import { UpdatePersonalUserRequest } from '../../../../../../src/features/v1/domain/entities/requests/user.request'
import MockAuthValidator from '../../../../../mock/repositories/validators/index.mock';
import MockEncryptionRepository from '../../../../../mock/repositories/encryption';
import MockUserDBModel from '../../../../../mock/repositories/database/models/user.model.mock';
import { IPersonalInformation, IUser } from '../../../../../../src/features/v1/domain/entities/user';
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
        id: mockedUser.id,
        email: mockedUser.personal_information.email_address,
        password: mockedUser.personal_information.password
    }

    authValidator.validateKycInformation.mockReturnValue((async () => [])());
    encryptionRepository.comparePassword.mockReturnValueOnce(true);
    encryptionRepository.encryptToken.mockReturnValue('00000000');
    userDBModelRepository.checkIfUserExist.mockReturnValueOnce((async () => ({status: true, data: new UserDTO(mockedUser)}))());

    const newUserAfterDataChanged = mockedUser;
    (newUserAfterDataChanged.personal_information as IPersonalInformation).name = "Jude Theman newUser";

    userDBModelRepository.updateUserPersonalDetailToDB.mockReturnValue((async () => ({status: true, data: new UserDTO(newUserAfterDataChanged)}))());

    test('this user should login successfully', async () => {
        const updateUserBusinessInformation = new UpdateUserPersonalInformation({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });

        const request: UpdatePersonalUserRequest = {
            personalInformation: {
                name: "Jude Theman newUser"
            }
        }

        const sendResponse = jest.fn((response: ResponseInterface<ISecureUserResponse>) => {});

        await updateUserBusinessInformation.execute( request, authenticatedUser, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(true);
        expect((sendResponse.mock.calls[0][0] as { status: true, data: IUser}).data?.personal_information.name).toBe(request.personalInformation?.name);
    });
});