import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import { IUser, VerificationStatusEnum } from "../../entities/user";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import EventBusRepositoryInferface, { EventEnum } from "../../repositories/event-bus";
import AuthValidatorInterface from "../../repositories/validators";
import AuthenticatedUsecase from "../../../../../core/interfaces/usecase/usecase_with_auth";
import AuthenticatedUser from "../../../../../core/interfaces/response/authenticated_user";
import { UpdateKYCInformationRequest } from "../../entities/requests/kyc.request";
import { ISecureUserResponse } from "../../entities/responses/user.response";

class UpdateUserKycInformation extends AuthenticatedUsecase<UpdateKYCInformationRequest, ISecureUserResponse> {
    private authValidator: AuthValidatorInterface;
    private eventBusRepository: EventBusRepositoryInferface;
    private userDBModelRepository: UserDBModelRepositoryInterface;

    constructor({  authValidator, eventBusRepository, userDBModelRepository }
        :
    { authValidator: AuthValidatorInterface, eventBusRepository: EventBusRepositoryInferface; userDBModelRepository: UserDBModelRepositoryInterface }) {
        super();
        this.authValidator = authValidator;
        this.eventBusRepository = eventBusRepository;
        this.userDBModelRepository = userDBModelRepository;
    }
    
    execute = async ( { kycInformation } : UpdateKYCInformationRequest, user : AuthenticatedUser, sendResponse: (response : ResponseInterface<ISecureUserResponse>) => void ) => {
        const validationErrors = await this.authValidator.validateKycInformation({ kycInformation });

        if (validationErrors.length > 0 ) {
            sendResponse({ status: false, errors: validationErrors });
            return;
        }

        const userInformation = await this.userDBModelRepository.checkIfUserExist({ id: user.id });

        if (!userInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'token', message: 'this user has been removed', possibleSolution: 'this might be a technical fault contact admin' } ]});
            return;
        }

        const registerUserInformation = await this.userDBModelRepository.updateUserDetailsToDB( user.id, {
            kyc_Information: { 
                verification_status: userInformation.data.kyc_Information?.verification_status ?? VerificationStatusEnum.PENDING,
                verification_document: [
                    ...userInformation.data.kyc_Information?.verification_document ?? [],
                    ...kycInformation.verification_document.map((information) => {
                        return {
                            type: information.type,
                            source: information.source,
                            status: VerificationStatusEnum.PENDING
                        }
                    })
                ]
            }
        });

        if (!registerUserInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: registerUserInformation.error } ]});
            return;
        }

        this.eventBusRepository.sendEvent<IUser>( EventEnum.UpdateUserKycInformation, registerUserInformation.data.getSecureUserInformation());
        sendResponse({status: true, data: registerUserInformation.data.getSecureUserInformation()});
    }
}

export default UpdateUserKycInformation;