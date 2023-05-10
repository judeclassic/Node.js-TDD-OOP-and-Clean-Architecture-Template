import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import { UpdateKYCVerificationStatusRequest } from "../../entities/requests/kyc.request";
import EventUsecase from "../../../../../core/interfaces/usecase/usecase_for_event";
import { defaultLogger } from "../../../../../core/services/developement/logger";
import { ISecureUserResponse } from "../../entities/responses/user.response";

class VerifyUserKycInformation extends EventUsecase<UpdateKYCVerificationStatusRequest, ISecureUserResponse> {
    eventTopic = 'verifyUserKycnformation';
    private userDBModelRepository: UserDBModelRepositoryInterface;

    constructor({ userDBModelRepository }
        :
    { userDBModelRepository: UserDBModelRepositoryInterface }) {
        super();
        this.userDBModelRepository = userDBModelRepository;
    }
    
    execute = async ( { userId, kycVerificationStatus, kycVerificationType } : UpdateKYCVerificationStatusRequest, sendResponse: (response : ResponseInterface<ISecureUserResponse>) => void ) => {

        const userInformation = await this.userDBModelRepository.checkIfUserExist({ id: userId });

        if (!userInformation.status) {
            defaultLogger.error(userInformation.error)
            return;
        }

        const kycVerificationDocument = userInformation.data.kyc_Information.verification_document.map((document) => {
            if (document.type === kycVerificationType) {
                return {
                    type: kycVerificationType,
                    source: document.source,
                    status: kycVerificationStatus
                }
            }
            return document;
        });


        const registerUserInformation = await this.userDBModelRepository.updateUserDetailsToDB( userId, {
            kyc_Information: {
                verification_status: kycVerificationStatus,
                verification_document: kycVerificationDocument
            }
        });

        if (!registerUserInformation.status) {
            defaultLogger.error(registerUserInformation.error)
            return;
        }
        
        sendResponse({status: true, data: registerUserInformation.data.getSecureUserInformation()});
    }
}

export default VerifyUserKycInformation;