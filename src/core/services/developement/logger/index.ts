import winston from 'winston'
import morgan from 'morgan';
import fs from 'fs'
import path from 'path';
import colors from "colors/safe";
import {fileURLToPath} from 'url';
import { ConsoleTransportOptions } from "winston/lib/winston/transports"

import LoggerInterface from '@core/interfaces/others/logger';
import RouterInterface from '@core/interfaces/others/router';
import BaseRequestHandler from '../../../interfaces/router/router';

class Logger implements LoggerInterface {
    winston: typeof winston;
    errorLogger: winston.Logger;
    infoLogger: winston.Logger;
    logFileDirectory: string;

    constructor() {
        this.winston = winston;
        this.logFileDirectory = `${__dirname}/logs.log`
        const consoleLog = new this.winston.transports.Console({
            colorize: true,
            name: 'console',
            timestamp: () => (new Date()).toUTCString(),
           } as ConsoleTransportOptions);
        const fileLog = new this.winston.transports.File({ filename: this.logFileDirectory });

        this.errorLogger = this._initializeWithError(fileLog, consoleLog);
        this.infoLogger = this._initializeWithInfo(consoleLog);
    }

    warn = (message: string) => {
        this.infoLogger.info(message);
    };

    info = (message: string) => {
        this.infoLogger.info(message);
    };

    error = (message: any) => {
        this.errorLogger.error(message);
    }

    useExpressMonganMiddleWare = (route: RouterInterface) => {
        let toggleColor = (message: string) => {
            if (message.search(' 200') > 0) {
                return '✅';
            }
            if (message.search(' 500') > 0) {
                return '❗';
            }
            if (message.search(' 201') > 0) {
                return '✅';
            }
            return '🔔';
        }
        
        let middleWare = morgan(
            'tiny',
            {
                stream: {
                    write: (message: string) => this.winston.createLogger({
                        format: this.winston.format.combine(
                            this.winston.format.colorize(),
                            this.winston.format.label({label: `${toggleColor(message.trim())}`, message: true}),
                            this.winston.format.timestamp(),
                            this.winston.format.printf((info) => {
                                return `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.message}`;
                            })
                        ),
                        transports: [new this.winston.transports.Console({level: 'http'})],}).http(message.trim()),
                },
            }
        );
        route.use(middleWare);
        this.logsWithRequest(route);
    }

    showRoutesEndPoints = (router: BaseRequestHandler, errorOnMultiple: boolean = true) => {
        setTimeout(() => {
            console.log(colors.bgRed('listing end points'));
            router.listEndPoint.forEach((endPoint, index) => {
                if (errorOnMultiple) {
                    const data = router.listEndPoint.filter((d) => d.endpoint === endPoint.endpoint && d.method === endPoint.method);
                    if (data.length > 1) {
                        throw Error(colors.magenta(`Multiple Endpoint ${data.length} ${endPoint.method} ${endPoint.endpoint}`))
                    }
                }
                if (endPoint.method === 'POST') {
                    console.log(colors.blue(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares} `));
                    return;
                }
                if (endPoint.method === 'GET') {
                    console.log(colors.green(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                    return;
                }
                if (endPoint.method === 'PUT') {
                    console.log(colors.magenta(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                    return;
                }
                if (endPoint.method === 'DELETE') {
                    console.log(colors.red(`${endPoint.method}  ${endPoint.endpoint} ${endPoint.middleWares}`));
                    return;
                }
            })
            console.log(colors.magenta(`you have ${colors.bold(router.listEndPoint.length.toString())} end points`));
        }, 2000);
    }

    private _initializeWithError = (fileLog: winston.transport, consoleLog: winston.transport) => {
        return this.winston.createLogger({
            format: this.winston.format.combine(
                this.winston.format.timestamp({}),
                this.winston.format.label({label: "!!🐞", message: true}),
                this.winston.format.colorize(),
                this.winston.format.simple(),
                this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [${info.message}]`)
            ),
            transports: [
                consoleLog,
                fileLog
            ]
        })
    }

    private _initializeWithInfo = (consoleLog: winston.transport) => {
        return this.winston.createLogger({
            format: this.winston.format.combine(
                this.winston.format.timestamp({}),
                this.winston.format.colorize(),
                this.winston.format.simple(),
                this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [ ${info.message} ]`)
            ),
            transports: [
                consoleLog
            ]
        })
    }

    private logsWithRequest = (router: RouterInterface) => {
        let code = ((new Date()).getMinutes() + (new Date()).getHours()) * 2;
        console.log(code);
        router.get(`/logs/view/:auth`, (req: any, res: any) => {
            const { auth } = req.params;
            console.log(auth)
            if (parseInt(auth) === code) {
                const data = fs.readFileSync(this.logFileDirectory);
                res.send(data);
            } else {
                res.send('auth is invalid');
            }
        });

        router.get(`/logs/clear/:auth`, (req: any, res: any) => {
            const { auth } = req.params;
            if (parseInt(auth) === code) {
                fs.writeFileSync(this.logFileDirectory, '');
                res.send("ID cleared successful");
            } else {
                res.send('auth is invalid');
            }
        });

        router.get(`/logs/resetId`, (req: any, res: any) => {
            code = ((new Date()).getMinutes() + (new Date()).getHours()) * 2;
            res.send("ID has been reset");
        });
    }
}

export const defaultLogger = new Logger();