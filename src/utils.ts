import { md5 } from 'super-fast-md5';
import { AfdianClientOptions, AfdianRequest, AfdianRequestParams, AfdianSignedRequest } from './types';
const buildRequest = (userId: string, params?: AfdianRequestParams): AfdianRequest => {
    const req = {
        user_id: userId,
        ts: Math.floor(Date.now() / 1000),
        params: JSON.stringify(params || { empty: true })
    };
    return req;
};
const signRequest = (token: string, body: AfdianRequest): AfdianSignedRequest => {
    const toSign = `${token}params${body.params}ts${body.ts}user_id${body.user_id}`;
    const sign = md5(toSign).toString();
    return {
        ...body,
        sign
    };
};

export const buildSignRequest = (opts: AfdianClientOptions, params?: AfdianRequestParams) => {
    return signRequest(opts.token, buildRequest(opts.userId, params))
}