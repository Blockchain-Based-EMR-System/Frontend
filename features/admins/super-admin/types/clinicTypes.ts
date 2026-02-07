export interface Clinic {
  id: string;
  name: string;
  is_active: boolean;
  opening_at: string;
  closing_at: string;
  address: string;
  address_maps_link: string;
  phone: string;
  canPayOnline: boolean;
}

export interface ClinicListResponse {
  data: Clinic[];
  message?: string;
  messageEn?: string;
  messageAr?: string;
}

export interface ClinicDetailResponse {
  data: Clinic;
  message?: string;
  messageEn?: string;
  messageAr?: string;
}
