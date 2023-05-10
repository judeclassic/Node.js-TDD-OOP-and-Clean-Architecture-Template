import {describe, expect, test, jest } from '@jest/globals';

import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import LoginUserToAuth from '../../../../../../src/features/v1/domain/usecases/auth/login_user'
import MockAuthValidator from '../../../../../mock/repositories/validators/index.mock';
import MockEncryptionRepository from '../../../../../mock/repositories/encryption';
import MockUserDBModel from '../../../../../mock/repositories/database/models/user.model.mock';
import { IUser } from '../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from '../../../../../mock/entities/user.mock';
import ErrorInterface from '../../../../../../src/core/interfaces/response/error';
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto';
import MockEventBusRepository from '../../../../../mock/repositories/event-bus';
import { LoginUserRequest } from '../../../../../../src/features/v1/domain/entities/requests/auth.request';


describe('Testing login user usecase', () => { 
    const authValidator: MockAuthValidator = new MockAuthValidator();
    const encryptionRepository: MockEncryptionRepository = new MockEncryptionRepository();
    const eventBusRepository: MockEventBusRepository = new MockEventBusRepository();
    const userDBModelRepository: MockUserDBModel = new MockUserDBModel();

    authValidator.validateUserBeforeLogin.mockReturnValue((async () => [])());
    encryptionRepository.comparePassword.mockReturnValueOnce(true);
    encryptionRepository.encryptToken.mockReturnValue('00000000');
    userDBModelRepository.checkIfUserPersonalDataExist.mockReturnValueOnce((async () => ({status: true, data: new UserDTO(mockedUser)}))());

    test('this user should login successfully', async () => {
        const registerRegularUser = new LoginUserToAuth({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });

        const request: LoginUserRequest = {
            email: mockedUser.personal_information.email_address,
            password: mockedUser.personal_information.password,
        }

        const sendJson = jest.fn((response: ResponseInterface<IUser>) => {});

        await registerRegularUser.execute( request, sendJson );

        expect(sendJson.mock.calls[0][0].status).toBe(true);
        expect((sendJson.mock.calls[0][0] as { status: true, data: IUser}).data.personal_information.email_address).toBe(request.email);
    })

    userDBModelRepository.checkIfUserPersonalDataExist.mockReturnValueOnce((async () => ({status: false, error: "Invalid user data"}))());
    encryptionRepository.comparePassword.mockReturnValueOnce(false);

    test('The user should not be able to login', async () => {
        const loggedInRegularUser = new LoginUserToAuth({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });

        const request: LoginUserRequest = {
            email: 'judedd@mail.com',
            password: '123456',
        }

        const sendResponse = jest.fn((response: ResponseInterface<IUser>) => {})

        await loggedInRegularUser.execute( request, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(false);
        expect((sendResponse.mock.calls[0][0] as { status: false, errors: ErrorInterface[]}).errors[0].field).toBe('email');
    })
})
