import { describe, test, expect } from '@jest/globals';
import EncryptionRepository from '../../../../../../src/features/v1/data/repositories/encryption'
import { UserDTO } from '../../../../../../src/features/v1/domain/entities/user.dto'
import { TokenType } from '../../../../../../src/features/v1/domain/repositories/encryption';
import { mockedUser } from '../../../../../mock/entities/user.mock';

describe('Testing encryption repository in the data layer', () => {
    const encryptionRepository = new EncryptionRepository();

    test('tesing encryptPassword and comparePassword method in encryption repository', () => {
        const passwordToEncypt = 'thisIsMyPassword';
        const encryptedPassword = encryptionRepository.encryptPassword(passwordToEncypt);

        expect(encryptedPassword).not.toBe(passwordToEncypt);
        expect(encryptionRepository.comparePassword(passwordToEncypt, encryptedPassword)).toBe(true);
        expect(encryptionRepository.comparePassword('notMyPassword', encryptedPassword)).toBe(false);
    });

    test('tesing generateVerificationCode method in encryption repository', () => {
        const verificationCode1 = encryptionRepository.generateVerificationCode(6);
        const verificationCode2 = encryptionRepository.generateVerificationCode(6);
        expect(verificationCode1).not.toBe(verificationCode2);

        expect(verificationCode1.length).toBe(6);
        expect(verificationCode2.length).toBe(6);
    });

    test('tesing encryptToken and verifyBearerToken method in encryption repository', () => {
        const authenticated_user = (new UserDTO(mockedUser)).getAuthenticatedUserData()
        const user_token = encryptionRepository.encryptToken(authenticated_user, TokenType.accessToken);

        expect(authenticated_user).not.toBe(user_token);

        const bearer_token = `Bearer ${user_token}`;

        const processed_authenticated_user = encryptionRepository.verifyBearerToken(bearer_token, TokenType.accessToken);
        expect(processed_authenticated_user.status).toBe(true);
        expect(processed_authenticated_user.data?.email).toBe(authenticated_user.email);
        expect(processed_authenticated_user.data?.id).toBe(authenticated_user.id);
    });
})