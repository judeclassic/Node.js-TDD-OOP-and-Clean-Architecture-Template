export enum EventEnum {
    LoginUser = 'LoginUser',
    RegisterUser = 'RegisterUser',
    UpdateUserKycInformation = 'UpdateUserKycInformation',
    UpdateUserBusinessInformation = 'UpdateUserBusinessInformation',
    UpdateUserPersonalInformation = "UpdateUserPersonalInformation"
}

interface IEventBusRepository {
    sendEvent: <EventType>(topic: EventEnum, event: EventType) => Promise<void>;
}


export default IEventBusRepository;