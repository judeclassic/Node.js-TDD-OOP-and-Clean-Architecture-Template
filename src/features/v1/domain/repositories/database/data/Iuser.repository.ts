import { IUser } from "../../../entities/user";
import { UserDTO } from "../../../entities/user.dto";


interface IUserDBModelRepository{

    registerUserToDB: (details: Omit<IUser, 'id'>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;

    checkIfUserExist: (details : Partial<IUser>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;

    checkIfUserPersonalDataExist: (personal_information : Partial<IUser['personal_information']>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;

    updateUserPersonalDetailToDB: (id : string, personal_information : Partial<IUser['personal_information']>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;

    updateUserDetailsToDB: (id : string, business_information : Partial<IUser>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;

    deleteUser: (details : Partial<IUser>) => Promise<{ status: false, error: string } | { status: true, data: UserDTO }>;
}

export default IUserDBModelRepository;