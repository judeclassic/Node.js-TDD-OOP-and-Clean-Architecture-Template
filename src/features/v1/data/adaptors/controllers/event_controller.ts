import { ResponseInterface } from "@core/interfaces/response/response";
import EventUsecase from "@core/interfaces/usecase/usecase_for_event";
import { Kafka, Consumer } from "kafkajs";
import EventBusDatasource, { IEventBusDatasource } from "../../../../../core/services/datasources/events";


export class KafkaEventManager {

  constructor(private eventDatasource: IEventBusDatasource, private brokers: string[]) {}

  createListener<RequestedType, ResponseType>( topic: string, usecase: EventUsecase<RequestedType, ResponseType>): void {
    this.eventDatasource.createListener<RequestedType, ResponseType>(topic, usecase);
    return;
  }
}