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

export interface GetClinicsResponse {
  data: Clinic[];
  messageEn: string;
  messageAr: string;
}

export interface GetClinicDetailResponse {
  data: Clinic;
  messageEn: string;
  messageAr: string;
}

export interface SetActiveStatusResponse {
  data: {
    id: string;
    name: string;
    is_active: boolean;
  };
  messageEn: string;
  messageAr: string;
}
