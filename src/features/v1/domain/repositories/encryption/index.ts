import AuthenticatedUser from "../../../../../core/interfaces/response/authenticated_user";

export enum TokenType {
    accessToken = 'ACCESS_TOKEN_SECRET',
    adminAccessToken = 'ADMIN_ACCESS_TOKEN_SECRET',
    refreshToken = 'REFRESH_TOKEN_SECRET',
    resetPassword = 'RESET_PASSWORD_SECRET',
    emailVerification = 'EMAIL_VERIFICATION_SECRET'
}

interface BearerToken {
    status: boolean,
    error?: string,
    data?: any,
}

interface IEncryptionRepository {
    
    generateVerificationCode: (numb: number) => string;

    encryptToken: (data: AuthenticatedUser, type: TokenType) => string;

    decryptToken: (data: string, type: TokenType) => any;

    createSpecialKey: (data: {prefix?: string, suffix?: string, removeDashes?: boolean}) => string;

    verifyBearerToken: (data: string, type: TokenType) => BearerToken;

    encryptPassword: (password: string) => string;

    comparePassword: (passwordToEncypt: string, encryptedPassword: string) => boolean;
}

export default IEncryptionRepository;