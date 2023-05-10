import { jest, describe, test, expect, beforeAll, afterAll  } from "@jest/globals";

import UserDBModel from '../../../../../../../src/features/v1/data/repositories/database/models/user.model'
import { IUser } from '../../../../../../../src/features/v1/domain/entities/user';
import { mockedUser } from "../../../../../../mock/entities/user.mock";
import { dbConnect, dbDisconnect } from "../../../../../../mock/database/connect.mock";

describe('Its should check user model of the database', () => {
    jest.setTimeout(30000);

    beforeAll(async () => dbConnect())
    afterAll(async () => dbDisconnect());

    test('Its should check user model in the data layer', async () => {
        const user: IUser = mockedUser;
        const userModel = await UserDBModel.create({ ...mockedUser });

        expect(JSON.stringify(userModel.toObject())).toBe(JSON.stringify(userModel));
    });
})