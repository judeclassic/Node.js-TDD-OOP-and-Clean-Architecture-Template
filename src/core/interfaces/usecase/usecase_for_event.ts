import { ResponseInterface } from "@core/interfaces/response/response"

abstract class EventUsecase<RequestedType, ResponseType> {
    abstract eventTopic: string;
    abstract execute( request: RequestedType, sendResponse: (response : ResponseInterface<ResponseType>) => void ): Promise<void>;
}

export default EventUsecase;