import ky, { KyInstance } from "ky"
import { buildSignRequest } from "./utils"
import { AfdianClientOptions, AfdianOrderResponse, AfdianPlanInfo, AfdianQueryOrderRequestParams, AfdianQuerySponsorRequestParams, AfdianRequestParams, AfdianResponse, AfdianSponsorResponse } from "./types"
export * from "./types"

export class Afdian {
    #request: KyInstance = ky.create({
        prefixUrl: "https://ifdian.net/api/open",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    #builBody = (params?: AfdianRequestParams) => JSON.stringify(buildSignRequest(this.#opts, params))
    #opts: AfdianClientOptions
    constructor(opts: AfdianClientOptions) {
        this.#opts = opts
    }

    ping = async (): Promise<AfdianResponse> => await this.#request.post("ping", { body: this.#builBody() }).json()
    queryPlans = async (userid: string): Promise<AfdianPlanInfo[]> => {
        const res = await ky.get(`https://ifdian.net/api/creator/get-plans?user_id=${userid}`).json()
        // @ts-ignore
        return res.data.list
    }
    queryOrder = async (params: AfdianQueryOrderRequestParams): Promise<AfdianOrderResponse> => {
        // @ts-ignore
        params.out_trade_no = params.out_trade_no?.join(',')
        return await this.#request.post("query-order", {
            body: this.#builBody(params)
        }).json()
    }
    querySponsor = async (params: AfdianQuerySponsorRequestParams): Promise<AfdianSponsorResponse> => {
        // @ts-ignore
        params.out_trade_no = params.user_id?.join(',')
        return await this.#request.post("query-sponsor", {
            body: this.#builBody(params)
        }).json()
    }

}

export const createAfdian = async (opts: AfdianClientOptions) => {
    const afdian = new Afdian(opts)
    const pong = await afdian.ping()
    if (pong.ec === 200) {
        return afdian
    } else {
        throw pong
    }
}
