import { ResponseInterface } from "@core/interfaces/response/response"

abstract class Usecase<RequestedType, ResponseType> {
    
    abstract execute( request: RequestedType, sendResponse: (response : ResponseInterface<ResponseType>) => void ): Promise<void>;
}

export default Usecase;