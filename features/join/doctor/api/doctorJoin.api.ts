import { api } from "@/lib/apiClient";
import {
  DoctorJoinResponse,
  DoctorJoinFormData,
} from "../types/doctorJoinTypes";
import { format } from "date-fns";

export const submitDoctorJoin = async (
  formData: DoctorJoinFormData,
): Promise<DoctorJoinResponse> => {
  const apiFormData = new FormData();

  apiFormData.append("name", formData.fullName);
  apiFormData.append("email", formData.email);
  apiFormData.append("phone", formData.phoneNumber);
  apiFormData.append("password", formData.password);

  if (formData.gender) {
    apiFormData.append("gender", formData.gender);
  }

  if (formData.dateOfBirth) {
    apiFormData.append(
      "date_of_birth",
      format(formData.dateOfBirth, "yyyy-MM-dd"),
    );
  }

  if (formData.availability_type) {
    apiFormData.append("availability_type", formData.availability_type);
  }

  if (formData.graduationCertificate) {
    apiFormData.append("graduationCertificate", formData.graduationCertificate);
  }
  if (formData.membershipCard) {
    apiFormData.append("membershipCard", formData.membershipCard);
  }
  if (formData.professionalPracticeCard) {
    apiFormData.append(
      "professionalPracticeCard",
      formData.professionalPracticeCard,
    );
  }
  if (formData.mastersCertificate) {
    apiFormData.append("mastersCertificate", formData.mastersCertificate);
  }
  if (formData.fellowshipCertificate) {
    apiFormData.append("fellowshipCertificate", formData.fellowshipCertificate);
  }
  if (formData.unionSpecializationCertificate) {
    apiFormData.append(
      "unionSpecializationCertificate",
      formData.unionSpecializationCertificate,
    );
  }

  const response = await api.post<DoctorJoinResponse>(
    "/doctors/signup",
    apiFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response;
};
