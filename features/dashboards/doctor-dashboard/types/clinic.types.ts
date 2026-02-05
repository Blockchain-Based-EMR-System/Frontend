import { ApiResponse } from "@/types";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  address_maps_link?: string | null;
  phone: string;
  opening_at: string;
  closing_at: string;
  canPayOnline: boolean;
  is_active: boolean;
  created_at: string;
  fees: number;
  created_by: string;
  isOwner: boolean;
}

export interface CreateClinicRequest {
  name: string;
  address: string;
  address_maps_link?: string;
  phone: string;
  opening_at: string;
  closing_at: string;
  fees: number;
  canPayOnline: boolean;
}

export interface UpdateClinicRequest {
  name?: string;
  address?: string;
  address_maps_link?: string;
  phone?: string;
  opening_at?: string;
  closing_at?: string;
  fees?: number;
  canPayOnline?: boolean;
}

export interface GetClinicsResponse extends ApiResponse<Clinic[]> {}

export interface GetClinicResponse extends ApiResponse<Clinic> {}

export interface CreateClinicResponse extends ApiResponse<undefined> {}

export interface UpdateClinicResponse extends ApiResponse<undefined> {}

export interface DeleteClinicResponse extends ApiResponse<undefined> {}

export interface UpdateClinicFeesRequest {
  fees: number;
}

export interface UpdateClinicFeesResponse extends ApiResponse<undefined> {}
