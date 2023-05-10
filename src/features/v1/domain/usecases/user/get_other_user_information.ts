import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import UserDBModelRepositoryInterface from "../../repositories/database/data/Iuser.repository";
import Usecase from "../../../../../core/interfaces/usecase/usecase";
import { GetOtherUserRequest } from "../../entities/requests/user.request";
import { IUnSecuredUserResponse } from "../../entities/responses/user.response";

class GetOtherUserInformation extends Usecase<GetOtherUserRequest, IUnSecuredUserResponse> {
    private userDBModelRepository: UserDBModelRepositoryInterface;

    constructor({ userDBModelRepository }
        :
    { userDBModelRepository: UserDBModelRepositoryInterface }) {
        super();
        this.userDBModelRepository = userDBModelRepository;
    }
    
    execute = async ( request : GetOtherUserRequest, sendResponse: (response : ResponseInterface<IUnSecuredUserResponse>) => void ) => {
        if (request.email_address) {
            const userInformation = await this.userDBModelRepository.checkIfUserPersonalDataExist({ email_address: request.email_address });

            if (!userInformation.status) {
                sendResponse({ status: false, errors: [ { field: 'email', message: 'email is not registered with us', possibleSolution: 'check this email' } ]});
                return;
            }

            sendResponse({status: true, data: userInformation.data.getSecureUserInformation()});
            return;
        }
        else if (request.id) {
            const userInformation = await this.userDBModelRepository.checkIfUserExist({ id: request.id });

            if (!userInformation.status) {
                sendResponse({ status: false, errors: [ { field: 'id', message: 'user is not registered with us', possibleSolution: 'check this user id' } ]});
                return;
            }

            sendResponse({status: true, data: userInformation.data.getGeneralUserInformation()});
            return;
        }
        sendResponse({ status: false, errors: [ { field: 'email', message: 'please enter either a valid email or id', possibleSolution: 'check this user id or email' } ]});
    }
}

export default GetOtherUserInformation;