import { jest } from "@jest/globals";
import { IUser, IPersonalInformation } from "../../../../../src/features/v1/domain/entities/user";
import { UserDTO } from "../../../../../src/features/v1/domain/entities/user.dto";
import UserModelInterface from "../../../../../src/features/v1/domain/repositories/database/data/Iuser.repository";
import { mockedUser } from "../../../entities/user.mock";

class MockUserDBModel implements UserModelInterface {
    registerUserToDB =  jest.fn(async (details: Omit<IUser, 'id'>) => ({ status: true as true, data: new UserDTO(mockedUser) }));
    checkIfUserExist = jest.fn(async (details: Partial<IUser>) =>  ({ status: true as true, data: new UserDTO(mockedUser) }));
    checkIfUserPersonalDataExist = jest.fn(async (personal_information: Partial<IPersonalInformation>): Promise<{status: false, error: string} | {status: true, data: UserDTO}> =>  ({status: false as false, error: "Invalid user data"}));
    updateUserDetailsToDB = jest.fn(async(id: string, business_information: Partial<IUser>) : Promise<{ status: false; error: string; } | { status: true; data: UserDTO; }> => ({ status: true as true, data: new UserDTO(mockedUser) }));
    updateUserPersonalDetailToDB = jest.fn(async (id: string, personal_information: Partial<IPersonalInformation>) => ({ status: true as true, data: new UserDTO(mockedUser) }));
    deleteUser = jest.fn(async (details: Partial<IUser>) =>  ({ status: true as true, data: new UserDTO(mockedUser) }));
}

export default MockUserDBModel;