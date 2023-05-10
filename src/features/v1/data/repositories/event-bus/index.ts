import IEventBusRepository from '../../../domain/repositories/event-bus';
import EventBusDatasource, { IEventBusDatasource, IEventProducer } from "../../../../../core/services/datasources/events";

class EventBusRepository implements IEventBusRepository {
    private producer: IEventProducer

    constructor(eventDatasource: IEventBusDatasource) {
        this.producer = eventDatasource.getProducer();
        this.producer.connect();
    }

    sendEvent = async <EventType>(topic: string, event: EventType) => {
        await this.producer.send({
            topic: topic,
            messages: [{ value: JSON.stringify(event) }],
        });
    }
}

export default EventBusRepository;