import { jest } from "@jest/globals";
import AuthenticatedUser from "../../../../src/core/interfaces/response/authenticated_user";
import EncryptionRepositoryInterface, { TokenType } from "../../../../src/features/v1/domain/repositories/encryption";

class MockEncryptionRepository implements EncryptionRepositoryInterface {
    generateVerificationCode = jest.fn((numb: number) => '000000');
    encryptToken = jest.fn((data: AuthenticatedUser, type: TokenType) => '000000');
    decryptToken = jest.fn(( data: string, type: TokenType) => '000000' );
    createSpecialKey = jest.fn(({ prefix, suffix, removeDashes }: { prefix?: string; suffix?: string; removeDashes?: boolean; }) => '000000');
    verifyBearerToken = jest.fn(( data: string, type: TokenType) => ({ status: true }) );
    encryptPassword = jest.fn(( password: string) => '000000' );
    comparePassword = jest.fn(( password: string, userPassword: string ) => true);
};

export default MockEncryptionRepository;