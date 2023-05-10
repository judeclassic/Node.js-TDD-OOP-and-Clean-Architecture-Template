import ConfigInterface from "../../../interfaces/others/config";
import { defaultLogger } from "../../developement/logger";
import http from 'http';
import https from 'https';

export default class HttpServer {
    options: any;
    port: number | string;
    app: any;
    httpsServer: any;
    
    constructor({app, config}:{app: any, config: ConfigInterface}) {
        this.options = config.options;
        this.port = config.server.port;
        this.app = app;
        this.test(app);
    }

    private test(app: any) {
        app.get('/test', (_req: any, res: any) =>{
            res.send('server started');
        });
    }

    production() {
        const fs = require('fs');
        const options = {
            key: fs.readFileSync(this.options.key),
            cert: fs.readFileSync(this.options.cert)
        };
        this.httpsServer = https.createServer(options, this.app);
        this.httpsServer.listen(this.port, () => defaultLogger.info(`Server in Production Mode and Listening on port ${this.port}`));

        return this.httpsServer;
    }

    development() {
        this.httpsServer = http.createServer(this.app);
        this.httpsServer.listen(this.port, () => defaultLogger.info(`Server in Development Mode and Listening on port ${this.port}`));

        return this.httpsServer;
    }

    close = () => {
        this.httpsServer.close();
    }
}