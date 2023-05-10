import urlPath from 'path';
import RouterInterface from '../others/router';

class CustomizedAppRouter {
    private router: RouterInterface
    private host: string
    private endPointList: { endpoint: string, method: string, middleWares: string[] }[] = []

    constructor({router, host} : { router: RouterInterface,  host: string}) {
        this.router = router;
        this.host = host;
    }

    get listEndPoint() {
        return this.endPointList;
    }

    private _recordEndpoint = (path: string, method: string, middleWare: string[]) => {
        this.endPointList.push({
            endpoint: path,
            method: method,
            middleWares: middleWare
        });
    }

    public post = (path: string, ...args: Function[]) => {
        const host = `${this.host}${path}`;
        this._recordEndpoint(host, 'POST', []);
        return this.router.post(host, ...args);
    }

    public get = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        this._recordEndpoint(host, 'GET', []);
        return this.router.get(host, ...args);
    }

    public put = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        this._recordEndpoint(host, 'PUT', []);
        return this.router.put(host, ...args);
    }

    public delete = (path: string, ...args: any[]) => {
        const host = `${this.host}${path}`;
        this._recordEndpoint(host, 'DELETE', []);
        return this.router.delete(host, ...args);
    }

    public use = (path: string, ...args: any[]) => {
        return this.router.use(path, ...args);
    }

    public extend = (path: string, callback: ({router}: {router: CustomizedAppRouter}) => void) => {
        let trimmedPath = path.trim()[0] === '/' ? path.trim().substring(1) : path.trim();
        const router = new CustomizedAppRouter({
            router: this.router,
            host: urlPath.join(this.host, trimmedPath),
        });
        callback({router});

        setTimeout(()=> {
            this.endPointList.push(...router.endPointList);
        }, 1000);
    }
}

export default CustomizedAppRouter;