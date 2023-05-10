import { KafkaEventManager } from "../../controllers/event_controller";

import UserDBRepository from "../../../repositories/database/data/user.repository";
import VerifyUserKycInformation from "../../../../domain/usecases/kyc/verify_kyc_information";
import EventBusDatasource from "../../../../../../core/services/datasources/events";

const useUserEvents = () => {
    const eventDatasource = new EventBusDatasource();

    const kafkaBrokers = ["localhost:9092"];
    const eventManager = new KafkaEventManager(eventDatasource, kafkaBrokers);

    const userDBModelRepository = new UserDBRepository();

    const verifyUserKycInformation = new VerifyUserKycInformation({ userDBModelRepository });
    eventManager.createListener('Verify-user-kyc-information', verifyUserKycInformation);

}

export default useUserEvents;