import Usecase from "../../../../../core/interfaces/usecase/usecase";
import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import EncryptionRepositoryInterface, { TokenType } from "../../repositories/encryption";
import EventBusRepositoryInferface, { EventEnum } from "../../repositories/event-bus";
import AuthValidatorInterface from "../../repositories/validators";
import { LoginUserRequest } from "../../entities/requests/auth.request";
import { ISecureUserResponse } from "../../entities/responses/user.response";

class LoginUserToAuth extends Usecase<LoginUserRequest, ISecureUserResponse> {
    private authValidator: AuthValidatorInterface;
    private encryptionRepository: EncryptionRepositoryInterface;
    private eventBusRepository: EventBusRepositoryInferface;
    private userDBModelRepository: UserDBModelRepositoryInterface;

    constructor({  authValidator, encryptionRepository, eventBusRepository, userDBModelRepository }
        :
    { authValidator: AuthValidatorInterface, encryptionRepository: EncryptionRepositoryInterface, eventBusRepository: EventBusRepositoryInferface; userDBModelRepository: UserDBModelRepositoryInterface }) {
        super();
        this.authValidator = authValidator;
        this.encryptionRepository = encryptionRepository;
        this.eventBusRepository = eventBusRepository;
        this.userDBModelRepository = userDBModelRepository;
    }
    
    execute = async ( { email, password }: LoginUserRequest, sendResponse: (response : ResponseInterface<ISecureUserResponse>) => void ) => {
        const validationErrors = await this.authValidator.validateUserBeforeLogin({ email, password });

        if (validationErrors.length > 0) {
            sendResponse({ status: false, errors: validationErrors });
            return;
        }

        const userInformation = await this.userDBModelRepository.checkIfUserPersonalDataExist({ email_address: email });

        if (!userInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: 'email is not registered with us', possibleSolution: 'check this email or signup with this email' } ]});
            return;
        }

        const isPasswordValid = this.encryptionRepository.comparePassword(password, userInformation.data.personal_information.password);

        if (!isPasswordValid) {
            sendResponse({ status: false, errors: [ { field: 'password', message: 'password is incorrect', possibleSolution: 'check your password or you password email combination' } ]});
            return;
        }

        userInformation.data.personal_information.access_token = this.encryptionRepository.encryptToken(userInformation.data.getAuthenticatedUserData(), TokenType.accessToken);

        this.eventBusRepository.sendEvent<{userId: string}>(EventEnum.LoginUser, {userId: userInformation.data.id});
        sendResponse({status: true, data: userInformation.data.getSecureUserInformation()});
    }
}

export default LoginUserToAuth;