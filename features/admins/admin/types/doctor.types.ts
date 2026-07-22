import { Doctor } from "@/types";

export interface GetDoctorsResponse {
  data: Doctor[];
  messageEn: string;
  messageAr: string;
}
