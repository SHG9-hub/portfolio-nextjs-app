import { signUpUser, signInUser, signOutUser } from '@/app/lib/firebase/firebaseauth';
import { mockUserCredential } from '../mocks/firebase-mocks';

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve(mockUserCredential)),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve(mockUserCredential)),
    signOut: jest.fn(() => Promise.resolve()),
    getAuth: jest.fn(() => ({}))
}));

jest.mock('@/app/lib/firebase/firebase', () => ({
    auth: {}
}));

const originalConsoleError = console.error;

describe('Firebase認証関数のテスト', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    describe('signUpUser', () => {
        it('ユーザー登録の際に"signUpUser"関数が実行され引数の受け渡しも問題ないこと', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            const user = await signUpUser(email, password);

            expect(user).toBeDefined();
            expect(user?.email).toBe(email);
        });

        it('エラー時にundefinedを返すこと', async () => {
            const createUserWithEmailAndPassword = require('firebase/auth').createUserWithEmailAndPassword;
            createUserWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(new Error('登録エラー')));

            const user = await signUpUser('error@example.com', 'password');

            expect(user).toBeUndefined();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('signInUser', () => {
        it('サインインの際に"signInUser関数が実行されユーザーがサインインできること"', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            const user = await signInUser(email, password);

            expect(user).toBeDefined();
            expect(user?.email).toBe(email);
        });

        it('エラー時にundefinedを返すこと', async () => {
            const signInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
            signInWithEmailAndPassword.mockImplementationOnce(() => Promise.reject(new Error('サインインエラー')));

            const user = await signInUser('error@example.com', 'password');

            expect(user).toBeUndefined();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('signOutUser', () => {
        it('"signOutUser"が実行され正常にサインアウトできること', async () => {
            const signOut = require('firebase/auth').signOut;

            await signOutUser();

            expect(signOut).toHaveBeenCalled();
        });

        it('エラー時にもエラーをスローしないこと', async () => {
            const signOut = require('firebase/auth').signOut;
            signOut.mockImplementationOnce(() => Promise.reject(new Error('サインアウトエラー')));

            await expect(signOutUser()).resolves.not.toThrow();
            expect(console.error).toHaveBeenCalled();
        });
    });
}); 