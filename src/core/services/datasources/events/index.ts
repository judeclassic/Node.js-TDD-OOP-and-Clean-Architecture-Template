import { ResponseInterface } from "@core/interfaces/response/response";
import EventUsecase from "@core/interfaces/usecase/usecase_for_event";
import { Consumer, Kafka, Producer } from "kafkajs";

export interface IEventProducer {
    connect: () => Promise<void>;
    send: (request: { topic: string, messages: { value: string }[]}) => Promise<any>
}

export abstract class IEventBusDatasource {
    abstract getProducer: () => IEventProducer;
    abstract createListener: <RequestedType, ResponseType>( topic: string, usecase: EventUsecase<RequestedType, ResponseType>) => void
}

// const kafka: Kafka = new Kafka({ clientId: 'my-app', brokers: ['kafka1:9092', 'kafka2:9092'] });

class EventBusDatasource implements IEventBusDatasource {

    getProducer = () => {
        // const producer: IEventProducer = kafka.producer();
        // return producer;
        return {
            connect: async () => {},
            send: async (request: { topic: string, messages: { value: string }[]}) => {}
        };
    }

    createListener<RequestedType, ResponseType>( topic: string, usecase: EventUsecase<RequestedType, ResponseType>): void {
        // const listener = new KafkaEventListener(kafka, 'create-event-listener', topic, usecase);
        // listener.start();
    }
}

class KafkaEventListener<RequestedType, ResponseType> {
    private consumer: Consumer;

    constructor(
      private kafka: Kafka,
      private groupId: string,
      private topic: string,
      private useCase: EventUsecase<RequestedType, ResponseType> // Replace "any" with the actual use case class
    ) {
      this.consumer = this.kafka.consumer({ groupId: this.groupId });
    }
  
    async start(): Promise<void> {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic });
  
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const payload = JSON.parse(message.value!.toString());
          const sendResponse = (response: ResponseInterface<ResponseType>) => {}
          await this.useCase.execute(payload, sendResponse);
        },
      });
    }
  
    async stop(): Promise<void> {
      await this.consumer.disconnect();
    }
}

export default EventBusDatasource;