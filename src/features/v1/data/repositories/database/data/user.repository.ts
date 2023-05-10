import { PersonnalInformationDto } from "../../../../domain/entities/user.dto";
import { IPersonalInformation, IUser } from "../../../../domain/entities/user";
import UserModelInterface from "../../../../domain/repositories/database/data/Iuser.repository";
import UserModelDto from "../dto/user.dto";
import UserDBModel, { UserModel } from "../models/user.model";

class  UserDBRepository implements UserModelInterface {
    UserDBModel: typeof UserDBModel;

    constructor() {
        this.UserDBModel =  UserDBModel;
    }

    private deepSearchDetails = (name: string, data: any) => {
        const finalObject: any = {};
        Object.entries(data).forEach((data) => {
            finalObject[`personal_information.${data[0]}`] = data[1];
        })
        return finalObject;
    }

    private _convertInputData = (user: Partial<IUser>) => {
        const _id = user.id;
        delete user.id;
        const userModel: Partial<UserModel> = { ...user, _id };
        return userModel;
    }

    registerUserToDB = async (details: Partial<Omit<IUser, 'id'>>) => {
        try {
            const dataResponse = await this.UserDBModel.create(details);
            if (dataResponse) {
              const data = new UserModelDto(dataResponse);
              return { status: true as true, data };
            } else {
              return { status: false as false, error: "Couldn't create user" };
            }
        } catch (error) {
            return { status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }

    checkIfUserExist = async (details: Partial<IUser>) => {
        const modifiedDetails = this._convertInputData(details);
        try {
            const dataResponse = await this.UserDBModel.findOne(modifiedDetails);
            if (dataResponse) {
                const data = new UserModelDto(dataResponse);
                return {status: true as true, data};
            }else {
                return { status: false as false, error: `Can't find user Details` };
            }
        } catch (error) {
            return { status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }

    checkIfUserPersonalDataExist = async (personal_information: Partial<IPersonalInformation>) => {
        const final_personal_information: any = this.deepSearchDetails( 'personal_information', personal_information );

        try {
            const dataResponse = await this.UserDBModel.findOne( final_personal_information );
            if (dataResponse) {
                const data = new UserModelDto(dataResponse);
                return {status: true as true, data};
            }else {
                return {status: false as false, error: `Can't find Details`};
            }
        } catch (error) {
            return {status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }
    
    updateUserDetailsToDB = async (id: string, user_information: Partial<IUser>) => {
        try {
            const dataResponse = await this.UserDBModel.findByIdAndUpdate(id, user_information);
            if (dataResponse) {
                const data = new UserModelDto(dataResponse);
                return {status: true as true, data};
            } else {
                return {status: false as false, error: "Couldn't update user"};
            }
        } catch (error) {
            return { status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }

    updateUserPersonalDetailToDB = async (id: string, personal_information: Partial<IPersonalInformation>) => {
        try {
            const dataResponse = await this.UserDBModel.findById(id);
            if (dataResponse) {
                const personalInformationDto = new PersonnalInformationDto(dataResponse.personal_information);

                dataResponse.personal_information = { ...personalInformationDto.getDBInformation(), ...personal_information  }
                await dataResponse.save();
                const data = new UserModelDto(dataResponse);
                return {status: true as true, data};
            } else {
                return {status: false as false, error: "Couldn't update user"};
            }
        } catch (error) {
            return { status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }

    deleteUser = async (details : Partial<IUser>) => {
        const modifiedDetails = this._convertInputData(details);
        try {
            const dataResponse = await this.UserDBModel.findOne(modifiedDetails);
            if (dataResponse) {
                const data = new UserModelDto(dataResponse);
                return {status: true as true, data};
            }else {
                return {status: false as false, error: `Can't find Details`};
            }
        } catch (error) {
            return {status: false as false, error: (error ?? 'Unable to save user information to DB') as string };
        }
    }
}

export default UserDBRepository;
