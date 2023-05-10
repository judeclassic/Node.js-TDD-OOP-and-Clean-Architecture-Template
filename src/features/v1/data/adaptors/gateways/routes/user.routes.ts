import ApiRequestHandler from "../../controllers/api_route_controller";

import AuthValidatorRepository from "../../../repositories/validator";
import EncryptionRepository from "../../../repositories/encryption";
import EventBusRepository from "../../../repositories/event-bus";
import UserDBRepository from "../../../repositories/database/data/user.repository";

import { IUser } from "../../../../domain/entities/user";
import { TokenType } from "../../../../domain/repositories/encryption";

import CustomizedAppRouter from "../../../../../../core/interfaces/router/router";
import GetOtherUserInformation from "../../../../domain/usecases/user/get_other_user_information";
import { GetOtherUserRequest, GetUserPersonalInformationRequest, UpdatePersonalUserRequest } from "../../../../domain/entities/requests/user.request";
import GetUserPersonalInformation from "../../../../domain/usecases/user/get_personal_user_information";
import UpdateUserPersonalInformation from "../../../../domain/usecases/user/update_personal_information";
import EventBusDatasource from "../../../../../../core/services/datasources/events";
import { ISecureUserResponse, IUnSecuredUserResponse } from "src/features/v1/domain/entities/responses/user.response";

const useUserRoutes = ({router}: {router: CustomizedAppRouter}) => {
    const eventDatasource = new EventBusDatasource();

    const authValidator = new AuthValidatorRepository();
    const encryptionRepository = new EncryptionRepository();
    const eventBusRepository = new EventBusRepository(eventDatasource);
    const userDBModelRepository = new UserDBRepository();

    const userRequestHandler = new ApiRequestHandler({ encryptionRepository, tokenType: TokenType.accessToken });

    const getOtherUserInformationUsecase = new GetOtherUserInformation({ userDBModelRepository });
    router.get( '/get-other-user-info', userRequestHandler.handleQueryRequest<GetOtherUserRequest, IUnSecuredUserResponse>(getOtherUserInformationUsecase));

    const getUserPersonalInformationUsecase = new GetUserPersonalInformation({ userDBModelRepository });
    router.get( '/get-my-info', userRequestHandler.handleAuthenticatedQueryRequest<GetUserPersonalInformationRequest, ISecureUserResponse>(getUserPersonalInformationUsecase));

    const updateUserPersonalInformationUsecase = new UpdateUserPersonalInformation({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });
    router.post( '/update-user-info', userRequestHandler.handleAuthenticatedBodyRequest<UpdatePersonalUserRequest, ISecureUserResponse>(updateUserPersonalInformationUsecase));
}

export default useUserRoutes;