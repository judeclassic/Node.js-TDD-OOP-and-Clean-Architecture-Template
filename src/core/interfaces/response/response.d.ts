import ErrorInterface from "./error";

type ResponseInterface<ResponseData> =  {
    status: true;
    data: ResponseData;
} | {
    status: false;
    errors: ErrorInterface[];
}

interface EventResponseInteface<ResponseData> extends ResponseInterface<ResponseData> {
    eventName: string
}