import RouterInterface from "./router";

interface LoggerInterface {
    warn: (message: string) => void;

    info: (message: string) => void;

    error: (message: string) => void;

    useExpressMonganMiddleWare: (route: RouterInterface) => void;
}

export default LoggerInterface;