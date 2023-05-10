import { jest } from '@jest/globals';

import  AuthValidatorInterface from '../../../../src/features/v1/domain/repositories/validators'
import { LoginUserRequest, RegisterRegularUserRequest } from '../../../../src/features/v1/domain/entities/requests/auth.request'
import { UpdateKYCInformationRequest } from '../../../../src/features/v1/domain/entities/requests/kyc.request'
import { UpdatePersonalUserRequest } from '../../../../src/features/v1/domain/entities/requests/user.request'

class MockAuthValidator implements AuthValidatorInterface {
    validatePersonnalUserBeforeRegistration = jest.fn(async (request: RegisterRegularUserRequest) => []);
    validateUserBeforeLogin = jest.fn(async ({ email, password }: LoginUserRequest) => []);

    validateKycInformation = jest.fn(async (request: UpdateKYCInformationRequest) => []);
    validatePersonnalUserBeforeUpdate = jest.fn(async (request: UpdatePersonalUserRequest) => []);
};

export default MockAuthValidator;