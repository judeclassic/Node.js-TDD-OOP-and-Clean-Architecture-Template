//@ts-check

import express, { Express } from 'express';
import cors from 'cors';
import LoggerInterface from '../../../interfaces/others/logger';
import ConfigInterface from '../../../interfaces/others/config';
import HttpServer from './server';

const server = ({ config, callback}: { config: ConfigInterface, callback: (app: Express, server: HttpServer) => void}) => {
    const app = express();

    app.use(cors());
    app.use(express.static('public'));

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json());

    const server = (new HttpServer({app, config})).development();

    callback(app, server);

    return {app, server};
}

export default server;