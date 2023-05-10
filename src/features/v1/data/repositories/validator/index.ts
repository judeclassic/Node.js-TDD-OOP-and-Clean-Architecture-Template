import BaseValidator from "../../../../../core/interfaces/validator/base.validator";
import ErrorInterface from "../../../../../core/interfaces/response/error";
import AuthValidatorInterface from "../../../domain/repositories/validators";
import { RegisterRegularUserRequest, LoginUserRequest } from "../../../domain/entities/requests/auth.request";
import { UpdateKYCInformationRequest } from "../../../domain/entities/requests/kyc.request";
import { UpdatePersonalUserRequest } from "../../../domain/entities/requests/user.request";

class AuthValidatorRepository extends BaseValidator implements AuthValidatorInterface {

    validatePersonnalUserBeforeRegistration = async (request: RegisterRegularUserRequest) => {
        const errors: ErrorInterface[] = [];

        if (!request?.personalInformation) {
            errors.push({
                field: 'personalInformation',
                message: `${'personalInformation'} is empty`,
                possibleSolution: `add email, name, password in personal information`,
            });
            return errors;
        }

        errors.push(...this._validateNameInput('name', request?.personalInformation?.name));

        errors.push(...this._validateEmailInput('email', request?.personalInformation?.email_address));

        errors.push(...this._validatePasswordInput('password', request?.personalInformation?.password));
        
        return errors;
    }

    validatePersonnalUserBeforeUpdate = async (request: UpdatePersonalUserRequest) => {
        const errors: ErrorInterface[] = [];

        if (!request?.personalInformation) {
            errors.push({
                field: 'personalInformation',
                message: `${'personalInformation'} is empty`,
                possibleSolution: `add email, name, password in personal information`,
            });
            return errors;
        }

        errors.push(...this._validateNameInput('name', request?.personalInformation?.name));

        errors.push(...this._validateEmailInput('email', request?.personalInformation?.email_address));

        if (request?.personalInformation?.password) {
            errors.push({
                field: 'password',
                message: `${'password'} can not be changed this way`,
                possibleSolution: `please remove password and try again`,
            });
        }
        
        return errors;
    }

    validateKycInformation = async (request: UpdateKYCInformationRequest) => {
        const errors : ErrorInterface[] = [];
        return errors;
    }

    validateUserBeforeLogin = async (request: LoginUserRequest) => {
        const errors: ErrorInterface[] = [];

        errors.push(...this._validateEmailInput('email', request?.email));

        errors.push(...this._validatePasswordInput('password', request?.password));

        return errors;
    }
}

export default AuthValidatorRepository;