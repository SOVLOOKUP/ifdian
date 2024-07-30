import type { KyInstance } from "ky";
import { buildSignRequest } from "./utils";
import type {
  AfdianClientOptions,
  AfdianOrderResponse,
  AfdianPlanInfo,
  AfdianQueryOrderRequestParams,
  AfdianQuerySponsorRequestParams,
  AfdianRequestParams,
  AfdianResponse,
  AfdianSponsorResponse,
  Unwrap,
} from "./types";
export * from "./types";

export class Afdian {
  #request: KyInstance;
  #builBody = (params?: AfdianRequestParams) =>
    JSON.stringify(buildSignRequest(this.#opts, params));
  #opts: AfdianClientOptions;
  constructor(opts: AfdianClientOptions) {
    this.#opts = opts;
  }
  init = async () => {
    this.#request = (await import("ky")).default.create({
      prefixUrl: "https://ifdian.net/api/open",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  ping = async (): Promise<AfdianResponse> =>
    await this.#request.post("ping", { body: this.#builBody() }).json();
  queryOrder = async (
    params: AfdianQueryOrderRequestParams
  ): Promise<AfdianOrderResponse> => {
    // @ts-ignore
    params.out_trade_no = params.out_trade_no?.join(",");
    return await this.#request
      .post("query-order", {
        body: this.#builBody(params),
      })
      .json();
  };
  querySponsor = async (
    params: AfdianQuerySponsorRequestParams
  ): Promise<AfdianSponsorResponse> => {
    // @ts-ignore
    params.out_trade_no = params.user_id?.join(",");
    return await this.#request
      .post("query-sponsor", {
        body: this.#builBody(params),
      })
      .json();
  };
  queryAllGenerator = async <
    T extends typeof this.queryOrder | typeof this.querySponsor
  >(
    method: T,
    params: Omit<Parameters<T>["0"], "page" | "per_page">
  ) => {
    const first = await method({
      page: 1,
      ...params,
    });
    let max = first.data.total_page;
    let result: (ReturnType<T> | Unwrap<ReturnType<T>>)[] = [];
    while (max > 1) {
      result.push(
        method({
          page: max,
          ...params,
        }) as ReturnType<T>
      );
      max--;
    }
    result.push(first as Unwrap<ReturnType<T>>);
    return (async function* () {
      while (result.length > 0) {
        const target = await result.pop();
        if (target !== undefined) {
          for (const t of target.data.list) {
            yield t;
          }
        }
      }
    })();
  };
}

export const queryPlans = async (userid: string): Promise<AfdianPlanInfo[]> => {
  const ky = (await import("ky")).default;
  const res = await ky
    .get(`https://ifdian.net/api/creator/get-plans?user_id=${userid}`)
    .json();
  // @ts-ignore
  return res.data.list;
};

export const createAfdian = async (opts: AfdianClientOptions) => {
  const afdian = new Afdian(opts);
  await afdian.init()
  const pong = await afdian.ping();
  if (pong.ec === 200) {
    return afdian;
  } else {
    throw pong;
  }
};
