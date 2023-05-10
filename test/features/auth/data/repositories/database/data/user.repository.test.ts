import { jest, describe, test, expect, beforeAll, afterAll  } from "@jest/globals";

import UserDBModelRepository from '../../../../../../../src/features/v1/data/repositories/database/data/user.repository'
import UserModelDto from "../../../../../../../src/features/v1/data/repositories/database/dto/user.dto";
import { IUser, VerificationStatusEnum } from "../../../../../../../src/features/v1/domain/entities/user";

import { mockedUser } from "../../../../../../mock/entities/user.mock";
import { dbConnect, dbDisconnect } from "../../../../../../mock/database/connect.mock";


describe('Its should test the user DB respository in the data level', () => {
    jest.setTimeout(30000);

    beforeAll(async () => dbConnect())
    afterAll(async () => dbDisconnect());


    const userDBModelRepository = new UserDBModelRepository();
    let createdUser: { status: true; data: UserModelDto; error?: undefined; } | { status: false; error: string; data?: undefined; };

    test('check the registerUserToDB request query', async () => {
        const request: Omit<IUser, 'id'> = mockedUser;
        createdUser = await userDBModelRepository.registerUserToDB(request);
        expect(createdUser.status).toBe(true);
    });

    test('check the checkIfUserExist request query', async () => {
        if (!createdUser.status) return;
        const dataResponse = await userDBModelRepository.checkIfUserExist({ id: createdUser.data.id });
        expect(dataResponse.status).toBe(true);
    });

    test('check the checkIfUserPersonalDataExist request query', async () => {
        if (!createdUser.status) return;
        const dataResponse = await userDBModelRepository.checkIfUserPersonalDataExist({ email_address: createdUser.data.personal_information.email_address });
        expect(dataResponse.status).toBe(true);
    });

    test('check the updateUserPersonalDetailToDB request query', async () => {
        if (!createdUser.status) return;
        const email_address = 'myemail@gmail.com';
        const dataResponse = await userDBModelRepository.updateUserPersonalDetailToDB(createdUser.data.id, { email_address });
        expect(dataResponse.status).toBe(true);
        expect(dataResponse.data?.personal_information.email_address).toBe(email_address);
    });

    test('check the deleteUser request', async () => {
        if (!createdUser.status) return;
        const dataResponse = await userDBModelRepository.deleteUser({ id: createdUser.data.id.toString() });
        expect(dataResponse.status).toBe(true);
    })
})