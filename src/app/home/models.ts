export interface addressData {
  address: string;
  street_number: string;
  route: string;
  locality: string;
  administrative_area_level_1: string;
  country: string;
  postal_code: string;
}

export interface zillowData {
  value: string;
  square: string;
  built_year: string;
  estimate: string;
}

export interface personData {
  first_name: string;
  last_name: string;
  birthday: string;
}

export interface carData {
  year: string;
  make: string;
  model: string;
}

export interface CarYearData {
  year: number;
}

export interface APICommonData {
  city: string,
  state: string,
  postal_code: number,
  street: string,
  email: string,
  phone: string,
  year_built: number,
  estimate: number,
  sqft: number,
  mode: number,
  dwell_coverage?: number,
  ac_year: number,
  electric_year: number,
  plumbing_year: number,
  roof_year: number,
  construction_type: number,
  building_type: number,
  roof_type: number,
  roof_status: boolean,
  exterior_type: number,
  is_basement: boolean,
  is_bundle: boolean,
  is_security: boolean,
  is_smart: boolean,
  foundation_type: number,
  personData: object
}

export interface ModalData {
  type: number;
  price: Array<number>;
  imgURL: string;
  dwelling: Array<number>;
  liability: number;
  contents: number;
  waterBackup: number;
  deductible: number;
  keyword?: Array<string>;
  bgColor?: string;
  name?: string;
  btn_cls?: string;
  caroImages?: Array<string>;
  pricesType?: Array<string>;
  static?: boolean
}

/*comment*/
