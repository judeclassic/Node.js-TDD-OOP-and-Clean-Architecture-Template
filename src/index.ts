import RouterInterface from "./core/interfaces/others/router";
import DBConnection from "./core/services/datasources/database";
import { defaultLogger } from "./core/services/developement/logger";
import loadEnv from "./core/configurations/load-env";
import HttpServer from "./core/services/datasources/server/server";
import server from "./core/services/datasources/server";
import config from "./core/configurations/config";
import useUserRoutes from "./features/v1/data/adaptors/gateways/routes";
import useUserEvents from "./features/v1/data/adaptors/gateways/events";

loadEnv();

const callback = (app: RouterInterface, server: HttpServer)=> {
    if (process.env.NODE_ENV === 'development') defaultLogger.useExpressMonganMiddleWare(app);

    const _dBConnection = new DBConnection();

    _dBConnection.connect({ config });
    
    useUserRoutes({ app });

    useUserEvents();

}

export default server({ config, callback });