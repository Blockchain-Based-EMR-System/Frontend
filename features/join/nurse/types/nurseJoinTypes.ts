export interface NurseJoinFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;
  yearsOfExperience: number;
  brief?: string;
  nationalCard: File;
  bonusFile?: File;
}

export interface NurseJoinResponse {
  messageEn: string;
  messageAr: string;
  message?: string;
}
