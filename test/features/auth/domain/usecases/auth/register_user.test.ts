import {describe, expect, test, jest } from '@jest/globals';
import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import RegisterRegularUser from '../../../../../../src/features/v1/domain/usecases/auth/register_user';

import MockUserDBModelRepository from '../../../../../mock/repositories/database/models/user.model.mock';
import MockEncryptionRepository from '../../../../../mock/repositories/encryption';
import MockAuthValidator from '../../../../../mock/repositories/validators/index.mock';
import { IUser } from '../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from '../../../../../mock/entities/user.mock';
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto';
import MockEventBusRepository from '../../../../../mock/repositories/event-bus';
import { RegisterRegularUserRequest } from '../../../../../../src/features/v1/domain/entities/requests/auth.request';


describe('check the use case of ', () => { 
    const authValidator: MockAuthValidator = new MockAuthValidator();
    const encryptionRepository: MockEncryptionRepository = new MockEncryptionRepository();
    const eventBusRepository: MockEventBusRepository = new MockEventBusRepository();
    const userDBModelRepository: MockUserDBModelRepository = new MockUserDBModelRepository();

    authValidator.validatePersonnalUserBeforeRegistration.mockReturnValueOnce((async () => [])());
    encryptionRepository.encryptPassword.mockReturnValueOnce('000000');
    encryptionRepository.encryptToken.mockReturnValueOnce('00000000');
    userDBModelRepository.checkIfUserPersonalDataExist.mockReturnValueOnce((async () => ({status: false, error: "Invalid user data"}))());
    userDBModelRepository.registerUserToDB.mockReturnValueOnce((async () => ({status: true as true, data: new UserDTO(mockedUser)}))());

    test('should first', async () => {

        const registerRegularUser = new RegisterRegularUser({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });

        const request: RegisterRegularUserRequest = { personalInformation: {
            name: 'Jude Dickson',
            email_address: 'jude@mail.com',
            password: '123456',
        }}

        const sendJson = jest.fn((response: ResponseInterface<IUser>) => response)

        await registerRegularUser.execute( request, sendJson );

        expect(sendJson.mock.calls[0][0].status).toBe(true);
    })
})
