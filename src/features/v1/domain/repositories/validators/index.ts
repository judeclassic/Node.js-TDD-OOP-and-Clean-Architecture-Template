import ErrorInterface from "@core/interfaces/response/error";
import { RegisterRegularUserRequest, LoginUserRequest } from "../../entities/requests/auth.request";
import { UpdateKYCInformationRequest } from "../../entities/requests/kyc.request";
import { UpdatePersonalUserRequest } from "../../entities/requests/user.request";

interface IValidatorRepository {

    validatePersonnalUserBeforeRegistration: (request: RegisterRegularUserRequest) => Promise<ErrorInterface[]>;
    validateUserBeforeLogin: (request: LoginUserRequest) => Promise<ErrorInterface[]>;

    validateKycInformation: (request: UpdateKYCInformationRequest) => Promise<ErrorInterface[]>;

    validatePersonnalUserBeforeUpdate: (request: UpdatePersonalUserRequest) => Promise<ErrorInterface[]>;
}

export default IValidatorRepository;