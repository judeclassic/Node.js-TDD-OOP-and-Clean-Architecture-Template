import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import AuthenticatedUsecase from "../../../../../core/interfaces/usecase/usecase_with_auth";
import AuthenticatedUser from "../../../../../core/interfaces/response/authenticated_user";
import { GetUserPersonalInformationRequest } from "../../entities/requests/user.request";
import { ISecureUserResponse } from "../../entities/responses/user.response";

class GetUserPersonalInformation extends AuthenticatedUsecase<GetUserPersonalInformationRequest, ISecureUserResponse> {
    private userDBModelRepository: UserDBModelRepositoryInterface;

    constructor({ userDBModelRepository }
        :
    { userDBModelRepository: UserDBModelRepositoryInterface }) {
        super();
        this.userDBModelRepository = userDBModelRepository;
    }
    
    execute = async ( _request : GetUserPersonalInformationRequest, user : AuthenticatedUser, sendResponse: (response : ResponseInterface<ISecureUserResponse>) => void ) => {

        const userInformation = await this.userDBModelRepository.checkIfUserExist({ id: user.id });

        if (!userInformation.status) {
            sendResponse({ status: false, errors: [ { field: 'email', message: 'user is not registered with us', possibleSolution: 'check this email or signup with this email' } ]});
            return;
        }

        sendResponse({status: true, data: userInformation.data.getSecureUserInformation()});
    }
}

export default GetUserPersonalInformation;