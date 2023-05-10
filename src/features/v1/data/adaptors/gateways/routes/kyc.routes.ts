import ApiRequestHandler from "../../controllers/api_route_controller";

import AuthValidatorRepository from "../../../repositories/validator";
import EncryptionRepository from "../../../repositories/encryption";
import EventBusRepository from "../../../repositories/event-bus";
import UserDBRepository from "../../../repositories/database/data/user.repository";

import { IUser } from "../../../../domain/entities/user";
import { TokenType } from "../../../../domain/repositories/encryption";

import CustomizedAppRouter from "../../../../../../core/interfaces/router/router";
import UpdateUserKycInformation from "../../../../domain/usecases/kyc/update_kyc_verification";
import { UpdateKYCInformationRequest } from "../../../../domain/entities/requests/kyc.request";
import EventBusDatasource from "../../../../../../core/services/datasources/events";

const useKycRoutes = ({router}: {router: CustomizedAppRouter}) => {
    const eventDatasource = new EventBusDatasource();
    
    const authValidator = new AuthValidatorRepository();
    const encryptionRepository = new EncryptionRepository();
    const eventBusRepository = new EventBusRepository(eventDatasource);
    const userDBModelRepository = new UserDBRepository();

    const userRequestHandler = new ApiRequestHandler({ encryptionRepository, tokenType: TokenType.accessToken });

    const updateUserBusinessInformationUsecase = new UpdateUserKycInformation({ authValidator, eventBusRepository, userDBModelRepository });
    router.post( '/update-kyc-info', userRequestHandler.handleAuthenticatedBodyRequest<UpdateKYCInformationRequest, IUser>(updateUserBusinessInformationUsecase));
}

export default useKycRoutes;