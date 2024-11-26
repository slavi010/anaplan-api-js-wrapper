const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const AnaplanAuth = require('../src/repositories/anaplanAuth');

const mock = new MockAdapter(axios);
const anaplanAuth = new AnaplanAuth();

describe('AnaplanAuth', () => {
    afterEach(() => {
        mock.reset();
    });

    test('createAuthToken should create an auth token', async () => {
        const username = 'testUser';
        const password = 'testPassword';
        const response = {
            meta: { validationUrl: 'https://auth.anaplan.com/token/validate' },
            status: 'SUCCESS',
            statusMessage: 'Login successful',
            tokenInfo: {
                expiresAt: 1493036651173,
                tokenId: '9aa99999-1111-11a2-b333-abc11223ab12',
                tokenValue: 'aBCDdefghilMnz30PrD8Iw==.twOZw6fT+ttckbx5Ap3TRvjAAgqHY4UrgkRLiyvQppI8ULyPCc59GNimzco4pBXaMM8wEJ1yrJE6C4Vd6GflfjdUVhGpaji4oG+NBzVnBvA+bBfFnmwWsOiL/8kge+cFxqbW+XqLAAHz3aRV6WgB7wYGXP/0AYant1VKAHFLcnSzRtJqeKakW+rnbUf6eHDQWsF/7AhfG7PJ6qDS8zm8JMjWSZdb0WsOzr79A/IcL1tu4iyn2n9gKA6l9cOhPhYT3AEQJE4GCtLA9eEYILBTbKC4LWuxgnmo+G8VkAIsBoAy8dcSRBPXHZMKRZ5ssmpO766zOZqpdkcX0RcH2dwKUqZefwNrfhdoKy5rmi54/LU93YVYv/d/Mm8HyfV9sWkfEKvFHGM1v+PmCQJLh/CQvHtdu5fd6Had4L0arKa574XsUb07mwKau53Xn+iBBcDu.0CpRsu37FpDizsfXVCxOQ7iLBjJM6+72hczGl4+3RQ4=',
                refreshTokenId: '3ab11111-2222-33e4-a111-01a1b222cd3a'
            }
        };

        mock.onPost(`${anaplanAuth.baseUrl}/token/authenticate`).reply(200, response);

        const result = await anaplanAuth.createAuthToken(username, password);
        expect(result).toEqual(response);
    });

    test('createAuthTokenWithCertificate should create an auth token with certificate', async () => {
        const cert = 'base64EncodedCert';
        const encodedString = 'base64EncodedString';
        const encodedSignedString = 'base64EncodedSignedString';
        const response = {
            meta: { validationUrl: 'https://auth.anaplan.com/token/validate' },
            status: 'SUCCESS',
            statusMessage: 'Login successful',
            tokenInfo: {
                expiresAt: 1493036651173,
                tokenId: '9aa99999-1111-11a2-b333-abc11223ab12',
                tokenValue: 'aBCDdefghilMnz30PrD8Iw==.twOZw6fT+ttckbx5Ap3TRvjAAgqHY4UrgkRLiyvQppI8ULyPCc59GNimzco4pBXaMM8wEJ1yrJE6C4Vd6GflfjdUVhGpaji4oG+NBzVnBvA+bBfFnmwWsOiL/8kge+cFxqbW+XqLAAHz3aRV6WgB7wYGXP/0AYant1VKAHFLcnSzRtJqeKakW+rnbUf6eHDQWsF/7AhfG7PJ6qDS8zm8JMjWSZdb0WsOzr79A/IcL1tu4iyn2n9gKA6l9cOhPhYT3AEQJE4GCtLA9eEYILBTbKC4LWuxgnmo+G8VkAIsBoAy8dcSRBPXHZMKRZ5ssmpO766zOZqpdkcX0RcH2dwKUqZefwNrfhdoKy5rmi54/LU93YVYv/d/Mm8HyfV9sWkfEKvFHGM1v+PmCQJLh/CQvHtdu5fd6Had4L0arKa574XsUb07mwKau53Xn+iBBcDu.0CpRsu37FpDizsfXVCxOQ7iLBjJM6+72hczGl4+3RQ4=',
                refreshTokenId: '3ab11111-2222-33e4-a111-01a1b222cd3a'
            }
        };

        mock.onPost(`${anaplanAuth.baseUrl}/token/authenticate`).reply(200, response);

        const result = await anaplanAuth.createAuthTokenWithCertificate(cert, encodedString, encodedSignedString);
        expect(result).toEqual(response);
    });

    test('getAuthTokenDetails should get auth token details', async () => {
        const authToken = 'testAuthToken';
        const response = {
            meta: { validationUrl: 'https://auth.anaplan.com/token/validate' },
            status: 'SUCCESS',
            statusMessage: 'Token validated',
            userInfo: {
                userGuid: '8a89d9999f3c7099015f999d5208458a',
                userId: 'a.user@anaplan.com',
                customerGuid: '8a80d99a5bf97b99995c3d1577610415'
            },
            tokenInfo: {
                expiresAt: 1509728252000,
                tokenId: '4d677e7d-c0ae-11e7-9f79-b179910b5099'
            }
        };

        mock.onGet(`${anaplanAuth.baseUrl}/token/validate`).reply(200, response);

        const result = await anaplanAuth.getAuthTokenDetails(authToken);
        expect(result).toEqual(response);
    });

    test('refreshAuthToken should refresh auth token', async () => {
        const authToken = 'testAuthToken';
        const response = {
            meta: { validationUrl: 'https://auth.anaplan.com/token/validate' },
            status: 'SUCCESS',
            statusMessage: 'Token refreshed',
            tokenInfo: {
                expiresAt: 1509725972924,
                tokenId: '4d688e7d-c0ae-11e7-9f69-b170010b5016',
                tokenValue: 'wOlfU2tLezUAkmLY/C5lXw==.CH9fWgnDiN099USFFAWrrtoCoqVS/xixNtG4V0Vk6f2zVAa/lTmjJsHeSxSXAW9HRH2EA+q7rLzmtWvkdi8dtOv/hExmpNRfTtux/9t8RXVFmNMxro+tPbhfE/MUPSiaxzyRlSYkpph8WFIWKlrLhZ0Iw/iweuSIlAwVtXhbsDt674T5GiJxS35wh1h5ateeylU/1Y3Het+YR5F/8idr1oZu5cd+SE16tHLUPJQwp5uGkfTTBp5CR/zv4wzIsY35wGpgEAgUC4F19zASo6/EB6Br2KmyqJEmUIWmFJRRk9qmjJpS05FHUTXVpU5d2psrRRGUh1XNLoOOnz7DopuhTS4TwiI3AJeNYca3IfeGQo7LyfAmsTc4QL6xsQh5M6G5q/+wfNFY1zHVxSf/nugfHJOBRUnLMUgs46/TMWTqhMoweFsMG84uI0eHA3SAAiFQ.63GpdlW8HpciJq24dr4klBCog1TEIkTj6NBS+iPM4uY=',
                refreshTokenId: '95ee4c30-c0ae-11e7-be10-c9ac36e86de2'
            }
        };

        mock.onPost(`${anaplanAuth.baseUrl}/token/refresh`).reply(200, response);

        const result = await anaplanAuth.refreshAuthToken(authToken);
        expect(result).toEqual(response);
    });

    test('logout should log out the user', async () => {
        const authToken = 'testAuthToken';

        mock.onPost(`${anaplanAuth.baseUrl}/token/logout`).reply(204);

        await expect(anaplanAuth.logout(authToken)).resolves.toBeUndefined();
    });
});