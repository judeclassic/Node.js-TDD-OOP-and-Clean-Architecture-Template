import ApiRequestHandler from "../../controllers/api_route_controller";

import AuthValidatorRepository from "../../../repositories/validator";
import EncryptionRepository from "../../../repositories/encryption";
import EventBusRepository from "../../../repositories/event-bus";
import UserDBRepository from "../../../repositories/database/data/user.repository";

import LoginUserToAuth from "../../../../domain/usecases/auth/login_user";
import RegisterRegularUser from "../../../../domain/usecases/auth/register_user";

import { TokenType } from "../../../../domain/repositories/encryption";

import CustomizedAppRouter from "../../../../../../core/interfaces/router/router";
import { LoginUserRequest, RegisterRegularUserRequest } from "../../../../domain/entities/requests/auth.request";
import EventBusDatasource from "../../../../../../core/services/datasources/events";
import { ISecureUserResponse } from "src/features/v1/domain/entities/responses/user.response";

const useAuthRoutes = ({router}: {router: CustomizedAppRouter}) => {
    const eventDatasource = new EventBusDatasource();

    const authValidator = new AuthValidatorRepository();
    const encryptionRepository = new EncryptionRepository();
    const eventBusRepository = new EventBusRepository(eventDatasource);
    const userDBModelRepository = new UserDBRepository();

    const userRequestHandler = new ApiRequestHandler({ encryptionRepository, tokenType: TokenType.accessToken });

    const loginUsecase = new LoginUserToAuth({ authValidator, encryptionRepository, eventBusRepository, userDBModelRepository });
    router.post( '/login', userRequestHandler.handleBodyRequest<LoginUserRequest, ISecureUserResponse>(loginUsecase));

    const registerBusinessUserUsecase = new RegisterRegularUser({authValidator, encryptionRepository, eventBusRepository, userDBModelRepository});
    router.post( '/register', userRequestHandler.handleBodyRequest<RegisterRegularUserRequest, ISecureUserResponse>(registerBusinessUserUsecase));
}

export default useAuthRoutes;