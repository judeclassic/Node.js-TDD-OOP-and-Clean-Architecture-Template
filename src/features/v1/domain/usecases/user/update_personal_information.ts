import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import { IUser } from "../../entities/user";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import EncryptionRepositoryInterface, { TokenType } from "../../repositories/encryption";
import EventBusRepositoryInferface, { EventEnum } from "../../repositories/event-bus";
import AuthValidatorInterface from "../../repositories/validators";
import AuthenticatedUsecase from "../../../../../core/interfaces/usecase/usecase_with_auth";
import AuthenticatedUser from "../../../../../core/interfaces/response/authenticated_user";
import { UpdatePersonalUserRequest } from "../../entities/requests/user.request";

class UpdateUserPersonalInformation extends AuthenticatedUsecase<UpdatePersonalUserRequest, IUser> {
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
    
    execute = async ( { personalInformation } : UpdatePersonalUserRequest, user : AuthenticatedUser, sendResponse: (response : ResponseInterface<IUser>) => void ) => {
        const validationErrors = await this.authValidator.validatePersonnalUserBeforeUpdate({ personalInformation });

        if (validationErrors.length > 0) {
            sendResponse({ status: false, errors: validationErrors });
            return;
        }

        const userInformation = await this.userDBModelRepository.checkIfUserExist({ id: user.id });

        if (!userInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: 'user is not registered with us', possibleSolution: 'check this email or signup with this email' } ]});
            return;
        }

        const updatedUserInformation = await this.userDBModelRepository.updateUserPersonalDetailToDB(user.id, personalInformation);

        if (!updatedUserInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'personal_information', message: 'unable to update information', possibleSolution: 'please cross the information you sent' } ]});
            return;
        }

        this.eventBusRepository.sendEvent<IUser>(EventEnum.UpdateUserPersonalInformation, updatedUserInformation.data.getSecureUserInformation());
        sendResponse({status: true, data: updatedUserInformation.data.getSecureUserInformation()});
    }
}

export default UpdateUserPersonalInformation;