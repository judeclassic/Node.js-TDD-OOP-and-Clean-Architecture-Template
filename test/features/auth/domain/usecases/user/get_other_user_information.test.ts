import {describe, expect, test, jest } from '@jest/globals';

import { ResponseInterface } from '../../../../../../src/core/interfaces/response/response';

import GetOtherUserInformation from '../../../../../../src/features/v1/domain/usecases/user/get_other_user_information'
import { GetOtherUserRequest } from '../../../../../../src/features/v1/domain/entities/requests/user.request'
import MockUserDBModel from '../../../../../mock/repositories/database/models/user.model.mock';
import { IUser } from '../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from '../../../../../mock/entities/user.mock';
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto';
import { IUnSecuredUserResponse } from '../../../../../../src/features/v1/domain/entities/responses/user.response';

describe('Testing login user usecase', () => { 
    const userDBModelRepository: MockUserDBModel = new MockUserDBModel();

    userDBModelRepository.checkIfUserPersonalDataExist.mockReturnValueOnce((async () => ({status: true, data: new UserDTO(mockedUser)}))());

    const getOtherUserInformation = new GetOtherUserInformation({ userDBModelRepository });

    test('check if you can get other user information with user email', async () => {

        const request: GetOtherUserRequest = {
            email_address: mockedUser.personal_information.email_address
        }

        const sendResponse = jest.fn((response: ResponseInterface<IUnSecuredUserResponse>) => {});

        await getOtherUserInformation.execute( request, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(true);
        expect((sendResponse.mock.calls[0][0] as { status: true, data: IUser}).data.personal_information.email_address).toBe(request.email_address);
    });

    userDBModelRepository.checkIfUserExist.mockReturnValueOnce((async () => ({status: true, data: new UserDTO(mockedUser)}))());

    test('check if you can get other user information with user id', async () => {

        const request: GetOtherUserRequest = {
            id: mockedUser.id
        }

        const sendResponse = jest.fn((response: ResponseInterface<IUnSecuredUserResponse>) => {});

        await getOtherUserInformation.execute( request, sendResponse );

        expect(sendResponse.mock.calls[0][0].status).toBe(true);
        expect((sendResponse.mock.calls[0][0] as { status: true, data: IUser}).data.id).toBe(request.id);
    });
});