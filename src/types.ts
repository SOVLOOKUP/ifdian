export interface AfdianClientOptions {
  userId: string;
  token: string;
}

export interface SkuDetail {
  sku_id: string;
  count: number;
  name: string;
  album_id: string;
  pic: string;
}

export interface AfdianRequestParams {
  page: number;
  per_page?: number;
}

export interface AfdianQueryOrderRequestParams extends AfdianRequestParams {
  out_trade_no?: string[];
}

export interface AfdianQuerySponsorRequestParams extends AfdianRequestParams {
  user_id?: string[];
}

export interface AfdianPlanInfo {
  can_ali_agreement: number;
  plan_id: string;
  rank: number;
  user_id: string;
  status: number;
  name: string;
  pic: string;
  desc: string;
  price: string;
  update_time: number;
  timing: {
    timing_on: number;
    timing_off: number;
  };
  pay_month: number;
  show_price: string;
  show_price_after_adjust: string;
  has_coupon: number;
  coupon: any[];
  favorable_price: number;
  independent: number;
  permanent: number;
  can_buy_hide: number;
  need_address: number;
  product_type: number;
  sale_limit_count: number;
  need_invite_code: boolean;
  bundle_stock: number;
  bundle_sku_select_count: number;
  config: {};
  has_plan_config: number;
  shipping_fee_info: any[];
  has_badge: number;
  sponsor_count: string;
  unlockNum: number;
  has_vip: number;
}

export interface Plan {
  name: string;
  plan_id: string;
  price: string;
  expire_time: number;
  sku_processed: SkuDetail[];
  rankType: number;
}

export interface AfdianSponsorInfo {
  sponsor_plans: Plan[];
  current_plan: Plan;
  all_sum_amount: string;
  first_pay_time: number;
  last_pay_time: number;
  user: {
    user_id: string;
    name: string;
    avatar: string;
    user_private_id: string;
  };
}

export interface AfdianResponse {
  ec: number;
  em: string;
  data?: unknown;
}

export interface AfdianSponsorResponse {
  ec: number;
  em: string;
  data: {
    total_count: number;
    total_page: number;
    list: AfdianSponsorInfo[];
  };
}

export interface AfdianOrderInfo {
  out_trade_no: string;
  user_id: string;
  plan_id: string;
  month: number;
  custom_order_id?: string;
  total_amount: string;
  show_amount: string;
  status: number;
  remark: string;
  redeem_id: string;
  product_type: number;
  discount: string;
  sku_detail: SkuDetail[];
  create_time: number;
  plan_title: string;
  user_private_id: string;
  address_person: string;
  address_phone: string;
  address_address: string;
}

export interface AfdianOrderResponse {
  ec: number;
  em: string;
  data: {
    list: AfdianOrderInfo[];
    total_count: number;
    total_page: number;
  };
}

export interface AfdianWebhookResponse {
  ec: number;
  em: string;
  data: {
    type: "order";
    order: AfdianOrderInfo;
  };
}

export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

export interface AfdianRequest {
  user_id: string;
  params?: string;
  ts: number;
}

export interface AfdianSignedRequest {
  user_id: string;
  params?: string;
  ts: number;
  sign: string;
}
