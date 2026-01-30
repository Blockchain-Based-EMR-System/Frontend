export interface DoctorSpecialization {
    key: string;
    value: string;
}

export interface DoctorProfile {
    specialization: DoctorSpecialization;
    avg_time: string;
    account_status: string;
}

export interface DoctorUser {
    id: string;
    email: string;
    name: string;
    role: string;
    username: string;
    phone: string;
    gender: string;
    isVerified: boolean;
    hasCompletedProfile: boolean;
    date_of_birth: string | null;
    doctor: DoctorProfile;
    photoUrl: string;
    created_at?: string;
    updated_at?: string;
}

export interface GetDoctorsResponse {
    data: DoctorUser[];
    messageEn: string;
    messageAr: string;
}