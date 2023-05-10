import { ResponseInterface } from "../../../../../core/interfaces/response/response";
import Usecase from "../../../../../core/interfaces/usecase/usecase";
import AuthenticatedUsecase from "../../../../../core/interfaces/usecase/usecase_with_auth";
import { Response as ExpressResponse, Request as PrevExpressRequest } from 'express'
import EncryptionRepository from "../../repositories/encryption";
import AuthenticatedUser from "../../../../../core/interfaces/response/authenticated_user";
import { TokenType } from "../../../domain/repositories/encryption";

interface ExpressRequest extends PrevExpressRequest {
    user: AuthenticatedUser
}


class ApiRequestHandler {
    tokenType: TokenType
    encryptionResitory: EncryptionRepository;

    constructor ({encryptionRepository, tokenType}: { encryptionRepository: EncryptionRepository; tokenType: TokenType }) {
        this.encryptionResitory = encryptionRepository;
        this.tokenType = tokenType;
    }

    private createSendResponse = <Response>(res: ExpressResponse) => {
        const sendResponse = (response: ResponseInterface<Response>) => {
            res.status(200).json(response);
        }
        return sendResponse;
    }

    private authenticateRequest = (authenticationSuccessCall: (req: ExpressRequest, res: ExpressResponse) => void) => {
        return (req: ExpressRequest, res: ExpressResponse) => {
            try {
                if (!req.headers["authorization"]) {
                    return res.status(500).json({
                        status: false,
                        noToken: true,
                        error: [{field: 'authorization', message: 'authorization token is missing'}]
                    });
                }
                const response = this.encryptionResitory.verifyBearerToken(req.headers["authorization"], this.tokenType);
                if ( response.status === false || !response.data ) {
                    return res.status(403).json({
                        status: response.status,
                        noToken: true,
                        error: [{field: 'authorization', message: response.error}],
                    });
                }
                req.user = response.data;
                return authenticationSuccessCall(req, res);
            } catch (error) {
                res.status(500).json({
                    status: false,
                    noToken: true,
                    error: [{field: 'authorization', message: error}]
                })
            }
        }
    }

    handleBodyRequest = <Request, Response>(usecase: Usecase<Request, Response>) => {
        return (req: ExpressRequest, res: ExpressResponse) => {
            const request: Request = req.body;

            const sendResponse = this.createSendResponse(res)

            usecase.execute(request, sendResponse);
        }
    }

    handleAuthenticatedBodyRequest = <Request, Response>(usecase: AuthenticatedUsecase<Request, Response>) => {
        return this.authenticateRequest((req: ExpressRequest, res: ExpressResponse) => {
            const request: Request = req.body;
            const user: AuthenticatedUser = req.user;

            const sendResponse = this.createSendResponse(res)

            usecase.execute(request, user, sendResponse);
        });
    }

    handleQueryRequest = <Request, Response>(usecase: Usecase<Request, Response>) => {
        return (req: ExpressRequest, res: ExpressResponse) => {
            const request: Request = req.query as any;

            const sendResponse = this.createSendResponse(res);

            usecase.execute(request, sendResponse);
        }
    }

    handleAuthenticatedQueryRequest = <Request, Response>(usecase: AuthenticatedUsecase<Request, Response>) => {
        return this.authenticateRequest((req: ExpressRequest, res: ExpressResponse) => {
            const request: Request = req.query as any;
            const user: AuthenticatedUser = req.user;

            const sendResponse = this.createSendResponse(res);

            usecase.execute(request, user, sendResponse);
        });
    }
}

export default ApiRequestHandler;