export interface DoctorJoinFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;

  graduationCertificate: File;
  membershipCard: File;
  professionalPracticeCard: File;

  mastersCertificate: File;
  fellowshipCertificate: File;
  unionSpecializationCertificate: File;
}

export interface DoctorJoinApiRequest {
  email: string;
  name: string;
  phone: string;
  password: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  graduationCertificate: File;
  membershipCard: File;
  professionalPracticeCard: File;
  mastersCertificate: File;
  fellowshipCertificate: File;
  unionSpecializationCertificate: File;
}

export interface DoctorJoinResponse {
  messageEn: string;
  messageAr: string;
  message?: string;
}
