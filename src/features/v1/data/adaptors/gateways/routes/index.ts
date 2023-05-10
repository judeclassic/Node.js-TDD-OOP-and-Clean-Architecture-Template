import { defaultLogger } from "../../../../../../core/services/developement/logger";
import CustomizedAppRouter from "../../../../../../core/interfaces/router/router";
import RouterInterface from "../../../../../../core/interfaces/others/router";
import DocumentationRepository from "../../../../../../core/services/developement/documentation";

import useAuthRoutes from "./auth.routes";
import useKycRoutes from "./kyc.routes";
import useUserRoutes from "./user.routes";


const useRoutes = ({app} : { app : RouterInterface }) => {
    const router = new CustomizedAppRouter({ router: app, host: '/' });

    router.extend('/user', useAuthRoutes );
    router.extend('/kyc', useKycRoutes );
    router.extend('/user', useUserRoutes );

    if (process.env.NODE_ENV === 'development') defaultLogger.showRoutesEndPoints( router );
    DocumentationRepository.useSwaggerDocumention({ app: router, documentationRoute: '/doc' });
}

export default useRoutes;