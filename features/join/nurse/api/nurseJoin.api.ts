import { api } from "@/lib/apiClient";
import { NurseJoinFormData, NurseJoinResponse } from "../types/nurseJoinTypes";
import { format } from "date-fns";

export const submitNurseJoin = async (
  formData: NurseJoinFormData,
): Promise<NurseJoinResponse> => {
  const apiFormData = new FormData();

  apiFormData.append("name", formData.fullName);
  apiFormData.append("email", formData.email);
  apiFormData.append("phone", formData.phoneNumber);
  apiFormData.append("password", formData.password);
  apiFormData.append("gender", formData.gender);
  apiFormData.append(
    "date_of_birth",
    format(formData.dateOfBirth, "yyyy-MM-dd"),
  );
  apiFormData.append("years_of_experience", String(formData.yearsOfExperience));

  if (formData.brief) {
    apiFormData.append("brief", formData.brief);
  }

  apiFormData.append("nationalCard", formData.nationalCard);

  if (formData.bonusFile) {
    apiFormData.append("bonusFile", formData.bonusFile);
  }

  const response = await api.post<NurseJoinResponse>(
    "/nurses/signup",
    apiFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response;
};
