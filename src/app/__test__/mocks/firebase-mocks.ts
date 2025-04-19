import { User, UserCredential } from "firebase/auth";

export const mockUser: User = {
    uid: "test-user-id",
    email: "test@example.com",
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "mock-refresh-token",
    tenantId: null,
    delete: jest.fn(() => Promise.resolve()),
    getIdToken: jest.fn(() => Promise.resolve("mock-id-token")),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(() => Promise.resolve()),
    toJSON: jest.fn(() => ({})),
    displayName: "Test User",
    phoneNumber: null,
    photoURL: null,
    providerId: "firebase"
};

export const mockUserCredential: UserCredential = {
    user: mockUser,
    providerId: "password",
    operationType: "signIn"
};