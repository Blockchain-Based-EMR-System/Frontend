export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  PATIENT = "PATIENT",
}

export enum DoctorAccountStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type Gender = "MALE" | "FEMALE";

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string | null;
  gender?: Gender | null;
  date_of_birth?: string | null;
  isVerified: boolean;
  hasCompletedProfile: boolean;
  role?: Role;
  profilePicture?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Doctor extends User {
  doctor?: {
    specialization: {
      key: string;
      value: string;
    };
    avg_time: string | null;
    account_status: DoctorAccountStatus;
    mastersCertificateUrl?: string | null;
    graduationCertificateUrl?: string | null;
    fellowshipCertificateUrl?: string | null;
    professionalPracticeCardUrl?: string | null;
    membershipCardUrl?: string | null;
    unionSpecializationCertificateUrl?: string | null;
  };
}

export interface Admin extends User {}
