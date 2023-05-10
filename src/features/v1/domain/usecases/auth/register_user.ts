import Usecase from "../../../../../core/interfaces/usecase/usecase";
import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import { IUser, VerificationStatusEnum } from "../../entities/user";
import { PersonnalInformationDto } from "../../entities/user.dto";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import EncryptionRepositoryInterface, { TokenType } from "../../repositories/encryption";
import EventBusRepositoryInferface, { EventEnum } from "../../repositories/event-bus";
import AuthValidatorInterface from "../../repositories/validators";
import { RegisterRegularUserRequest } from "../../entities/requests/auth.request";
import { ISecureUserResponse } from "../../entities/responses/user.response";

class RegisterRegularUser extends Usecase<RegisterRegularUserRequest, ISecureUserResponse> {
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
    
    execute = async ( { personalInformation }: RegisterRegularUserRequest, sendResponse: (response : ResponseInterface<ISecureUserResponse>) => void ) => {
        const validationErrors = await this.authValidator.validatePersonnalUserBeforeRegistration({ personalInformation });

        if (validationErrors.length > 0) {
            sendResponse({ status: false, errors: validationErrors });
            return;
        }

        const emailExist = await this.userDBModelRepository.checkIfUserPersonalDataExist({ email_address: personalInformation.email_address});

        if (emailExist.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: 'this email already exist', possibleSolution: 'use another email or signin' } ]});
            return;
        }

        const personInformationDto = new PersonnalInformationDto(personalInformation);
        personInformationDto.password = this.encryptionRepository.encryptPassword(personInformationDto.password);

        const registerUserInformation = await this.userDBModelRepository.registerUserToDB({
            personal_information: personInformationDto.getDBInformation(),
            kyc_Information: { verification_status: VerificationStatusEnum.UNVERIFIED, verification_document: []},
            setting: { email_reminder: true, pop_up_notification: true, is_information_editable: false },
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (!registerUserInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: registerUserInformation.error } ]});
            return;
        }

        
        registerUserInformation.data.personal_information.access_token = this.encryptionRepository.encryptToken(registerUserInformation.data.getAuthenticatedUserData(), TokenType.accessToken);

        this.eventBusRepository.sendEvent<IUser>(EventEnum.RegisterUser, registerUserInformation.data.getSecureUserInformation());
        sendResponse({status: true, data: registerUserInformation.data.getSecureUserInformation()});
    }
}

export default RegisterRegularUser;