// Tipos que reflejan la respuesta real del WooCommerce Store API v1

export interface WcImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface WcPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min_amount: string; max_amount: string } | null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WcAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WcAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: WcAttributeTerm[];
}

export interface WcVariationAttribute {
  name: string;
  value: string;
}

export interface WcVariation {
  id: number;
  attributes: WcVariationAttribute[];
}

export interface WcProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WcPrices;
  images: WcImage[];
  categories: WcProductCategory[];
  tags: WcProductCategory[];
  attributes: WcAttribute[];
  variations: WcVariation[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  low_stock_remaining: number | null;
  add_to_cart: {
    text: string;
    description: string;
    url: string;
    minimum: number;
    maximum: number;
    multiple_of: number;
  };
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  image: WcImage | null;
  review_count: number;
  permalink: string;
}

// --- Carrito (Store API) ---

export interface WcAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WcCartItemTotals {
  line_subtotal: string;
  line_subtotal_tax: string;
  line_total: string;
  line_total_tax: string;
  currency_code: string;
  currency_minor_unit: number;
  currency_symbol: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WcCartItemVariation {
  raw_attribute: string;
  attribute: string;
  value: string;
}

export interface WcCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  images: WcImage[];
  prices: WcPrices;
  totals: WcCartItemTotals;
  variation: WcCartItemVariation[];
  item_data: { name: string; value: string }[];
  permalink: string;
}

export interface WcShippingRate {
  rate_id: string;
  name: string;
  price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  selected: boolean;
}

export interface WcShippingPackage {
  package_id: number;
  name: string;
  destination: WcAddress;
  items: { key: string; name: string; quantity: number }[];
  shipping_rates: WcShippingRate[];
}

export interface WcCartTotals {
  total_items: string;
  total_items_tax: string;
  total_shipping: string | null;
  total_shipping_tax: string | null;
  total_discount: string;
  total_discount_tax: string;
  total_price: string;
  total_tax: string;
  currency_code: string;
  currency_minor_unit: number;
  currency_symbol: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WcCart {
  items: WcCartItem[];
  coupons: { code: string; discount: string }[];
  totals: WcCartTotals;
  shipping_address: WcAddress;
  billing_address: WcAddress;
  items_count: number;
  items_weight: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping_rates: WcShippingPackage[];
  payment_methods: string[];
}

export interface WcCheckoutResponse {
  order_id: number;
  status: string;
  order_key: string;
  payment_result: {
    payment_status: string;
    redirect_url: string;
    payment_details: { key: string; value: string }[];
  };
}
