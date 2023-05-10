import AuthenticatedUser from "@core/interfaces/response/authenticated_user";
import { ResponseInterface } from "@core/interfaces/response/response"

abstract class AuthenticatedUsecase<RequestedType, ResponseType> {
    
    abstract execute( request: RequestedType, user: AuthenticatedUser, sendJson: (response : ResponseInterface<ResponseType>) => void ): Promise<void>;
}

export default AuthenticatedUsecase;