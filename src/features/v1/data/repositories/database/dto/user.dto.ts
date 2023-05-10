import { UserDTO } from "../../../../domain/entities/user.dto";
import { UserModel } from "../models/user.model";
import { IUser } from "../../../../domain/entities/user";

// interface UserTransformationProps extends User { _id:}

class UserModelDto extends UserDTO implements IUser {
    constructor(userModel: UserModel) {
        let userProps: IUser = {
            id: userModel._id,
            personal_information: userModel.personal_information,
            kyc_Information: userModel.kyc_Information,
            setting: userModel.setting,
            createdAt: userModel.createdAt,
            updatedAt: userModel.createdAt
        }

        super(userProps);
    }
}

export default UserModelDto;