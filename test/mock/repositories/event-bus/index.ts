import { jest } from "@jest/globals";
import EventBusRepositoryInferface, { EventEnum } from "../../../../src/features/v1/domain/repositories/event-bus";


class MockEventBusRepository implements EventBusRepositoryInferface {
    sendEvent = jest.fn(async <EventType>(topic: EventEnum, event: EventType) => {});
}

export default MockEventBusRepository;